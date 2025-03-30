import 'package:flutter/material.dart';
import 'package:provider/provider.dart' as provider;
import 'package:land_auction_app/models/auction.dart';
import 'package:land_auction_app/providers/auction_provider.dart';
import 'package:land_auction_app/screens/auction_detail_screen.dart';
import 'package:land_auction_app/widgets/auction_card.dart';
import 'package:land_auction_app/widgets/app_drawer.dart';
import 'package:land_auction_app/theme/app_theme.dart';
import 'dart:ui';
import 'package:intl/intl.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  bool _isInit = true;
  late TabController _tabController;
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _tabController.addListener(_handleTabChange);
  }
  
  void _handleTabChange() {
    if (_tabController.indexIsChanging) {
      return;
    }
    
    if (_tabController.index == 0) {
      // For active auctions, we want fresh data more often
      _loadAuctions(forceRefresh: true);
    } else {
      // For upcoming and past, we can use cached data if available
      _loadAuctions(forceRefresh: false);
    }
  }
  
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_isInit) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _loadAuctions(forceRefresh: true);
      });
      _isInit = false;
    }
  }
  
  Future<void> _loadAuctions({bool forceRefresh = false}) async {
    if (!mounted) return;
    await provider.Provider.of<AuctionProvider>(context, listen: false).fetchAuctions(forceRefresh: forceRefresh);
  }
  
  Future<void> _onRefresh() async {
    await provider.Provider.of<AuctionProvider>(context, listen: false).fetchAuctions(forceRefresh: true);
  }
  
  @override
  void dispose() {
    _tabController.removeListener(_handleTabChange);
    _tabController.dispose();
    super.dispose();
  }

  Widget _buildLogo() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          Icons.public,
          color: AppTheme.primaryColor,
          size: 24,
        ),
        const SizedBox(width: 8),
        Text(
          'arazial',
          style: TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 22,
            color: AppTheme.primaryColor,
            letterSpacing: 0.5,
          ),
        ),
      ],
    );
  }
  
  String _formatLastUpdated(DateTime? lastUpdated) {
    if (lastUpdated == null) {
      return '';
    }
    
    final now = DateTime.now();
    final difference = now.difference(lastUpdated);
    
    if (difference.inSeconds < 60) {
      return 'Şimdi güncellendi';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} dakika önce güncellendi';
    } else {
      return DateFormat('HH:mm').format(lastUpdated) + ' güncellendi';
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: theme.colorScheme.background,
      appBar: AppBar(
        centerTitle: true,
        elevation: 2,
        backgroundColor: theme.colorScheme.surface,
        title: _buildLogo(),
        actions: [
          IconButton(
            icon: Icon(
              Icons.search_outlined,
              color: theme.colorScheme.onSurface,
              size: 22,
            ),
            splashRadius: 20,
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('Arama özelliği yakında eklenecek'),
                  behavior: SnackBarBehavior.floating,
                  backgroundColor: AppTheme.primaryColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              );
            },
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: theme.colorScheme.onBackground.withOpacity(0.1),
                  width: 1,
                ),
              ),
            ),
            child: TabBar(
              controller: _tabController,
              labelStyle: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
              unselectedLabelStyle: TextStyle(
                fontWeight: FontWeight.w400,
                fontSize: 14,
              ),
              labelColor: AppTheme.primaryColor,
              unselectedLabelColor: theme.colorScheme.onBackground.withOpacity(0.6),
              indicatorColor: AppTheme.primaryColor,
              indicatorWeight: 2,
              indicatorSize: TabBarIndicatorSize.label,
              tabs: const [
                Tab(text: 'Aktif'),
                Tab(text: 'Yaklaşan'),
                Tab(text: 'Geçmiş'),
              ],
            ),
          ),
        ),
      ),
      drawer: const AppDrawer(),
      body: RefreshIndicator(
        onRefresh: _onRefresh,
        color: AppTheme.primaryColor,
        backgroundColor: theme.colorScheme.surface,
        displacement: 40,
        child: provider.Consumer<AuctionProvider>(
          builder: (context, auctionProvider, child) {
            if (auctionProvider.isLoading && auctionProvider.auctions.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(
                      width: 32,
                      height: 32,
                      child: CircularProgressIndicator(
                        color: AppTheme.primaryColor,
                        strokeWidth: 2,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'İhaleler yükleniyor...',
                      style: TextStyle(
                        color: theme.colorScheme.onBackground.withOpacity(0.7),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              );
            }
            
            if (auctionProvider.hasError && auctionProvider.auctions.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 48,
                      color: theme.colorScheme.error,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'İhaleler yüklenirken bir hata oluştu',
                      style: TextStyle(
                        color: theme.colorScheme.error,
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () => _loadAuctions(forceRefresh: true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Tekrar Dene'),
                    ),
                  ],
                ),
              );
            }
            
            return Stack(
              children: [
                Column(
                  children: [
                    // Last updated indicator
                    if (auctionProvider.lastFetchTime != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0, bottom: 4.0),
                        child: Center(
                          child: Text(
                            _formatLastUpdated(auctionProvider.lastFetchTime),
                            style: TextStyle(
                              fontSize: 12,
                              color: theme.colorScheme.onBackground.withOpacity(0.5),
                            ),
                          ),
                        ),
                      ),
                    Expanded(
                      child: TabBarView(
                        controller: _tabController,
                        children: [
                          _buildAuctionsList(auctionProvider.activeAuctions),
                          _buildAuctionsList(auctionProvider.upcomingAuctions),
                          _buildAuctionsList(auctionProvider.pastAuctions),
                        ],
                      ),
                    ),
                  ],
                ),
                if (auctionProvider.isLoading)
                  Positioned(
                    top: 8,
                    right: 0,
                    left: 0,
                    child: Center(
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.surface,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                color: AppTheme.primaryColor,
                                strokeWidth: 2,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Yenileniyor...',
                              style: TextStyle(
                                fontSize: 12,
                                color: theme.colorScheme.onSurface,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }
  
  Widget _buildAuctionsList(List<Auction> auctions) {
    final theme = Theme.of(context);
    
    if (auctions.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.terrain_outlined,
              size: 48,
              color: theme.colorScheme.onBackground.withOpacity(0.3),
            ),
            const SizedBox(height: 16),
            Text(
              'İhale bulunamadı',
              style: TextStyle(
                color: theme.colorScheme.onBackground.withOpacity(0.7),
                fontSize: 16,
                fontWeight: FontWeight.w400,
              ),
            ),
            const SizedBox(height: 24),
            // Debug button (only for development)
            OutlinedButton.icon(
              onPressed: () => _loadAuctions(forceRefresh: true),
              icon: const Icon(Icons.refresh),
              label: const Text('Debug: Yenile'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.primaryColor,
              ),
            ),
          ],
        ),
      );
    }
    
    return ListView.builder(
      padding: const EdgeInsets.only(top: 16, left: 16, right: 16, bottom: 16),
      itemCount: auctions.length,
      itemBuilder: (ctx, i) {
        return Hero(
          tag: 'auction-${auctions[i].id}',
          child: AuctionCard(
            auction: auctions[i],
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (ctx) => AuctionDetailScreen(
                    auctionId: auctions[i].id,
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}