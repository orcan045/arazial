import 'package:flutter/material.dart';
import 'package:provider/provider.dart' as provider;
import 'package:land_auction_app/models/auction.dart';
import 'package:land_auction_app/providers/auction_provider.dart';
import 'package:land_auction_app/screens/auction_detail_screen.dart';
import 'package:land_auction_app/widgets/auction_card.dart';
import 'package:land_auction_app/widgets/app_drawer.dart';
import 'package:land_auction_app/theme/app_theme.dart';
import 'dart:ui';

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
  }
  
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_isInit) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _loadAuctions();
      });
      _isInit = false;
    }
  }
  
  Future<void> _loadAuctions() async {
    if (!mounted) return;
    await provider.Provider.of<AuctionProvider>(context, listen: false).fetchAuctions();
  }
  
  Future<void> _onRefresh() async {
    await provider.Provider.of<AuctionProvider>(context, listen: false).fetchAuctions();
  }
  
  @override
  void dispose() {
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
            if (auctionProvider.isLoading) {
              return Center(
                child: SizedBox(
                  width: 32,
                  height: 32,
                  child: CircularProgressIndicator(
                    color: AppTheme.primaryColor,
                    strokeWidth: 2,
                  ),
                ),
              );
            }
            
            return TabBarView(
              controller: _tabController,
              children: [
                _buildAuctionsList(auctionProvider.activeAuctions),
                _buildAuctionsList(auctionProvider.upcomingAuctions),
                _buildAuctionsList(auctionProvider.pastAuctions),
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