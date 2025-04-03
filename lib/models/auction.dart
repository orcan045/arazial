import 'package:flutter/foundation.dart';
import 'dart:convert';

// Enum for listing types
enum ListingType {
  auction,
  offer
}

// Extension to convert string to enum and vice versa
extension ListingTypeExtension on ListingType {
  String get value {
    switch (this) {
      case ListingType.auction:
        return 'auction';
      case ListingType.offer:
        return 'offer';
    }
  }
  
  static ListingType fromString(String? value) {
    if (value == 'offer') return ListingType.offer;
    return ListingType.auction;
  }
}

class Auction {
  final String id;
  final double startPrice;
  final double minIncrement;
  final DateTime startTime;
  final DateTime endTime;
  final String status;
  final String? winnerId;
  final double? finalPrice;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> images;
  final String? title;
  final String? description;
  final String? location;
  final double? areaSize;
  final String? areaUnit;
  final ListingType listingType;
  final double? offerIncrement;

  Auction({
    required this.id,
    required this.startPrice,
    required this.minIncrement,
    required this.startTime,
    required this.endTime,
    required this.status,
    this.winnerId,
    this.finalPrice,
    required this.createdAt,
    required this.updatedAt,
    this.images = const [],
    this.title,
    this.description,
    this.location,
    this.areaSize,
    this.areaUnit,
    this.listingType = ListingType.auction,
    this.offerIncrement,
  });

  // Check if auction is currently active
  bool get isActive {
    final now = DateTime.now();
    
    // Explicitly marked as active
    if (status == 'active') return true;
    
    // OR current time is within auction window AND not marked as upcoming/ended
    return status != 'upcoming' && status != 'ended' && 
           now.isAfter(startTime) && now.isBefore(endTime);
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
  
  // Get minimum next offer amount for offer listings
  double get minimumNextOffer => 
    currentPrice + (offerIncrement ?? 0);

  // Check if auction has ended
  bool get hasEnded {
    final now = DateTime.now();
    
    // Explicitly marked as ended
    if (status == 'ended') return true;
    
    // OR current time is after end time
    return now.isAfter(endTime);
  }

  // Check if auction is upcoming
  bool get isUpcoming {
    final now = DateTime.now();
    
    // Explicitly marked as upcoming
    if (status == 'upcoming') return true;
    
    // OR start time is in the future AND not marked as ended
    return status != 'ended' && now.isBefore(startTime);
  }

  // Factory constructor to create Auction from JSON data
  factory Auction.fromJson(Map<String, dynamic> json) {
    print('Parsing auction JSON: ${json['id']}');
    
    // Process images
    List<String> imagesList = [];
    if (json['images'] != null) {
      try {
        if (json['images'] is List) {
          imagesList = List<String>.from(json['images']);
        } else if (json['images'] is String) {
          // Try to parse as JSON if it's a string
          try {
            final decoded = jsonDecode(json['images']);
            if (decoded is List) {
              imagesList = List<String>.from(decoded);
            }
          } catch (e) {
            print('Error parsing images JSON: $e');
          }
        }
      } catch (e) {
        print('Error processing images: $e');
      }
    }
    
    // Parse timestamps
    DateTime startTime, endTime, createdAt, updatedAt;
    
    try {
      startTime = DateTime.parse(json['start_time']);
      endTime = DateTime.parse(json['end_time']);
      createdAt = DateTime.parse(json['created_at']);
      updatedAt = DateTime.parse(json['updated_at']);
    } catch (e) {
      print('Error parsing dates: $e');
      // Fallback to current time if parsing fails
      final now = DateTime.now();
      startTime = now;
      endTime = now.add(const Duration(days: 7));
      createdAt = now;
      updatedAt = now;
    }
    
    // Parse listing type
    final listingTypeStr = json['listing_type'] as String?;
    final listingType = ListingTypeExtension.fromString(listingTypeStr);
    
    return Auction(
      id: json['id'],
      startPrice: json['start_price'] != null 
        ? (json['start_price'] is int 
            ? json['start_price'].toDouble() 
            : json['start_price'])
        : 0.0,
      minIncrement: json['min_increment'] != null 
        ? (json['min_increment'] is int 
            ? json['min_increment'].toDouble() 
            : json['min_increment'])
        : 0.0,
      startTime: startTime,
      endTime: endTime,
      status: json['status'] ?? 'pending',
      winnerId: json['winner_id'],
      finalPrice: json['final_price'] != null 
        ? (json['final_price'] is int 
            ? json['final_price'].toDouble() 
            : json['final_price'])
        : null,
      createdAt: createdAt,
      updatedAt: updatedAt,
      images: imagesList,
      title: json['title'],
      description: json['description'],
      location: json['location'],
      areaSize: json['area_sqm'] != null 
        ? (json['area_sqm'] is int 
            ? json['area_sqm'].toDouble() 
            : json['area_sqm'])
        : null,
      areaUnit: json['area_unit'],
      listingType: listingType,
      offerIncrement: json['offer_increment'] != null 
        ? (json['offer_increment'] is int 
            ? json['offer_increment'].toDouble() 
            : json['offer_increment'])
        : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'start_price': startPrice,
      'min_increment': minIncrement,
      'start_time': startTime.toIso8601String(),
      'end_time': endTime.toIso8601String(),
      'status': status,
      'winner_id': winnerId,
      'final_price': finalPrice,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      'images': images,
      'title': title,
      'description': description,
      'location': location,
      'area_size': areaSize,
      'area_unit': areaUnit,
      'listing_type': listingType.value,
      'offer_increment': offerIncrement,
    };
  }

  // Create a copy of the auction with updated values
  Auction copyWith({
    String? id,
    double? startPrice,
    double? minIncrement,
    DateTime? startTime,
    DateTime? endTime,
    String? status,
    String? winnerId,
    double? finalPrice,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<String>? images,
    String? title,
    String? description,
    String? location,
    double? areaSize,
    String? areaUnit,
    ListingType? listingType,
    double? offerIncrement,
  }) {
    return Auction(
      id: id ?? this.id,
      startPrice: startPrice ?? this.startPrice,
      minIncrement: minIncrement ?? this.minIncrement,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      status: status ?? this.status,
      winnerId: winnerId ?? this.winnerId,
      finalPrice: finalPrice ?? this.finalPrice,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      images: images ?? this.images,
      title: title ?? this.title,
      description: description ?? this.description,
      location: location ?? this.location,
      areaSize: areaSize ?? this.areaSize,
      areaUnit: areaUnit ?? this.areaUnit,
      listingType: listingType ?? this.listingType,
      offerIncrement: offerIncrement ?? this.offerIncrement,
    );
  }

  /// Returns the listing type for display in UI
  String get listingTypeDisplay {
    switch (listingType) {
      case ListingType.offer:
        return 'Pazarlık';
      case ListingType.auction:
      default:
        return 'İhale';
    }
  }
  
  /// Returns true if this is an offer-type listing
  bool get isOfferType => listingType == ListingType.offer;
  
  /// Returns true if this is a standard auction-type listing
  bool get isAuctionType => listingType == ListingType.auction;
} 