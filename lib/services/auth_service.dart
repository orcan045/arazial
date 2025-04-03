import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/foundation.dart';
import 'dart:async';
import 'package:land_auction_app/models/app_lifecycle_event.dart';
import 'package:land_auction_app/services/lifecycle_service.dart';

class AuthService {
  final SupabaseClient _supabase;
  StreamSubscription<AppLifecycleEvent>? _lifecycleSubscription;
  DateTime? _lastSessionCheck;
  LifecycleService? _lifecycleService;
  
  AuthService(this._supabase);
  
  User? get currentUser => _supabase.auth.currentUser;
  
  bool get isAuthenticated => currentUser != null;
  
  Stream<AuthState> get authStateChanges => _supabase.auth.onAuthStateChange;
  
  // Set the lifecycle service - should be called after creation
  void setLifecycleService(LifecycleService service) {
    _lifecycleService = service;
    _setupLifecycleListener();
  }
  
  // Setup lifecycle listener for auth session refreshing
  void _setupLifecycleListener() {
    if (_lifecycleService == null) return;
    
    _lifecycleSubscription = _lifecycleService!.lifecycleEvents.listen((event) async {
      if (event.type == AppLifecycleEventType.resumed) {
        final now = DateTime.now();
        final lastCheck = _lastSessionCheck ?? DateTime(1970);
        
        // Only refresh session if it's been more than 2 minutes since last check
        if (now.difference(lastCheck).inMinutes > 2) {
          debugPrint('Auth service: refreshing session after app resume');
          try {
            await _refreshSession();
          } catch (e) {
            debugPrint('Error refreshing session on resume: $e');
            
            // If refreshing failed, try to recover
            try {
              // First check if we still have a valid session
              final session = _supabase.auth.currentSession;
              if (session == null) {
                debugPrint('Session lost, attempting to recover from local storage');
                // Try to restore from persistent storage
                await _supabase.auth.refreshSession();
              }
            } catch (recoveryError) {
              debugPrint('Recovery failed: $recoveryError');
            }
          }
        }
      }
    });
  }
  
  // Private method to refresh the auth session
  Future<void> _refreshSession() async {
    try {
      // Set a timeout to prevent hanging
      await _supabase.auth.refreshSession().timeout(
        const Duration(seconds: 5),
        onTimeout: () {
          debugPrint('Session refresh timed out');
          throw TimeoutException('Session refresh timed out');
        },
      );
      
      _lastSessionCheck = DateTime.now();
      debugPrint('Auth session refreshed successfully');
    } catch (e) {
      debugPrint('Error refreshing auth session: $e');
      // Don't rethrow, just log - we want this to be non-blocking
    }
  }
  
  // Phone authentication methods
  
  // Send OTP to provided phone number
  Future<Map<String, dynamic>> sendOTP(String phoneNumber) async {
    try {
      // Format phone number if needed (ensure it has international format)
      if (phoneNumber.startsWith('5') && phoneNumber.length == 10) {
        phoneNumber = '90$phoneNumber'; // Add Turkey country code
      }
      
      // Call the Supabase Edge Function to send OTP
      final response = await _supabase.functions.invoke('send-otp', 
        body: {'phoneNumber': phoneNumber},
      );
      
      return response.data;
    } catch (e) {
      rethrow;
    }
  }
  
  // Verify OTP and create/sign in user
  Future<AuthResponse> verifyOTP({
    required String phoneNumber, 
    required String otp,
    required String password,
  }) async {
    try {
      // Format phone number if needed
      if (phoneNumber.startsWith('5') && phoneNumber.length == 10) {
        phoneNumber = '90$phoneNumber'; // Add Turkey country code
      }
      
      // Call the Supabase Edge Function to verify OTP and create/sign in user
      final response = await _supabase.functions.invoke('verify-otp',
        body: {
          'phoneNumber': phoneNumber,
          'otp': otp,
          'password': password,
        },
      );
      
      // After successful verification, we should have a session
      // Force refresh the session
      await refreshSessionManually();
      
      // Return a proper AuthResponse with the session
      return AuthResponse(
        session: _supabase.auth.currentSession,
        user: _supabase.auth.currentUser,
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<AuthResponse> signUp({
    required String email,
    required String password,
  }) async {
    return await _supabase.auth.signUp(
      email: email,
      password: password,
    );
  }
  
  Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    final response = await _supabase.auth.signInWithPassword(
      email: email,
      password: password,
    );
    _lastSessionCheck = DateTime.now();
    return response;
  }
  
  Future<void> signOut() async {
    await _supabase.auth.signOut();
    _lastSessionCheck = null;
  }
  
  Future<void> resetPassword(String email) async {
    await _supabase.auth.resetPasswordForEmail(email);
  }
  
  Future<void> updatePassword(String newPassword) async {
    await _supabase.auth.updateUser(
      UserAttributes(password: newPassword),
    );
    _lastSessionCheck = DateTime.now();
  }

  // Get user profile
  Future<Map<String, dynamic>?> getUserProfile() async {
    if (currentUser == null) return null;
    
    final response = await _supabase
        .from('profiles')
        .select()
        .eq('id', currentUser!.id)
        .single();
    
    return response;
  }

  // Update user profile
  Future<void> updateProfile({
    String? fullName,
    String? phoneNumber,
    String? avatarUrl,
  }) async {
    if (currentUser == null) return;

    final updates = {
      if (fullName != null) 'full_name': fullName,
      if (phoneNumber != null) 'phone_number': phoneNumber,
      if (avatarUrl != null) 'avatar_url': avatarUrl,
    };

    await _supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentUser!.id);
  }
  
  // Clean up resources
  void dispose() {
    _lifecycleSubscription?.cancel();
  }

  // Public method to manually refresh the session - used after login
  Future<void> refreshSessionManually() async {
    _lastSessionCheck = DateTime.now();
    await _refreshSession();
    
    // Don't try to trigger lifecycle events directly
  }
} 