import 'dart:convert';
import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:land_auction_app/models/auction.dart';

/// Service for handling auctions-related API calls
class AuctionService {
  final SupabaseClient _supabase;
  
  // Caching constants
  static const String _cacheKey = 'auctions_cache';
  static const Duration _cacheDuration = Duration(minutes: 5);
  
  AuctionService(this._supabase);
  
  /// Fetch all auctions with improved error handling and caching
  Future<Map<String, dynamic>> fetchAuctions({bool forceRefresh = false}) async {
    try {
      // Use local cache with timestamp to prevent excessive refetching
      final now = DateTime.now();
      
      // Check if we have cached data and it's fresh enough
      if (!forceRefresh) {
        try {
          final prefs = await SharedPreferences.getInstance();
          final cachedData = prefs.getString(_cacheKey);
          
          if (cachedData != null) {
            final cacheMap = jsonDecode(cachedData);
            final timestamp = DateTime.parse(cacheMap['timestamp']);
            
            if (now.difference(timestamp) < _cacheDuration) {
              debugPrint('Using cached auction data');
              return {
                'data': cacheMap['data'],
                'error': null,
                'timestamp': timestamp,
              };
            }
          }
        } catch (cacheError) {
          debugPrint('Error accessing cache: $cacheError');
          // Continue to fetch fresh data
        }
      }
      
      // Fetch fresh data with a direct approach
      debugPrint('Fetching fresh auctions data from Supabase');
      
      try {
        // Make the API call with a timeout
        final response = await _supabase
          .from('auctions')
          .select('*')
          .order('created_at')
          .timeout(const Duration(seconds: 5));
          
        debugPrint('Received response with ${response.length} auctions');
        
        if (response.isNotEmpty) {
          // Process each auction to ensure it has valid fields
          final processedAuctions = response.map((auction) {
            try {
              _ensureValidAuctionFields(auction);
              return auction;
            } catch (e) {
              debugPrint('Error processing auction: $e');
              // Return a minimal valid auction to avoid crashing
              return {
                'id': auction['id'] ?? 'unknown-id',
                'start_price': auction['start_price'] ?? auction['starting_price'] ?? 0,
                'min_increment': auction['min_increment'] ?? 0,
                'start_time': auction['start_time'] ?? auction['start_date'] ?? now.toIso8601String(),
                'end_time': auction['end_time'] ?? auction['end_date'] ?? now.add(const Duration(days: 1)).toIso8601String(),
                'status': auction['status'] ?? 'unknown',
                'created_at': auction['created_at'] ?? now.toIso8601String(),
                'updated_at': auction['updated_at'] ?? now.toIso8601String(),
              };
            }
          }).toList();
          
          // Cache the results
          try {
            final prefs = await SharedPreferences.getInstance();
            final cacheData = {
              'data': processedAuctions,
              'timestamp': now.toIso8601String(),
            };
            await prefs.setString(_cacheKey, jsonEncode(cacheData));
          } catch (storageError) {
            debugPrint('Error storing in cache: $storageError');
          }
          
          debugPrint('Fetched and processed ${processedAuctions.length} auctions');
          return {
            'data': processedAuctions,
            'error': null,
            'timestamp': now
          };
        } else {
          debugPrint('API returned empty response');
          throw Exception('No auction data received');
        }
      } catch (apiError) {
        debugPrint('API error: $apiError');
        throw apiError; // Rethrow to be caught by outer try-catch
      }
    } catch (error) {
      debugPrint('Error fetching auctions: $error');
      
      // Try to return cached data even if it's stale
      try {
        final prefs = await SharedPreferences.getInstance();
        final cachedData = prefs.getString(_cacheKey);
        
        if (cachedData != null) {
          final cacheMap = jsonDecode(cachedData);
          final timestamp = DateTime.parse(cacheMap['timestamp']);
          
          debugPrint('Returning stale cached data due to fetch error');
          return {
            'data': cacheMap['data'],
            'error': null,
            'timestamp': timestamp
          };
        }
      } catch (cacheError) {
        debugPrint('Error accessing cache during recovery: $cacheError');
      }
      
      return {
        'data': null,
        'error': error.toString()
      };
    }
  }
  
  // Helper method to ensure auction data has valid fields
  void _ensureValidAuctionFields(Map<String, dynamic> auction) {
    final now = DateTime.now();
    
    // If there are alternative field names, map them to the expected ones
    if (auction['starting_price'] != null && auction['start_price'] == null) {
      auction['start_price'] = auction['starting_price'];
    }
    
    if (auction['start_date'] != null && auction['start_time'] == null) {
      auction['start_time'] = auction['start_date'];
    }
    
    if (auction['end_date'] != null && auction['end_time'] == null) {
      auction['end_time'] = auction['end_date'];
    }
    
    // Provide fallbacks for missing required fields
    if (auction['start_price'] == null) {
      debugPrint('Warning: Adding default start_price for auction ${auction['id']}');
      auction['start_price'] = 0;
    }
    
    if (auction['min_increment'] == null) {
      debugPrint('Warning: Adding default min_increment for auction ${auction['id']}');
      auction['min_increment'] = 0;
    }
    
    if (auction['start_time'] == null) {
      debugPrint('Warning: Adding default start_time for auction ${auction['id']}');
      auction['start_time'] = now.toIso8601String();
    }
    
    if (auction['end_time'] == null) {
      debugPrint('Warning: Adding default end_time for auction ${auction['id']}');
      auction['end_time'] = now.add(const Duration(days: 1)).toIso8601String();
    }
    
    if (auction['status'] == null) {
      debugPrint('Warning: Adding default status for auction ${auction['id']}');
      auction['status'] = 'unknown';
    }
    
    if (auction['created_at'] == null) {
      debugPrint('Warning: Adding default created_at for auction ${auction['id']}');
      auction['created_at'] = now.toIso8601String();
    }
    
    if (auction['updated_at'] == null) {
      debugPrint('Warning: Adding default updated_at for auction ${auction['id']}');
      auction['updated_at'] = now.toIso8601String();
    }
    
    // Log any other fields that might be useful
    final otherFields = auction.keys.where(
      (key) => !['id', 'land_id', 'start_price', 'min_increment', 'start_time', 
                 'end_time', 'status', 'winner_id', 'final_price', 'created_at', 
                 'updated_at', 'land_listings'].contains(key)
    );
    
    if (otherFields.isNotEmpty) {
      debugPrint('Additional fields in auction ${auction['id']}: ${otherFields.join(', ')}');
    }
  }
  
  /// Get active, upcoming, and past auctions
  Future<Map<String, dynamic>> getFilteredAuctions() async {
    try {
      final result = await fetchAuctions();
      
      if (result['error'] != null) {
        throw result['error'];
      }
      
      // Handle different data structures that might be returned
      final dynamic rawData = result['data'];
      List<Map<String, dynamic>> auctionsList = [];
      
      // Extract the actual list of auctions regardless of format
      if (rawData is List) {
        // Direct list of auctions
        debugPrint('Data is a direct List of auctions');
        auctionsList = List<Map<String, dynamic>>.from(
          rawData.map((item) => item as Map<String, dynamic>)
        );
      } else if (rawData is Map<String, dynamic>) {
        // Map structure that might contain auctions
        debugPrint('Data is a Map structure, extracting auctions list');
        // Try to find a list within the map
        if (rawData.containsKey('auctions') && rawData['auctions'] is List) {
          auctionsList = List<Map<String, dynamic>>.from(
            (rawData['auctions'] as List).map((item) => item as Map<String, dynamic>)
          );
        } else {
          // Just use all the map values that are maps themselves as individual auctions
          final possibleAuctions = rawData.entries
              .where((entry) => entry.value is Map<String, dynamic>)
              .map((entry) => entry.value as Map<String, dynamic>)
              .toList();
              
          if (possibleAuctions.isNotEmpty) {
            auctionsList = possibleAuctions;
          } else {
            throw Exception('Could not find auctions data in the response');
          }
        }
      } else {
        throw Exception('Unknown data format in auctions response: ${rawData.runtimeType}');
      }
      
      debugPrint('Found ${auctionsList.length} auctions to filter');
      
      final now = DateTime.now();
      
      // 1. First, filter active auctions
      final active = auctionsList.where((auction) {
        try {
          final startTime = DateTime.parse(auction['start_time']);
          final endTime = DateTime.parse(auction['end_time']);
          final status = auction['status'];
          
          // Either explicitly marked as active
          if (status == 'active') return true;
          
          // OR current time is within auction window AND not marked as upcoming/ended
          return status != 'upcoming' && status != 'ended' &&
                 now.isAfter(startTime) && now.isBefore(endTime);
        } catch (e) {
          debugPrint('Error processing auction for active filter: $e');
          return false;
        }
      }).toList();
      
      // 2. Then upcoming auctions
      final activeIds = active.map((a) => a['id']).toSet();
      final upcoming = auctionsList.where((auction) {
        try {
          // Skip if already in active tab
          if (activeIds.contains(auction['id'])) return false;
          
          final startTime = DateTime.parse(auction['start_time']);
          final status = auction['status'];
          
          // Either explicitly marked as upcoming
          if (status == 'upcoming') return true;
          
          // OR start time is in the future AND not marked as ended
          return status != 'ended' && now.isBefore(startTime);
        } catch (e) {
          debugPrint('Error processing auction for upcoming filter: $e');
          return false;
        }
      }).toList();
      
      // 3. Finally, past auctions
      final upcomingIds = upcoming.map((a) => a['id']).toSet();
      final past = auctionsList.where((auction) {
        try {
          // Skip if already in active or upcoming tabs
          if (activeIds.contains(auction['id']) || upcomingIds.contains(auction['id'])) return false;
          
          final endTime = DateTime.parse(auction['end_time']);
          final status = auction['status'];
          
          // Either explicitly marked as ended
          if (status == 'ended') return true;
          
          // OR current time is after end time
          return now.isAfter(endTime);
        } catch (e) {
          debugPrint('Error processing auction for past filter: $e');
          return false;
        }
      }).toList();
      
      debugPrint('Filtered auctions: ${active.length} active, ${upcoming.length} upcoming, ${past.length} past');
      
      return {
        'active': active,
        'upcoming': upcoming,
        'past': past,
        'error': null,
        'timestamp': result['timestamp']
      };
    } catch (error) {
      debugPrint('Error getting filtered auctions: $error');
      return {
        'active': [],
        'upcoming': [],
        'past': [],
        'error': error.toString()
      };
    }
  }
} 