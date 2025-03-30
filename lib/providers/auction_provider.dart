import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:land_auction_app/models/auction.dart';
import 'package:land_auction_app/models/bid.dart';
import 'package:land_auction_app/services/auth_service.dart';
import 'package:land_auction_app/services/auction_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuctionProvider with ChangeNotifier {
  final SupabaseClient _supabase;
  late final AuthService _authService;
  late final AuctionService _auctionService;
  
  List<Auction> _auctions = [];
  List<Auction> _activeAuctions = [];
  List<Auction> _upcomingAuctions = [];
  List<Auction> _pastAuctions = [];
  
  List<Bid> _bids = [];
  StreamSubscription<List<Map<String, dynamic>>>? _bidSubscription;
  bool _isLoading = false;
  bool _hasError = false;
  String? _errorMessage;
  DateTime? _lastFetchTime;
  StreamController<List<Bid>>? _bidStreamController;
  
  // Caching constants
  static const String _cacheKey = 'auctions_cache';
  static const Duration _cacheDuration = Duration(minutes: 5);
  
  AuctionProvider(this._supabase) {
    _authService = AuthService(_supabase);
    _auctionService = AuctionService(_supabase);
    
    // Initialize: fetch auctions from backend immediately
    fetchAuctions(forceRefresh: true);
    
    // Subscribe to auction changes
    _supabase.from('auctions')
      .stream(primaryKey: ['id'])
      .order('created_at')
      .listen((List<Map<String, dynamic>> data) async {
        debugPrint('Received auction update from Supabase realtime. Data count: ${data.length}');
        if (data.isNotEmpty) {
          debugPrint('First auction update: ${data[0]}');
        }
        
        // When we get a realtime update, fetch fresh data to ensure we have everything
        await fetchAuctions(forceRefresh: true);
      },
      onError: (error) {
        debugPrint('Error in auction stream: $error');
        // PostgrestError has been replaced with more specific error types in Supabase
        // Just log the error details without trying to cast to a specific type
      });
  }
  
  // Initialize data on startup
  Future<void> _initializeData() async {
    // First try to load from cache
    await _loadFromCache();
    // Then fetch fresh data from backend
    await fetchAuctions();
  }
  
  // Load auctions from cache
  Future<void> _loadFromCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cachedData = prefs.getString(_cacheKey);
      
      if (cachedData != null) {
        final Map<String, dynamic> cacheMap = jsonDecode(cachedData);
        final timestamp = DateTime.parse(cacheMap['timestamp']);
        final now = DateTime.now();
        
        // Use cache if it's fresh enough
        if (now.difference(timestamp) < _cacheDuration) {
          final Map<String, List<dynamic>> auctionsData = cacheMap['data'];
          
          _auctions = auctionsData['all']
              ?.map((json) => Auction.fromJson(json))
              ?.toList() ?? [];
              
          _activeAuctions = auctionsData['active']
              ?.map((json) => Auction.fromJson(json))
              ?.toList() ?? [];
              
          _upcomingAuctions = auctionsData['upcoming']
              ?.map((json) => Auction.fromJson(json))
              ?.toList() ?? [];
              
          _pastAuctions = auctionsData['past']
              ?.map((json) => Auction.fromJson(json))
              ?.toList() ?? [];
              
          _lastFetchTime = timestamp;
          notifyListeners();
          debugPrint('Loaded auctions from cache: ${_auctions.length} total, ${_activeAuctions.length} active');
        } else {
          debugPrint('Cache expired, will fetch fresh data');
        }
      }
    } catch (e) {
      debugPrint('Error loading from cache: $e');
    }
  }
  
  // Save auctions to cache
  Future<void> _saveToCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cacheData = {
        'timestamp': DateTime.now().toIso8601String(),
        'data': {
          'all': _auctions.map((a) => a.toJson()).toList(),
          'active': _activeAuctions.map((a) => a.toJson()).toList(),
          'upcoming': _upcomingAuctions.map((a) => a.toJson()).toList(),
          'past': _pastAuctions.map((a) => a.toJson()).toList(),
        }
      };
      await prefs.setString(_cacheKey, jsonEncode(cacheData));
      debugPrint('Saved auctions to cache: ${_auctions.length} total, ${_activeAuctions.length} active');
    } catch (e) {
      debugPrint('Error saving to cache: $e');
    }
  }
  
  List<Auction> get auctions => [..._auctions];
  List<Auction> get activeAuctions => [..._activeAuctions];
  List<Auction> get upcomingAuctions => [..._upcomingAuctions];
  List<Auction> get pastAuctions => [..._pastAuctions];
  
  bool get isLoading => _isLoading;
  bool get hasError => _hasError;
  String? get errorMessage => _errorMessage;
  DateTime? get lastFetchTime => _lastFetchTime;
  
  Auction? getAuctionById(String id) {
    try {
      return _auctions.firstWhere((auction) => auction.id == id);
    } catch (e) {
      return null;
    }
  }
  
  Future<void> fetchAuctions({bool forceRefresh = false}) async {
    // Skip fetching if we're already loading and it's not a forced refresh
    if (_isLoading && !forceRefresh) return;
    
    try {
      _isLoading = true;
      _hasError = false;
      _errorMessage = null;
      notifyListeners();
      
      // Use the service to get filtered auctions
      final result = await _auctionService.getFilteredAuctions();
      
      if (result['error'] != null) {
        throw result['error'];
      }
      
      _lastFetchTime = result['timestamp'] ?? DateTime.now();
      
      // Process active auctions
      final activeData = result['active'] as List;
      _activeAuctions = _parseAuctionsList(activeData);
      debugPrint('Parsed ${_activeAuctions.length} active auctions');
      
      // Process upcoming auctions
      final upcomingData = result['upcoming'] as List;
      _upcomingAuctions = _parseAuctionsList(upcomingData);
      debugPrint('Parsed ${_upcomingAuctions.length} upcoming auctions');
      
      // Process past auctions
      final pastData = result['past'] as List;
      _pastAuctions = _parseAuctionsList(pastData);
      debugPrint('Parsed ${_pastAuctions.length} past auctions');
      
      // Combine all auctions to maintain the full list
      _auctions = [..._activeAuctions, ..._upcomingAuctions, ..._pastAuctions];
      
      debugPrint('Total auctions: ${_auctions.length}');
      
    } catch (error) {
      debugPrint('Error fetching auctions: $error');
      _hasError = true;
      _errorMessage = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  List<Auction> _parseAuctionsList(List auctionsData) {
    final result = <Auction>[];
    
    debugPrint('Parsing ${auctionsData.length} auctions');
    
    for (var i = 0; i < auctionsData.length; i++) {
      try {
        final item = auctionsData[i];
        debugPrint('Sample auction data ${i+1}/${auctionsData.length}: $item');
        
        // Check if the item has the required fields
        if (item['id'] == null) {
          debugPrint('Skipping auction with missing id field');
          continue;
        }
        
        final auction = Auction.fromJson(item);
        result.add(auction);
        debugPrint('Successfully parsed auction: ${auction.id}');
      } catch (e) {
        debugPrint('Error parsing auction at index $i: $e');
      }
    }
    
    debugPrint('Successfully parsed ${result.length}/${auctionsData.length} auctions');
    return result;
  }
  
  Future<bool> placeBid(String auctionId, double amount) async {
    if (_authService.currentUser == null) return false;
    
    _isLoading = true;
    notifyListeners();
    
    try {
      final auction = getAuctionById(auctionId);
      if (auction == null) {
        _isLoading = false;
        notifyListeners();
        return false;
      }
      
      // Get the latest bid for this auction
      final latestBidResponse = await _supabase
          .from('bids')
          .select('amount')
          .eq('auction_id', auctionId)
          .order('amount', ascending: false)
          .limit(1)
          .maybeSingle();
      
      final latestBidAmount = latestBidResponse != null 
          ? (latestBidResponse['amount'] as num).toDouble()
          : auction.startPrice;
      
      // Check if bid is valid
      if (amount <= latestBidAmount) {
        debugPrint('Bid rejected: amount ($amount) must be greater than latest bid ($latestBidAmount)');
        _isLoading = false;
        notifyListeners();
        return false;
      }
      
      // Check if bid meets minimum increment
      if (amount < auction.minimumNextBid) {
        debugPrint('Bid rejected: amount ($amount) is less than minimum next bid (${auction.minimumNextBid})');
        _isLoading = false;
        notifyListeners();
        return false;
      }
      
      debugPrint('Placing bid of $amount for auction $auctionId');
      
      // Place bid in Supabase
      final bidResponse = await _supabase.from('bids').insert({
        'auction_id': auctionId,
        'bidder_id': _authService.currentUser!.id,
        'amount': amount,
      }).select().single();
      debugPrint('Bid placed successfully: ${bidResponse['id']}');
      
      // Update auction's final price
      await _supabase
          .from('auctions')
          .update({'final_price': amount})
          .eq('id', auctionId);
      debugPrint('Updated auction final price to $amount');

      // Fetch updated bids to refresh the UI
      final response = await _supabase
          .from('bids')
          .select('*, profiles:bidder_id(*)')
          .eq('auction_id', auctionId)
          .order('created_at', ascending: false);
      debugPrint('Fetched updated bids: ${response.length} bids');
      
      // Update the stream with new bids
      final bids = (response as List<dynamic>)
          .map((bid) => Bid.fromJson(bid))
          .toList();
      _bids = bids;
      _bidStreamController?.add(bids);
      
      // If we have an updated auction, add it to the auctions list
      final updatedAuction = auction.copyWith(finalPrice: amount);
      final auctionIndex = _auctions.indexWhere((a) => a.id == auctionId);
      if (auctionIndex >= 0) {
        _auctions[auctionIndex] = updatedAuction;
      }
      
      // Refresh all auctions to ensure everything is up-to-date
      fetchAuctions(forceRefresh: true);
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('Error placing bid: $e');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  Future<List<Bid>> getAuctionBids(String auctionId, {bool forceRefresh = false}) async {
    try {
      // Check cache first
      final cacheKey = 'auction_bids_${auctionId}';
      
      // Skip cache if force refresh requested
      if (!forceRefresh) {
        try {
          final prefs = await SharedPreferences.getInstance();
          final cachedData = prefs.getString(cacheKey);
          
          if (cachedData != null) {
            final map = jsonDecode(cachedData);
            final timestamp = DateTime.parse(map['timestamp']);
            final now = DateTime.now();
            
            // Use cache if it's fresh (less than 1 minute old)
            if (now.difference(timestamp) < const Duration(minutes: 1)) {
              final List<dynamic> bidsData = map['data'];
              return bidsData.map<Bid>((json) => Bid.fromJson(json)).toList();
            }
          }
        } catch (e) {
          debugPrint('Error accessing bid cache: $e');
        }
      }
      
      // Fetch fresh data
      final response = await _supabase
          .from('bids')
          .select('''
            *,
            profiles (
              id,
              full_name
            )
          ''')
          .eq('auction_id', auctionId)
          .order('amount', ascending: false);
      
      final bids = response.map<Bid>((json) => Bid.fromJson(json)).toList();
      
      // Cache the results
      try {
        final prefs = await SharedPreferences.getInstance();
        final cacheData = {
          'timestamp': DateTime.now().toIso8601String(),
          'data': response,
        };
        await prefs.setString(cacheKey, jsonEncode(cacheData));
      } catch (e) {
        debugPrint('Error saving bids to cache: $e');
      }
      
      return bids;
    } catch (e) {
      debugPrint('Error fetching auction bids: $e');
      return [];
    }
  }
  
  Stream<Auction> subscribeToAuction(String auctionId) {
    return _supabase
      .from('auctions')
      .stream(primaryKey: ['id'])
      .eq('id', auctionId)
      .asyncMap((data) async {
        if (data.isEmpty) return null;
        
        // Fetch complete auction data with land listing
        final response = await _supabase
          .from('auctions')
          .select('*, land_listings(*)')
          .eq('id', auctionId)
          .single();
          
        // Get the latest bid for this auction to ensure price is up-to-date
        final latestBidResponse = await _supabase
          .from('bids')
          .select('amount')
          .eq('auction_id', auctionId)
          .order('amount', ascending: false)
          .limit(1)
          .maybeSingle();
          
        // Create the auction from the response
        Auction auction = Auction.fromJson(response);
        
        // Update the finalPrice if the latest bid is higher than the stored finalPrice
        if (latestBidResponse != null) {
          final latestBidAmount = (latestBidResponse['amount'] as num).toDouble();
          if (auction.finalPrice == null || latestBidAmount > auction.finalPrice!) {
            // Update the auction in Supabase
            await _supabase
              .from('auctions')
              .update({'final_price': latestBidAmount})
              .eq('id', auctionId);
            
            // Return an updated auction object with the correct finalPrice
            auction = auction.copyWith(finalPrice: latestBidAmount);
          }
        }
        
        return auction;
      })
      .where((auction) => auction != null)
      .cast<Auction>()
      .asBroadcastStream();
  }
  
  @override
  void dispose() {
    _bidSubscription?.cancel();
    _bidStreamController?.close();
    super.dispose();
  }

  Stream<List<Bid>> subscribeToAuctionBids(String auctionId) {
    debugPrint('Subscribing to bids for auction $auctionId');
    
    // Cancel existing subscriptions
    _bidSubscription?.cancel();
    _bidStreamController?.close();
    
    // Create a new StreamController
    _bidStreamController = StreamController<List<Bid>>.broadcast(
      onListen: () {
        debugPrint('Stream has a listener');
        // Initial fetch of bids
        _supabase
            .from('bids')
            .select('*, profiles:bidder_id(*)')
            .eq('auction_id', auctionId)
            .order('created_at', ascending: false)
            .then((response) {
              debugPrint('Initial bids fetched: ${response.length} bids');
              if (!_bidStreamController!.isClosed) {
                final bids = (response as List<dynamic>)
                    .map((bid) => Bid.fromJson(bid))
                    .toList();
                _bids = bids;
                _bidStreamController!.add(bids);
                notifyListeners();
              }
            })
            .catchError((error) {
              debugPrint('Error fetching initial bids: $error');
              if (!_bidStreamController!.isClosed) {
                _bidStreamController!.addError(error);
              }
            });

        // Subscribe to real-time changes
        _bidSubscription = _supabase
            .from('bids')
            .stream(primaryKey: ['id'])
            .eq('auction_id', auctionId)
            .order('created_at', ascending: false)
            .listen(
              (data) {
                debugPrint('Received bid stream event with ${data.length} bids');
                if (!_bidStreamController!.isClosed) {
                  final bids = data.map((json) => Bid.fromJson(json)).toList();
                  _bids = bids;
                  _bidStreamController!.add(bids);
                  notifyListeners();
                }
              },
              onError: (error) {
                debugPrint('Error in bid stream: $error');
                if (!_bidStreamController!.isClosed) {
                  _bidStreamController!.addError(error);
                }
              },
            );
      },
      onCancel: () {
        debugPrint('Stream listener cancelled');
        _bidSubscription?.cancel();
        _bidStreamController?.close();
      },
    );
    
    return _bidStreamController!.stream;
  }

  List<Bid> get bids => [..._bids];
  
  // Method to fetch user's bids
  Future<List<Bid>> fetchUserBids({bool forceRefresh = false}) async {
    if (_authService.currentUser == null) return [];
    
    try {
      // Check cache first
      final cacheKey = 'user_bids_${_authService.currentUser!.id}';
      
      // Skip cache if force refresh requested
      if (!forceRefresh) {
        try {
          final prefs = await SharedPreferences.getInstance();
          final cachedData = prefs.getString(cacheKey);
          
          if (cachedData != null) {
            final map = jsonDecode(cachedData);
            final timestamp = DateTime.parse(map['timestamp']);
            final now = DateTime.now();
            
            // Use cache if it's fresh (less than 2 minutes old)
            if (now.difference(timestamp) < const Duration(minutes: 2)) {
              final List<dynamic> bidsData = map['data'];
              return bidsData.map<Bid>((json) => Bid.fromJson(json)).toList();
            }
          }
        } catch (e) {
          debugPrint('Error accessing user bids cache: $e');
        }
      }
      
      // Fetch fresh user's bids with auction details
      final response = await _supabase
          .from('bids')
          .select('''
            *,
            auctions (
              id, 
              title, 
              location, 
              status, 
              start_time, 
              end_time,
              start_price,
              final_price,
              images
            )
          ''')
          .eq('bidder_id', _authService.currentUser!.id)
          .order('created_at', ascending: false);
      
      debugPrint('Fetched user bids: ${response.length}');
      
      final List<Bid> userBids = [];
      for (var bidData in response) {
        try {
          final bid = Bid.fromJson(bidData);
          userBids.add(bid);
        } catch (e) {
          debugPrint('Error parsing bid: $e');
        }
      }
      
      // Cache the results
      try {
        final prefs = await SharedPreferences.getInstance();
        final cacheData = {
          'timestamp': DateTime.now().toIso8601String(),
          'data': response,
        };
        await prefs.setString(cacheKey, jsonEncode(cacheData));
      } catch (e) {
        debugPrint('Error saving user bids to cache: $e');
      }
      
      return userBids;
    } catch (e) {
      debugPrint('Error fetching user bids: $e');
      return [];
    }
  }
} 