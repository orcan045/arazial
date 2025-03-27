import 'package:flutter/material.dart';
import 'package:provider/provider.dart' as provider;
import 'package:land_auction_app/models/auction.dart';
import 'package:land_auction_app/providers/auction_provider.dart';
import 'package:land_auction_app/screens/auction_detail_screen.dart';
import 'package:land_auction_app/widgets/auction_card.dart';
import 'package:land_auction_app/widgets/app_drawer.dart';

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
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text(
          'Arazi İhaleleri',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Arama özelliği yakında eklenecek'),
                ),
              );
            },
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.normal),
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: Colors.grey,
          indicatorColor: theme.colorScheme.primary,
          indicatorWeight: 3,
          tabs: const [
            Tab(text: 'Aktif'),
            Tab(text: 'Yaklaşan'),
            Tab(text: 'Geçmiş'),
          ],
        ),
      ),
      drawer: const AppDrawer(),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              theme.colorScheme.primary.withOpacity(0.05),
              theme.colorScheme.surface,
            ],
          ),
        ),
        child: RefreshIndicator(
          onRefresh: _onRefresh,
          color: theme.colorScheme.primary,
          child: provider.Consumer<AuctionProvider>(
            builder: (context, auctionProvider, child) {
              if (auctionProvider.isLoading) {
                return const Center(
                  child: CircularProgressIndicator(),
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
      ),
    );
  }
  
  Widget _buildAuctionsList(List<Auction> auctions) {
    if (auctions.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.gavel,
                size: 64,
                color: Theme.of(context).colorScheme.primary.withOpacity(0.5),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'İhale bulunamadı',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      );
    }
    
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: auctions.length,
      itemBuilder: (ctx, i) => AuctionCard(
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
  }
} 