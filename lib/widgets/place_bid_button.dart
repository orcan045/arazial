import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart' as provider;
import 'package:intl/intl.dart';
import 'package:land_auction_app/models/auction.dart';
import 'package:land_auction_app/providers/auction_provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

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
  final _bidController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  double _latestBidAmount = 0;
  // Track if the user has acknowledged the deposit requirement
  bool _hasAcknowledgedDepositRequirement = false;
  
  @override
  void initState() {
    super.initState();
    _fetchLatestBid();
  }
  
  Future<void> _fetchLatestBid() async {
    final supabase = Supabase.instance.client;
    final response = await supabase
        .from('bids')
        .select('amount')
        .eq('auction_id', widget.auction.id)
        .order('amount', ascending: false)
        .limit(1)
        .maybeSingle();
    
    setState(() {
      _latestBidAmount = response != null 
          ? (response['amount'] as num).toDouble()
          : widget.auction.startPrice;
      _bidController.text = ((_latestBidAmount + widget.auction.minIncrement).toInt()).toString();
    });
  }
  
  @override
  void dispose() {
    _bidController.dispose();
    super.dispose();
  }
  
  Future<void> _placeBid() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    
    setState(() {
      _isLoading = true;
    });
    
    final bidAmount = double.parse(_bidController.text);
    final auctionProvider = provider.Provider.of<AuctionProvider>(context, listen: false);
    
    final success = await auctionProvider.placeBid(
      widget.auction.id,
      bidAmount,
    );
    
    setState(() {
      _isLoading = false;
    });
    
    if (success) {
      widget.onBidPlaced?.call();
      Navigator.of(context).pop(); // Close the dialog
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Teklif verilemedi. Lütfen tekrar deneyin.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
  
  void _showDepositWarningDialog() {
    final currencyFormat = NumberFormat.currency(
      locale: 'tr_TR',
      symbol: '₺',
      decimalDigits: 0,
    );
    final theme = Theme.of(context);
    final screenWidth = MediaQuery.of(context).size.width;
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        // Constrain the dialog width
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxWidth: screenWidth * 0.85,
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title
                Row(
                  children: [
                    Icon(
                      Icons.account_balance_wallet,
                      color: theme.colorScheme.primary,
                      size: 24,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Teminat Gerekli',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Content
                Text(
                  'Bu ihaleye katılmak için teminat yatırmanız gerekiyor.',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 16),
                
                // Deposit info card
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.secondaryContainer.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: theme.colorScheme.secondaryContainer,
                      width: 1.5,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Flexible(
                            flex: 2,
                            child: Text(
                              'Teminat:',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: theme.colorScheme.onSecondaryContainer,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Flexible(
                            flex: 3,
                            child: Text(
                              '${currencyFormat.format(2000)}',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: theme.colorScheme.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Flexible(
                            flex: 2,
                            child: Text(
                              'Başlangıç:',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: theme.colorScheme.onSecondaryContainer,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Flexible(
                            flex: 3,
                            child: Text(
                              '${currencyFormat.format(widget.auction.startPrice)}',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: theme.colorScheme.onSecondaryContainer,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 12),
                
                // Info text
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.info_outline,
                      size: 16,
                      color: theme.colorScheme.primary,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Teminat bedeli, ihale sürecinde ciddiyetinizi gösterir ve kazanmamanız durumunda iade edilir.',
                        style: TextStyle(
                          fontSize: 12,
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 20),
                
                // Action buttons - use Wrap to prevent overflow
                Align(
                  alignment: Alignment.centerRight,
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    alignment: WrapAlignment.end,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      TextButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        child: const Text('Daha Sonra'),
                      ),
                      ElevatedButton.icon(
                        onPressed: () {
                          // In a real app, this would navigate to a payment screen
                          // For now, just acknowledge and proceed
                          setState(() {
                            _hasAcknowledgedDepositRequirement = true;
                          });
                          Navigator.of(context).pop();
                          _showBidDialog();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme.colorScheme.primary,
                          foregroundColor: theme.colorScheme.onPrimary,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        icon: const Icon(Icons.payment, size: 14),
                        label: const Text('Teminat Yatır'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  void _showBidDialog() {
    final currencyFormat = NumberFormat.currency(
      locale: 'tr_TR',
      symbol: '₺',
      decimalDigits: 0,
    );
    
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Teklif Ver'),
        content: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Teklif tutarını girin:',
                style: TextStyle(
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _bidController,
                decoration: InputDecoration(
                  labelText: 'Teklif Tutarı',
                  prefixText: currencyFormat.currencySymbol,
                ),
                keyboardType: TextInputType.number,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                ],
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Lütfen bir teklif tutarı girin';
                  }
                  
                  final bidAmount = double.parse(value);
                  
                  if (bidAmount <= _latestBidAmount) {
                    return 'Teklif mevcut tekliften yüksek olmalı';
                  }
                  
                  // Check if the bid meets the minimum increment requirement
                  if (bidAmount < _latestBidAmount + widget.auction.minIncrement) {
                    final currencyFormat = NumberFormat.currency(
                      locale: 'tr_TR',
                      symbol: '₺',
                      decimalDigits: 0,
                    );
                    final minRequired = _latestBidAmount + widget.auction.minIncrement;
                    return 'Minimum ${currencyFormat.format(widget.auction.minIncrement)} artış yapmalısınız. En az ${currencyFormat.format(minRequired)} girebilirsiniz.';
                  }
                  
                  return null;
                },
              ),
              const SizedBox(height: 8),
              Text(
                'Mevcut teklif: ${currencyFormat.format(_latestBidAmount)}',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                  fontStyle: FontStyle.italic,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Minimum artış: ${currencyFormat.format(widget.auction.minIncrement)}',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('İptal'),
          ),
          ElevatedButton(
            onPressed: _isLoading ? null : () async {
              await _placeBid();
            },
            child: _isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('Teklif Ver'),
          ),
        ],
      ),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        // If user hasn't acknowledged deposit requirement, show warning first
        if (!_hasAcknowledgedDepositRequirement) {
          _showDepositWarningDialog();
        } else {
          _showBidDialog();
        }
      },
      style: ElevatedButton.styleFrom(
        minimumSize: const Size(double.infinity, 50),
      ),
      child: const Text('Teklif Ver'),
    );
  }
} 