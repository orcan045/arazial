import 'package:flutter/material.dart';
import 'package:provider/provider.dart' as provider;
import 'package:intl/intl.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:land_auction_app/models/auction.dart';
import 'package:land_auction_app/models/bid.dart';
import 'package:land_auction_app/providers/auction_provider.dart';
import 'package:land_auction_app/providers/auth_provider.dart';
import 'package:land_auction_app/widgets/bid_history_item.dart';
import 'package:land_auction_app/widgets/countdown_timer.dart';
import 'package:land_auction_app/widgets/place_bid_button.dart';

class AuctionDetailScreen extends StatefulWidget {
  final String auctionId;
  
  const AuctionDetailScreen({
    super.key,
    required this.auctionId,
  });

  @override
  State<AuctionDetailScreen> createState() => _AuctionDetailScreenState();
}

class _AuctionDetailScreenState extends State<AuctionDetailScreen> {
  late Stream<Auction> _auctionStream;
  late Stream<List<Bid>> _bidsStream;

  @override
  void initState() {
    super.initState();
    final auctionProvider = provider.Provider.of<AuctionProvider>(context, listen: false);
    _auctionStream = auctionProvider.subscribeToAuction(widget.auctionId);
    _bidsStream = auctionProvider.subscribeToAuctionBids(widget.auctionId);
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currencyFormat = NumberFormat.currency(
      locale: 'tr_TR',
      symbol: '₺',
      decimalDigits: 0,
    );

      return Scaffold(
        appBar: AppBar(
          title: const Text('İhale Detayları'),
        ),
      body: StreamBuilder<Auction>(
        stream: _auctionStream,
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Center(
              child: Text('Bir hata oluştu: ${snapshot.error}'),
            );
          }

          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final auction = snapshot.data!;

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Image Carousel
                SizedBox(
                  height: 250,
                  width: double.infinity,
                  child: _buildImageCarousel(auction),
                ),

                // Title and Status
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              _getAuctionTitle(auction),
                              style: theme.textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          _buildStatusChip(context, auction),
                        ],
                      ),
                      
                      auction.isActive ? _buildCountdownTimer(auction) : const SizedBox.shrink(),
                      
                      const SizedBox(height: 16),

                      // Location
                      Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            color: theme.colorScheme.primary,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              _getAuctionLocation(auction),
                              style: theme.textTheme.bodyLarge,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      // Area
                      Row(
                        children: [
                          Icon(
                            Icons.straighten,
                            color: theme.colorScheme.primary,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '${auction.areaSize ?? 0} ${auction.areaUnit ?? 'm²'}',
                            style: theme.textTheme.bodyLarge,
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Description
                      Text(
                        'Açıklama',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _getAuctionDescription(auction),
                        style: theme.textTheme.bodyMedium,
                      ),
                      const SizedBox(height: 16),

                      // Auction Details
                      Text(
                        'İhale Detayları',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      
                      _buildDetailRow(
                        'Mevcut Teklif',
                        currencyFormat.format(auction.currentPrice),
                        theme,
                        emphasize: true,
                      ),
                      _buildDetailRow(
                        'Minimum Teklif',
                        currencyFormat.format(auction.minimumNextBid),
                        theme,
                        emphasize: true,
                      ),
                      _buildDetailRow(
                        'Başlangıç Fiyatı',
                        currencyFormat.format(auction.startPrice),
                        theme,
                      ),
                      _buildDetailRow(
                        'Minimum Artış',
                        currencyFormat.format(auction.minIncrement),
                        theme,
                      ),
                      _buildDetailRow(
                        'Başlangıç',
                        DateFormat('dd MMM yyyy, HH:mm').format(auction.startTime),
                        theme,
                      ),
                      _buildDetailRow(
                        'Bitiş',
                        DateFormat('dd MMM yyyy, HH:mm').format(auction.endTime),
                        theme,
                      ),
                      const SizedBox(height: 16),

                      // Bid History
                      Text(
                        'Teklif Geçmişi',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      StreamBuilder<List<Bid>>(
                        stream: _bidsStream,
                        builder: (context, snapshot) {
                          debugPrint('Bid StreamBuilder update: ${snapshot.connectionState}');
                          if (snapshot.hasError) {
                            debugPrint('Bid stream error: ${snapshot.error}');
                            return Text('Teklifler yüklenirken hata oluştu: ${snapshot.error}');
                          }

                          if (!snapshot.hasData) {
                            debugPrint('No bid data yet');
                            return const Center(child: CircularProgressIndicator());
                          }

                          final bids = snapshot.data!;
                          debugPrint('Received ${bids.length} bids');
                          
                          if (bids.isEmpty) {
                            return const Text('Henüz teklif verilmemiş.');
                          }

                          return ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: bids.length,
                            itemBuilder: (ctx, i) => BidHistoryItem(
                              bid: bids[i],
                              isHighestBid: i == 0,
                            ),
                          );
                        },
                      ),
            ],
          ),
        ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: StreamBuilder<Auction>(
        stream: _auctionStream,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const SizedBox.shrink();
          final auction = snapshot.data!;

          if (!auction.isActive) return const SizedBox.shrink();

          return SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: PlaceBidButton(
                auction: auction,
                onBidPlaced: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Teklifiniz başarıyla kaydedildi.'),
                      backgroundColor: Colors.green,
                    ),
                  );
                },
              ),
            ),
          );
        },
      ),
    );
  }
  
  Widget _buildStatusChip(BuildContext context, Auction auction) {
    final theme = Theme.of(context);
    
    Color chipColor;
    String statusText;
    
    if (auction.isActive) {
      chipColor = theme.colorScheme.primary;
      statusText = 'Aktif';
    } else if (auction.isUpcoming) {
      chipColor = theme.colorScheme.tertiary;
      statusText = 'Yaklaşan';
    } else {
      chipColor = Colors.grey;
      statusText = 'Sona Erdi';
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: chipColor.withOpacity(0.1),
        border: Border.all(color: chipColor),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        statusText,
        style: TextStyle(
          color: chipColor,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
  
  Widget _buildDetailRow(String label, String value, ThemeData theme, {bool emphasize = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
              label,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: emphasize ? theme.colorScheme.primary : Colors.grey[600],
              fontWeight: emphasize ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          Text(
              value,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: emphasize ? theme.colorScheme.primary : null,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildImageCarousel(Auction auction) {
    if (auction.images.isNotEmpty) {
      return PageView.builder(
        itemCount: auction.images.length,
        itemBuilder: (context, index) {
          return CachedNetworkImage(
            imageUrl: auction.images[index],
            fit: BoxFit.cover,
            placeholder: (context, url) => const Center(
              child: CircularProgressIndicator(),
            ),
            errorWidget: (context, url, error) =>
                const Icon(Icons.error),
          );
        },
      );
    } else {
      return Container(
        color: Colors.grey[200],
        child: const Icon(
          Icons.landscape,
          size: 64,
          color: Colors.grey,
        ),
      );
    }
  }

  String _getAuctionTitle(Auction auction) {
    return auction.title ?? 'Arazi İhalesi';
  }

  String _getAuctionLocation(Auction auction) {
    return auction.location ?? 'Konum belirtilmemiş';
  }

  String _getAuctionDescription(Auction auction) {
    return auction.description ?? 'Açıklama bulunmuyor.';
  }

  Widget _buildCountdownTimer(Auction auction) {
    if (!auction.isActive) return const SizedBox();
    
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 16),
      child: CountdownTimer(
        seconds: auction.remainingTimeInSeconds,
        auctionId: auction.id,
        compact: false,
        style: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: Theme.of(context).colorScheme.primary,
        ),
        onFinish: () {
          provider.Provider.of<AuctionProvider>(context, listen: false)
            .fetchAuctions(forceRefresh: true);
        },
      ),
    );
  }
} 