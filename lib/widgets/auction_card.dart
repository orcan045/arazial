import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:land_auction_app/models/auction.dart';
import 'package:intl/intl.dart';
import 'package:land_auction_app/widgets/countdown_timer.dart';
import 'package:land_auction_app/theme/app_theme.dart';
import 'dart:ui';

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
      elevation: 2,
      shadowColor: Colors.black.withOpacity(0.1),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        splashColor: AppTheme.primaryColor.withOpacity(0.05),
        highlightColor: AppTheme.primaryColor.withOpacity(0.025),
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
                          placeholder: (context, url) => Center(
                            child: SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(
                                color: AppTheme.primaryColor,
                                strokeWidth: 2,
                              ),
                            ),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: AppTheme.surfaceSecondaryColor,
                            child: Icon(
                              Icons.image_not_supported_outlined,
                              size: 42,
                              color: theme.colorScheme.onSurfaceVariant.withOpacity(0.4),
                            ),
                          ),
                        )
                      : Container(
                          color: AppTheme.surfaceSecondaryColor,
                          child: Icon(
                            Icons.terrain_outlined,
                            size: 42,
                            color: theme.colorScheme.onSurfaceVariant.withOpacity(0.4),
                          ),
                        ),
                ),
                // Gradient overlay for darker images
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withOpacity(0.3),
                        ],
                        stops: const [0.7, 1.0],
                      ),
                    ),
                  ),
                ),
                // Status badge 
                Positioned(
                  top: 12,
                  left: 12,
                  child: _buildStatusBadge(context),
                ),
                // Countdown for active auctions
                if (auction.isActive)
                  Positioned(
                    bottom: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.6),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: CountdownTimer(
                        seconds: auction.remainingTimeInSeconds,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                          fontSize: 13,
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
                  // Title with clean typography
                  Text(
                    auction.landListing?.title ?? 'Arazi İhalesi',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textColor,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  
                  // Location and area with subtle icons
                  Row(
                    children: [
                      Icon(
                        Icons.location_on_outlined,
                        size: 14,
                        color: AppTheme.primaryColor.withOpacity(0.8),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          auction.landListing?.location ?? 'Konum belirtilmemiş',
                          style: TextStyle(
                            color: AppTheme.textSecondaryColor,
                            fontSize: 13,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Icon(
                        Icons.straighten_outlined,
                        size: 14,
                        color: AppTheme.primaryColor.withOpacity(0.8),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${auction.landListing?.areaSize ?? 0} ${auction.landListing?.areaUnit ?? 'm²'}',
                        style: TextStyle(
                          color: AppTheme.textSecondaryColor,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  // Price and button with clean layout
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        currencyFormat.format(auction.currentPrice),
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.primaryColor,
                        ),
                      ),
                      OutlinedButton(
                        onPressed: onTap,
                        style: OutlinedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          side: BorderSide(color: AppTheme.primaryColor),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        ),
                        child: Text(
                          'Detaylar',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
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
    
    Color backgroundColor;
    Color textColor = Colors.white;
    String text;
    
    if (auction.isActive) {
      backgroundColor = AppTheme.primaryColor;
      text = 'Aktif';
    } else if (auction.isUpcoming) {
      backgroundColor = AppTheme.successColor;
      text = 'Yaklaşan';
    } else {
      backgroundColor = AppTheme.textSecondaryColor;
      text = 'Tamamlandı';
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: textColor,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
  
  String _formatDate(DateTime? date) {
    if (date == null) return 'Belirtilmemiş';
    
    return DateFormat('dd.MM.yyyy HH:mm').format(date);
  }
}