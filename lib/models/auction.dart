import 'package:flutter/foundation.dart';

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

  factory Auction.fromJson(Map<String, dynamic> json) {
    try {
      // Debug output
      debugPrint('Parsing auction JSON: ${json['id']}');
      
      if (json['id'] == null) {
        debugPrint('WARNING: Auction is missing id field: $json');
        throw Exception('Auction missing required id field');
      }
      
      // Handle various pricing fields
      double startPrice = 0;
      if (json['start_price'] != null) {
        startPrice = (json['start_price'] as num).toDouble();
      } else if (json['starting_price'] != null) {
        startPrice = (json['starting_price'] as num).toDouble();
      }
      
      // Handle minimum increment
      double minIncrement = 0;
      if (json['min_increment'] != null) {
        minIncrement = (json['min_increment'] as num).toDouble();
      }
      
      // Handle dates with fallbacks
      DateTime startTime;
      if (json['start_time'] != null) {
        startTime = DateTime.parse(json['start_time'] as String);
      } else if (json['start_date'] != null) {
        startTime = DateTime.parse(json['start_date'] as String);
      } else {
        startTime = DateTime.now();
      }
      
      DateTime endTime;
      if (json['end_time'] != null) {
        endTime = DateTime.parse(json['end_time'] as String);
      } else if (json['end_date'] != null) {
        endTime = DateTime.parse(json['end_date'] as String);
      } else {
        endTime = DateTime.now().add(const Duration(days: 1));
      }
      
      // Handle status with fallback
      String status = json['status'] as String? ?? 'unknown';
      
      // Handle timestamps with fallbacks
      DateTime createdAt;
      if (json['created_at'] != null) {
        createdAt = DateTime.parse(json['created_at'] as String);
      } else {
        createdAt = DateTime.now();
      }
      
      DateTime updatedAt;
      if (json['updated_at'] != null) {
        updatedAt = DateTime.parse(json['updated_at'] as String);
      } else {
        updatedAt = DateTime.now();
      }
      
      // Handle final price
      double? finalPrice;
      if (json['final_price'] != null) {
        finalPrice = (json['final_price'] as num).toDouble();
      }
      
      // Handle images
      List<String> images = [];
      if (json['images'] != null) {
        try {
          if (json['images'] is List) {
            images = (json['images'] as List).map((img) => img.toString()).toList();
          }
        } catch (e) {
          debugPrint('Error parsing images for auction ${json['id']}: $e');
        }
      }
      
      // Handle title, description, location
      String? title = json['title'] as String?;
      String? description = json['description'] as String?;
      String? location = json['location'] as String?;
      
      // Handle area size and unit
      double? areaSize;
      if (json['area_size'] != null) {
        areaSize = (json['area_size'] as num).toDouble();
      }
      String? areaUnit = json['area_unit'] as String?;
      
      return Auction(
        id: json['id'] as String,
        startPrice: startPrice,
        minIncrement: minIncrement,
        startTime: startTime,
        endTime: endTime,
        status: status,
        winnerId: json['winner_id'] as String?,
        finalPrice: finalPrice,
        createdAt: createdAt,
        updatedAt: updatedAt,
        images: images,
        title: title,
        description: description,
        location: location,
        areaSize: areaSize,
        areaUnit: areaUnit,
      );
    } catch (e) {
      debugPrint('Error parsing auction: $e');
      debugPrint('Problematic JSON: $json');
      rethrow;
    }
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
    };
  }

  // Create a copy of this auction with the given fields replaced
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
    );
  }
} 