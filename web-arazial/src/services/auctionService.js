import { supabase } from './supabase';

/**
 * Fetch all auctions
 * @returns {Promise<{data: Array, error: Error}>}
 */
export const fetchAuctions = async () => {
  try {
    const { data, error } = await supabase
      .from('auctions')
      .select(`
        *,
        land_listings (*)
      `)
      .order('created_at');
    
    if (error) throw error;
    
    // For any auctions missing land_listings, fetch them separately
    const auctionsWithLandListings = await Promise.all(
      data.map(async (auction) => {
        if (!auction.land_listings && auction.land_id) {
          const { data: landData, error: landError } = await supabase
            .from('land_listings')
            .select('*')
            .eq('id', auction.land_id)
            .single();
          
          if (!landError && landData) {
            auction.land_listings = landData;
          }
        }
        return auction;
      })
    );
    
    console.log('Fetched auctions data:', auctionsWithLandListings);
    return { data: auctionsWithLandListings, error: null };
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return { data: null, error };
  }
};

/**
 * Get active, upcoming, and past auctions
 * @returns {Promise<{active: Array, upcoming: Array, past: Array, error: Error}>}
 */
export const getFilteredAuctions = async () => {
  try {
    const { data, error } = await fetchAuctions();
    
    if (error) throw error;
    
    const now = new Date();
    
    // Support both snake_case and camelCase field names
    const active = data.filter(auction => {
      const startTime = new Date(auction.start_time || auction.startTime);
      const endTime = new Date(auction.end_time || auction.endTime);
      const status = auction.status;
      return status === 'active' && now >= startTime && now <= endTime;
    });
    
    const upcoming = data.filter(auction => {
      const startTime = new Date(auction.start_time || auction.startTime);
      const status = auction.status;
      return status === 'upcoming' && now < startTime;
    });
    
    const past = data.filter(auction => {
      const endTime = new Date(auction.end_time || auction.endTime);
      const status = auction.status;
      return now > endTime || status === 'ended';
    });
    
    return { active, upcoming, past, error: null };
  } catch (error) {
    console.error('Error getting filtered auctions:', error);
    return { active: [], upcoming: [], past: [], error };
  }
};

/**
 * Get auction by ID
 * @param {string} auctionId
 * @returns {Promise<{data: Object, error: Error}>}
 */
export const getAuctionById = async (auctionId) => {
  try {
    // First try to get auction with land_listings included
    const { data, error } = await supabase
      .from('auctions')
      .select(`
        *,
        land_listings (*)
      `)
      .eq('id', auctionId)
      .single();
    
    if (error) throw error;
    
    // If land_listings is null, fetch it separately
    if (!data.land_listings && data.land_id) {
      const { data: landData, error: landError } = await supabase
        .from('land_listings')
        .select('*')
        .eq('id', data.land_id)
        .single();
      
      if (!landError && landData) {
        data.land_listings = landData;
      }
    }
    
    // Log the entire data object to see exact field names and values
    console.log('Raw auction data from Supabase:', JSON.stringify(data, null, 2));
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching auction with ID ${auctionId}:`, error);
    return { data: null, error };
  }
};

/**
 * Get bids for an auction
 * @param {string} auctionId
 * @returns {Promise<{data: Array, error: Error}>}
 */
export const getAuctionBids = async (auctionId) => {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select(`
        *,
        profiles (
          id,
          full_name
        )
      `)
      .eq('auction_id', auctionId)
      .order('amount', { ascending: false });
    
    if (error) throw error;
    
    console.log('Fetched bids:', data);
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching bids for auction ${auctionId}:`, error);
    return { data: null, error };
  }
};

/**
 * Place a bid on an auction
 * @param {string} auctionId
 * @param {number} amount
 * @returns {Promise<{success: boolean, error: Error}>}
 */
export const placeBid = async (auctionId, amount) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the auction details to check bid validity
    const { data: auction, error: auctionError } = await getAuctionById(auctionId);
    if (auctionError) throw auctionError;
    
    // Get the latest bid for this auction
    const { data: latestBids, error: bidsError } = await supabase
      .from('bids')
      .select('amount')
      .eq('auction_id', auctionId)
      .order('amount', { ascending: false })
      .limit(1);
    
    if (bidsError) throw bidsError;
    
    const startPrice = auction.start_price || auction.startPrice || 0;
    const latestBidAmount = latestBids && latestBids.length > 0 
      ? latestBids[0].amount 
      : startPrice;
    
    // Calculate minimum next bid
    const minIncrement = auction.min_increment || auction.minIncrement || 0;
    const minimumNextBid = latestBidAmount + minIncrement;
    
    // Check if bid is valid
    if (amount <= latestBidAmount) {
      throw new Error(`Bid amount must be greater than the current highest bid (${latestBidAmount})`);
    }
    
    if (amount < minimumNextBid) {
      throw new Error(`Bid amount must be at least ${minimumNextBid}`);
    }
    
    // Place the bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .insert([
        {
          auction_id: auctionId,
          bidder_id: user.id,
          amount: amount
        }
      ])
      .select()
      .single();
    
    if (bidError) throw bidError;
    
    // Update the auction's final price
    const { error: updateError } = await supabase
      .from('auctions')
      .update({ final_price: amount })
      .eq('id', auctionId);
    
    if (updateError) throw updateError;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error placing bid:', error);
    return { success: false, error };
  }
}; 