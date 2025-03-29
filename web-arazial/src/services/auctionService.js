import { supabase } from './supabase';

/**
 * Fetch all auctions with improved error handling and caching
 * @param {boolean} forceRefresh - Whether to force a refresh from the database
 * @returns {Promise<{data: Array, error: Error}>}
 */
export const fetchAuctions = async (forceRefresh = false) => {
  try {
    // Use a local cache with a timestamp to prevent excessive refetching
    const now = new Date().getTime();
    const cacheKey = 'auctions_cache';
    const cacheDuration = 5 * 60 * 1000; // 5 minutes
    
    // Check if we have cached data and it's fresh enough
    if (!forceRefresh) {
      try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (data && timestamp && (now - timestamp < cacheDuration)) {
            console.log('Using cached auction data');
            return { data, error: null };
          }
        }
      } catch (cacheError) {
        console.warn('Error accessing cache:', cacheError);
        // Continue to fetch fresh data
      }
    }
    
    // Fetch fresh data with a timeout to prevent hanging requests
    const fetchPromise = new Promise(async (resolve, reject) => {
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
              try {
                const { data: landData, error: landError } = await supabase
                  .from('land_listings')
                  .select('*')
                  .eq('id', auction.land_id)
                  .single();
                
                if (!landError && landData) {
                  auction.land_listings = landData;
                }
              } catch (err) {
                console.error(`Error fetching land data for auction ${auction.id}:`, err);
              }
            }
            return auction;
          })
        );
        
        // Cache the results
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: auctionsWithLandListings,
            timestamp: now
          }));
        } catch (storageError) {
          console.warn('Error storing in cache:', storageError);
        }
        
        console.log('Fetched fresh auctions data:', auctionsWithLandListings);
        resolve({ data: auctionsWithLandListings, error: null });
      } catch (error) {
        reject(error);
      }
    });
    
    // Add a timeout to the fetch operation to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000); // 10 second timeout
    });
    
    // Race between the fetch and the timeout
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    
    // Try to return cached data even if it's stale, rather than nothing
    try {
      const cachedData = localStorage.getItem('auctions_cache');
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        if (data) {
          console.log('Returning stale cached data due to fetch error');
          return { data, error: null };
        }
      }
    } catch (cacheError) {
      console.warn('Error accessing cache during error recovery:', cacheError);
    }
    
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
    
    console.log('All auctions from service:', data);
    
    const now = new Date();
    
    // 1. First, filter active auctions - status is 'active' OR current time is within window
    const active = data.filter(auction => {
      const startTime = new Date(auction.start_time || auction.startTime);
      const endTime = new Date(auction.end_time || auction.endTime);
      const status = auction.status;
      
      // Either explicitly marked as active
      if (status === 'active') return true;
      
      // OR current time is within auction window AND not marked as upcoming/ended
      return status !== 'upcoming' && status !== 'ended' && 
             now >= startTime && now <= endTime;
    });
    
    // 2. Then upcoming auctions - those NOT in active that are either:
    // - have status 'upcoming' OR 
    // - start time is in the future
    const activeIds = new Set(active.map(a => a.id));
    const upcoming = data.filter(auction => {
      // Skip if already in active tab
      if (activeIds.has(auction.id)) return false;
      
      const startTime = new Date(auction.start_time || auction.startTime);
      const status = auction.status;
      
      // Either explicitly marked as upcoming
      if (status === 'upcoming') return true;
      
      // OR start time is in the future AND not marked as ended
      return status !== 'ended' && now < startTime;
    });
    
    // 3. Finally, past auctions - anything not in active or upcoming that:
    // - has status 'ended' OR
    // - current time is after end time
    const upcomingIds = new Set(upcoming.map(a => a.id));
    const past = data.filter(auction => {
      // Skip if already in active or upcoming tabs
      if (activeIds.has(auction.id) || upcomingIds.has(auction.id)) return false;
      
      const endTime = new Date(auction.end_time || auction.endTime);
      const status = auction.status;
      
      // Either explicitly marked as ended
      if (status === 'ended') return true;
      
      // OR current time is after end time
      return now > endTime;
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