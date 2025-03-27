class Bid {
  final String id;
  final String auctionId;
  final String bidderId;
  final String? bidderName;
  final double amount;
  final DateTime createdAt;

  Bid({
    required this.id,
    required this.auctionId,
    required this.bidderId,
    this.bidderName,
    required this.amount,
    required this.createdAt,
  });

  factory Bid.fromJson(Map<String, dynamic> json) {
    final profiles = json['profiles'] as Map<String, dynamic>?;
    
    return Bid(
      id: json['id'] as String,
      auctionId: json['auction_id'] as String,
      bidderId: json['bidder_id'] as String,
      bidderName: profiles?['full_name'] as String?,
      amount: (json['amount'] as num).toDouble(),
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'auction_id': auctionId,
      'bidder_id': bidderId,
      'amount': amount,
      'created_at': createdAt.toIso8601String(),
    };
  }
} 