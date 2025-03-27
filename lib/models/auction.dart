import 'package:land_auction_app/models/land_listing.dart';

class Auction {
  final String id;
  final String landId;
  final LandListing? landListing;
  final double startPrice;
  final double minIncrement;
  final DateTime startTime;
  final DateTime endTime;
  final String status;
  final String? winnerId;
  final double? finalPrice;
  final DateTime createdAt;
  final DateTime updatedAt;

  Auction({
    required this.id,
    required this.landId,
    this.landListing,
    required this.startPrice,
    required this.minIncrement,
    required this.startTime,
    required this.endTime,
    required this.status,
    this.winnerId,
    this.finalPrice,
    required this.createdAt,
    required this.updatedAt,
  });

  // Check if auction is currently active
  bool get isActive {
    final now = DateTime.now();
    return status == 'active' && 
           now.isAfter(startTime) && 
           now.isBefore(endTime);
  }

  // Get remaining time in seconds
  int get remainingTimeInSeconds {
    final now = DateTime.now();
    if (now.isAfter(endTime)) return 0;
    return endTime.difference(now).inSeconds;
  }

  // Get current price (either final price or start price)
  double get currentPrice => finalPrice ?? startPrice;

  // Get minimum next bid amount
  double get minimumNextBid => currentPrice + minIncrement;

  // Check if auction has ended
  bool get hasEnded {
    final now = DateTime.now();
    return now.isAfter(endTime) || status == 'ended';
  }

  // Check if auction is upcoming
  bool get isUpcoming {
    final now = DateTime.now();
    return status == 'upcoming' && now.isBefore(startTime);
  }

  factory Auction.fromJson(Map<String, dynamic> json) {
    return Auction(
      id: json['id'] as String,
      landId: json['land_id'] as String,
      landListing: json['land_listings'] != null
          ? LandListing.fromJson(json['land_listings'] as Map<String, dynamic>)
          : null,
      startPrice: (json['start_price'] as num).toDouble(),
      minIncrement: (json['min_increment'] as num).toDouble(),
      startTime: DateTime.parse(json['start_time'] as String),
      endTime: DateTime.parse(json['end_time'] as String),
      status: json['status'] as String,
      winnerId: json['winner_id'] as String?,
      finalPrice: json['final_price'] != null
          ? (json['final_price'] as num).toDouble()
          : null,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'land_id': landId,
      'start_price': startPrice,
      'min_increment': minIncrement,
      'start_time': startTime.toIso8601String(),
      'end_time': endTime.toIso8601String(),
      'status': status,
      'winner_id': winnerId,
      'final_price': finalPrice,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  // Create a copy of the auction with updated fields
  Auction copyWith({
    String? id,
    String? landId,
    LandListing? landListing,
    double? startPrice,
    double? minIncrement,
    DateTime? startTime,
    DateTime? endTime,
    String? status,
    String? winnerId,
    double? finalPrice,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Auction(
      id: id ?? this.id,
      landId: landId ?? this.landId,
      landListing: landListing ?? this.landListing,
      startPrice: startPrice ?? this.startPrice,
      minIncrement: minIncrement ?? this.minIncrement,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      status: status ?? this.status,
      winnerId: winnerId ?? this.winnerId,
      finalPrice: finalPrice ?? this.finalPrice,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
} 