import 'package:flutter/material.dart';
import 'package:land_auction_app/models/auction.dart';
import 'package:provider/provider.dart' as provider;
import 'package:land_auction_app/providers/auction_provider.dart';
import 'package:land_auction_app/services/auth_service.dart';
import 'package:intl/intl.dart';
import 'package:flutter/services.dart';

class PlaceBidButton extends StatefulWidget {
  final Auction auction;
  final VoidCallback? onBidPlaced;

  const PlaceBidButton({
    super.key,
    required this.auction,
    this.onBidPlaced,
  });

  @override
  State<PlaceBidButton> createState() => _PlaceBidButtonState();
}

class _PlaceBidButtonState extends State<PlaceBidButton> {
  final TextEditingController _bidController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    // Pre-fill with minimum bid amount
    _bidController.text = widget.auction.minimumNextBid.toString();
  }

  @override
  void didUpdateWidget(PlaceBidButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.auction.minimumNextBid != widget.auction.minimumNextBid) {
      _bidController.text = widget.auction.minimumNextBid.toString();
    }
  }

  @override
  void dispose() {
    _bidController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currencyFormat = NumberFormat.currency(
      locale: 'tr_TR',
      symbol: '₺',
      decimalDigits: 0,
    );

    // Check authentication status
    final authService = provider.Provider.of<AuthService>(context, listen: false);
    final isLoggedIn = authService.currentUser != null;

    if (!isLoggedIn) {
      // Show login prompt if not logged in
      return ElevatedButton(
        onPressed: () {
          Navigator.of(context).pushNamed('/login');
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: theme.colorScheme.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
        child: const Text(
          'TEKLİF VERMEK İÇİN GİRİŞ YAPIN',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      );
    }

    return ElevatedButton(
      onPressed: _isSubmitting ? null : _showBidDialog,
      style: ElevatedButton.styleFrom(
        backgroundColor: theme.colorScheme.primary,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      child: _isSubmitting
          ? const SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(
                color: Colors.white,
                strokeWidth: 2,
              ),
            )
          : Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.gavel),
                const SizedBox(width: 8),
                Text(
                  'TEKLİF VER (${currencyFormat.format(widget.auction.minimumNextBid)})',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
    );
  }

  void _showBidDialog() {
    final theme = Theme.of(context);
    final currencyFormat = NumberFormat.currency(
      locale: 'tr_TR',
      symbol: '₺',
      decimalDigits: 0,
    );

    // Reset the bid amount to minimum
    _bidController.text = widget.auction.minimumNextBid.toString();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Teklif Ver'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Minimum teklif tutarı: ${currencyFormat.format(widget.auction.minimumNextBid)}',
              style: TextStyle(
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _bidController,
              decoration: InputDecoration(
                labelText: 'Teklif Tutarı',
                prefixText: '₺ ',
                border: const OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              autofocus: true,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('İPTAL'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _submitBid();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: theme.colorScheme.primary,
              foregroundColor: Colors.white,
            ),
            child: const Text('TEKLİF VER'),
          ),
        ],
      ),
    );
  }

  Future<void> _submitBid() async {
    // Validate bid amount
    final bidAmount = double.tryParse(_bidController.text.replaceAll(',', '.'));
    if (bidAmount == null || bidAmount < widget.auction.minimumNextBid) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Teklifiniz minimum tutardan az olamaz: ${NumberFormat.currency(
              locale: 'tr_TR',
              symbol: '₺',
              decimalDigits: 0,
            ).format(widget.auction.minimumNextBid)}',
          ),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      final auctionProvider = provider.Provider.of<AuctionProvider>(context, listen: false);
      final success = await auctionProvider.placeBid(widget.auction.id, bidAmount);

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Teklifiniz başarıyla kaydedildi'),
            backgroundColor: Colors.green,
          ),
        );

        if (widget.onBidPlaced != null) {
          widget.onBidPlaced!();
        }
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Teklif verilemedi. Lütfen tekrar deneyin.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Bir hata oluştu: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }
} 