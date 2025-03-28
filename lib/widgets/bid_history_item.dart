import 'package:flutter/material.dart';
import 'package:land_auction_app/models/bid.dart';
import 'package:intl/intl.dart';

class BidHistoryItem extends StatelessWidget {
  final Bid bid;
  final bool isHighestBid;

  const BidHistoryItem({
    super.key,
    required this.bid,
    this.isHighestBid = false,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(
      locale: 'tr_TR',
      symbol: '₺',
      decimalDigits: 0,
    );

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      color: isHighestBid ? Theme.of(context).colorScheme.primaryContainer : null,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    currencyFormat.format(bid.amount),
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: isHighestBid ? FontWeight.bold : null,
                          color: isHighestBid
                              ? Theme.of(context).colorScheme.onPrimaryContainer
                              : null,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    DateFormat('dd MMM yyyy, HH:mm').format(bid.createdAt),
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: isHighestBid 
                          ? Theme.of(context).colorScheme.onPrimaryContainer.withOpacity(0.8)
                          : null,
                    ),
                  ),
                ],
              ),
            ),
            if (isHighestBid)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primary,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'En Yüksek Teklif',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: Theme.of(context).colorScheme.onPrimary,
                      ),
                ),
              ),
          ],
        ),
      ),
    );
  }
} 