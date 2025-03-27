import 'package:flutter/material.dart';
import 'package:provider/provider.dart' as provider;
import 'package:land_auction_app/services/auth_service.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final authService = provider.Provider.of<AuthService>(context);
    final theme = Theme.of(context);
    final user = authService.currentUser;
    
    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            _buildHeader(context, user, theme),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    const Divider(),
                    ListTile(
                      leading: Icon(
                        Icons.home,
                        color: theme.colorScheme.primary,
                      ),
                      title: const Text('Anasayfa'),
                      onTap: () {
                        Navigator.of(context).pushReplacementNamed('/');
                      },
                    ),
                    const Divider(),
                    if (user != null) ...[
                      ListTile(
                        leading: Icon(
                          Icons.person,
                          color: theme.colorScheme.primary,
                        ),
                        title: const Text('Profil'),
                        onTap: () {
                          Navigator.of(context).pop();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Profil ekranı henüz uygulanmamış'),
                            ),
                          );
                        },
                      ),
                      const Divider(),
                      ListTile(
                        leading: Icon(
                          Icons.history,
                          color: theme.colorScheme.primary,
                        ),
                        title: const Text('Teklifleriniz'),
                        onTap: () {
                          Navigator.of(context).pop();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Teklif geçmişi ekranı henüz uygulanmamış'),
                            ),
                          );
                        },
                      ),
                      const Divider(),
                      ListTile(
                        leading: Icon(
                          Icons.exit_to_app,
                          color: theme.colorScheme.primary,
                        ),
                        title: const Text('Çıkış Yap'),
                        onTap: () async {
                          Navigator.of(context).pop();
                          await authService.signOut();
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Çıkış yaptınız'),
                              ),
                            );
                          }
                        },
                      ),
                    ] else ...[
                      ListTile(
                        leading: Icon(
                          Icons.login,
                          color: theme.colorScheme.primary,
                        ),
                        title: const Text('Giriş Yap'),
                        onTap: () {
                          Navigator.of(context).pop();
                          _showLoginDialog(context, authService);
                        },
                      ),
                    ],
                    const Divider(),
                    ListTile(
                      leading: Icon(
                        Icons.info_outline,
                        color: theme.colorScheme.primary,
                      ),
                      title: const Text('Hakkında'),
                      onTap: () {
                        Navigator.of(context).pop();
                        showAboutDialog(
                          context: context,
                          applicationName: 'Arazi İhale Uygulaması',
                          applicationVersion: '1.0.0',
                          applicationIcon: Icon(
                            Icons.gavel,
                            color: theme.colorScheme.primary,
                            size: 36,
                          ),
                          applicationLegalese: '© 2023 Arazi İhale Uygulaması. Tüm hakları saklıdır.',
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                'Arazi İhale Uygulaması v1.0.0',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildHeader(BuildContext context, User? user, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary,
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Arazi İhale Uygulaması',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            if (user != null) ...[
              CircleAvatar(
                radius: 24,
                backgroundColor: Colors.white,
                child: Text(
                  user.email?[0].toUpperCase() ?? 'U',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.primary,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                user.email ?? '',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ] else ...[
              const Text(
                'Hoş Geldiniz, Misafir',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Teklif vermek için lütfen giriş yapın',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 14,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
  
  void _showLoginDialog(BuildContext context, AuthService authService) {
    final emailController = TextEditingController();
    final passwordController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Giriş Yap'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: emailController,
                decoration: const InputDecoration(
                  labelText: 'E-posta',
                  hintText: 'kullanici@ornek.com',
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: passwordController,
                decoration: const InputDecoration(
                  labelText: 'Şifre',
                  hintText: 'şifre',
                ),
                obscureText: true,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
            },
            child: const Text('İptal'),
          ),
          ElevatedButton(
            onPressed: () async {
              final email = emailController.text.trim();
              final password = passwordController.text.trim();
              
              if (email.isEmpty || password.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Lütfen email ve şifre girin'),
                  ),
                );
                return;
              }
              
              // First close the dialog
              Navigator.of(dialogContext).pop();
              
              try {
                await authService.signIn(email: email, password: password);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Giriş başarılı'),
                    ),
                  );
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Giriş başarısız. Lütfen kimlik bilgilerini kontrol edin'),
                    ),
                  );
                }
              }
            },
            child: const Text('Giriş Yap'),
          ),
        ],
      ),
    );
  }
} 