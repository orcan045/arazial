import 'dart:convert';
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
      
      // Fetch fresh data
      debugPrint('Fetching fresh auctions data from Supabase');
      final response = await _supabase
        .from('auctions')
        .select('*')
        .order('created_at');
        
      debugPrint('Received response with ${response.length} auctions');
      
      if (response.isNotEmpty) {
        debugPrint('First auction in response: ${response[0]}');
        // If we got a new format or different fields, log them for debugging
        final sampleAuction = response[0];
        debugPrint('Sample auction keys: ${sampleAuction.keys.toList()}');
      }
      
      // Process each auction to ensure it has valid fields
      final processedAuctions = await Future.wait(
        (response as List).map((auction) async {
          try {
            // Handle custom fields that might be in the response but not in the Auction model
            // Ensure required fields exist with proper types
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
        })
      );
      
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
      
      final data = result['data'] as List;
      debugPrint('Filtering ${data.length} auctions');
      
      final now = DateTime.now();
      
      // 1. First, filter active auctions
      final active = data.where((auction) {
        final startTime = DateTime.parse(auction['start_time']);
        final endTime = DateTime.parse(auction['end_time']);
        final status = auction['status'];
        
        // Either explicitly marked as active
        if (status == 'active') return true;
        
        // OR current time is within auction window AND not marked as upcoming/ended
        return status != 'upcoming' && status != 'ended' &&
               now.isAfter(startTime) && now.isBefore(endTime);
      }).toList();
      
      // 2. Then upcoming auctions
      final activeIds = active.map((a) => a['id']).toSet();
      final upcoming = data.where((auction) {
        // Skip if already in active tab
        if (activeIds.contains(auction['id'])) return false;
        
        final startTime = DateTime.parse(auction['start_time']);
        final status = auction['status'];
        
        // Either explicitly marked as upcoming
        if (status == 'upcoming') return true;
        
        // OR start time is in the future AND not marked as ended
        return status != 'ended' && now.isBefore(startTime);
      }).toList();
      
      // 3. Finally, past auctions
      final upcomingIds = upcoming.map((a) => a['id']).toSet();
      final past = data.where((auction) {
        // Skip if already in active or upcoming tabs
        if (activeIds.contains(auction['id']) || upcomingIds.contains(auction['id'])) return false;
        
        final endTime = DateTime.parse(auction['end_time']);
        final status = auction['status'];
        
        // Either explicitly marked as ended
        if (status == 'ended') return true;
        
        // OR current time is after end time
        return now.isAfter(endTime);
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