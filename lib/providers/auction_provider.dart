import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:land_auction_app/models/auction.dart';
import 'package:land_auction_app/models/bid.dart';
import 'package:land_auction_app/services/auth_service.dart';

class AuctionProvider with ChangeNotifier {
  final SupabaseClient _supabase;
  late final AuthService _authService;
  
  List<Auction> _auctions = [];
  List<Bid> _bids = [];
  StreamSubscription<List<Map<String, dynamic>>>? _bidSubscription;
  bool _isLoading = false;
  StreamController<List<Bid>>? _bidStreamController;
  
  AuctionProvider(this._supabase) {
    _authService = AuthService(_supabase);
    // Subscribe to auction changes
    _supabase.from('auctions')
      .stream(primaryKey: ['id'])
      .order('created_at')
      .listen((List<Map<String, dynamic>> data) async {
        try {
          // Fetch complete auction data with land listings
          final response = await _supabase
            .from('auctions')
            .select('*, land_listings(*)')
            .in_('id', data.map((d) => d['id']).toList());
            
          _auctions = (response as List)
            .map((json) => Auction.fromJson(json))
            .toList();
          notifyListeners();
        } catch (e) {
          debugPrint('Error mapping auction data: $e');
        }
      });
  }
  
  List<Auction> get auctions => [..._auctions];
  bool get isLoading => _isLoading;
  
  List<Auction> get activeAuctions => _auctions
    .where((auction) => auction.isActive)
    .toList();
    
  List<Auction> get upcomingAuctions => _auctions
    .where((auction) => auction.isUpcoming)
    .toList();
    
  List<Auction> get pastAuctions => _auctions
    .where((auction) => auction.hasEnded)
    .toList();
  
  Auction? getAuctionById(String id) {
    try {
      return _auctions.firstWhere((auction) => auction.id == id);
    } catch (e) {
      return null;
    }
  }
  
  Future<void> fetchAuctions() async {
    try {
      _isLoading = true;
      notifyListeners();
      
      final response = await _supabase
        .from('auctions')
        .select('*, land_listings(*)')
        .order('created_at');
        
      _auctions = (response as List)
        .map((json) {
          try {
            return Auction.fromJson(json);
    } catch (e) {
            debugPrint('Error mapping auction: $e');
            return null;
          }
        })
        .whereType<Auction>()
        .toList();
    } catch (error) {
      debugPrint('Error fetching auctions: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
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
      debugPrint('Updated auction final price');

      // Fetch updated bids
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
  
  Future<List<Bid>> getAuctionBids(String auctionId) async {
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
    
    return response.map<Bid>((json) => Bid.fromJson(json)).toList();
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
          
        return Auction.fromJson(response);
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
} 