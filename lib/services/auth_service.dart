import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService {
  final SupabaseClient _supabase;
  
  AuthService(this._supabase);
  
  User? get currentUser => _supabase.auth.currentUser;
  
  bool get isAuthenticated => currentUser != null;
  
  Stream<AuthState> get authStateChanges => _supabase.auth.onAuthStateChange;
  
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
    return await _supabase.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }
  
  Future<void> signOut() async {
    await _supabase.auth.signOut();
  }
  
  Future<void> resetPassword(String email) async {
    await _supabase.auth.resetPasswordForEmail(email);
  }
  
  Future<void> updatePassword(String newPassword) async {
    await _supabase.auth.updateUser(
      UserAttributes(password: newPassword),
    );
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
} 