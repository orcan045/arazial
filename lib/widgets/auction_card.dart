import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:land_auction_app/models/auction.dart';
import 'package:intl/intl.dart';
import 'package:land_auction_app/widgets/countdown_timer.dart';

class AuctionCard extends StatelessWidget {
  final Auction auction;
  final VoidCallback onTap;
  
  const AuctionCard({
    super.key,
    required this.auction,
    required this.onTap,
  });
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currencyFormat = NumberFormat.currency(
      locale: 'tr_TR',
      symbol: '₺',
      decimalDigits: 0,
    );
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image section
            Stack(
              children: [
                SizedBox(
                  height: 180,
                  width: double.infinity,
                  child: auction.landListing?.images != null && 
                         auction.landListing!.images.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: auction.landListing!.images.first,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => const Center(
                            child: CircularProgressIndicator(),
                          ),
                          errorWidget: (context, url, error) => const Icon(Icons.error),
                        )
                      : Container(
                          color: Colors.grey[200],
                          child: const Icon(
                            Icons.landscape,
                            size: 64,
                            color: Colors.grey,
                          ),
                        ),
                ),
                Positioned(
                  top: 12,
                  left: 12,
                  child: _buildStatusBadge(context),
                ),
                if (auction.isActive)
                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: CountdownTimer(
                        seconds: auction.remainingTimeInSeconds,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            
            // Content section
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    auction.landListing?.title ?? 'Arazi İhalesi',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        size: 16,
                        color: theme.colorScheme.primary,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          auction.landListing?.location ?? 'Konum belirtilmemiş',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 14,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(
                        Icons.straighten,
                        size: 16,
                        color: theme.colorScheme.primary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${auction.landListing?.areaSize ?? 0} ${auction.landListing?.areaUnit ?? 'm²'}',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Mevcut Teklif',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            currencyFormat.format(auction.currentPrice),
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.primary,
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton(
                        onPressed: onTap,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 10,
                          ),
                        ),
                        child: const Text('Detayları Gör'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildStatusBadge(BuildContext context) {
    final theme = Theme.of(context);
    
    Color badgeColor;
    String statusText;
    
    if (auction.isActive) {
      badgeColor = theme.colorScheme.primary;
      statusText = 'Aktif';
    } else if (auction.isUpcoming) {
      badgeColor = theme.colorScheme.tertiary;
      statusText = 'Yaklaşan';
    } else {
      badgeColor = Colors.grey;
      statusText = 'Sona Erdi';
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: badgeColor.withOpacity(0.9),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        statusText,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }
} 