import { supabase } from './supabase';

/**
 * Check if a user has a completed deposit for a specific auction
 * @param {string} auctionId - The auction ID
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} - True if user has completed deposit, false otherwise
 */
export const hasUserCompletedDeposit = async (auctionId, userId) => {
  if (!auctionId || !userId) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('deposits')
      .select('id, status')
      .eq('auction_id', auctionId)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking deposit status:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Error in hasUserCompletedDeposit:', err);
    return false;
  }
};

/**
 * Get user's deposit record for a specific auction
 * @param {string} auctionId - The auction ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object|null>} - Deposit record or null if not found
 */
export const getUserDeposit = async (auctionId, userId) => {
  if (!auctionId || !userId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error getting user deposit:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getUserDeposit:', err);
    return null;
  }
};

/**
 * Check if a user has any deposit (pending or completed) for a specific auction
 * @param {string} auctionId - The auction ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object|null>} - Deposit record or null if not found
 */
export const getUserDepositAnyStatus = async (auctionId, userId) => {
  if (!auctionId || !userId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('auction_id', auctionId)
      .eq('user_id', userId)
      .in('status', ['pending', 'completed'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error getting user deposit any status:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getUserDepositAnyStatus:', err);
    return null;
  }
};

/**
 * Update deposit status using the Edge Function
 * @param {string} paymentId - The payment ID
 * @param {string} status - The new status ('pending', 'completed', 'failed', 'refunded')
 * @returns {Promise<Object>} - Response from Edge Function
 */
export const updateDepositStatus = async (paymentId, status) => {
  if (!paymentId || !status) {
    throw new Error('Payment ID and status are required');
  }

  try {
    const { data, error } = await supabase.functions.invoke('update-deposit-status', {
      body: {
        payment_id: paymentId,
        status: status
      }
    });

    if (error) {
      throw new Error(`Failed to update deposit status: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Error in updateDepositStatus:', err);
    throw err;
  }
};

/**
 * Create a new deposit record or reuse an existing pending one
 * @param {Object} depositData - The deposit data
 * @param {string} depositData.auction_id - The auction ID
 * @param {string} depositData.user_id - The user ID
 * @param {number} depositData.amount - The deposit amount
 * @param {string} depositData.payment_id - The payment ID
 * @returns {Promise<Object>} - Created or updated deposit record
 */
export const createDeposit = async (depositData) => {
  try {
    // First check if there's already a pending or completed deposit
    const existingDeposit = await getUserDepositAnyStatus(depositData.auction_id, depositData.user_id);
    
    if (existingDeposit) {
      if (existingDeposit.status === 'completed') {
        throw new Error('Bu ilan için depozito ödemesi zaten tamamlanmış.');
      } else if (existingDeposit.status === 'pending') {
        // Update the existing pending deposit with new payment_id
        const { data, error } = await supabase
          .from('deposits')
          .update({
            payment_id: depositData.payment_id,
            amount: depositData.amount,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDeposit.id)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to update existing deposit: ${error.message}`);
        }

        return data;
      }
    }

    // No existing deposit, create a new one
    const { data, error } = await supabase
      .from('deposits')
      .insert({
        ...depositData,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // This shouldn't happen now with our check above, but just in case
        throw new Error('Bu ilan için zaten bir depozito kaydınız bulunmaktadır.');
      }
      throw new Error(`Failed to create deposit: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Error in createDeposit:', err);
    throw err;
  }
};

/**
 * Get the current deposit status for UI display
 * @param {string} auctionId - The auction ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - Object with hasCompleted, hasPending, and deposit data
 */
export const getDepositStatus = async (auctionId, userId) => {
  if (!auctionId || !userId) {
    return { hasCompleted: false, hasPending: false, deposit: null };
  }

  try {
    const deposit = await getUserDepositAnyStatus(auctionId, userId);
    
    return {
      hasCompleted: deposit?.status === 'completed',
      hasPending: deposit?.status === 'pending',
      deposit: deposit
    };
  } catch (err) {
    console.error('Error in getDepositStatus:', err);
    return { hasCompleted: false, hasPending: false, deposit: null };
  }
}; 