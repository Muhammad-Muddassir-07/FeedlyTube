import 'package:flutter/material.dart';
import '../constants/theme.dart';

class ConnectScreen extends StatefulWidget {
  const ConnectScreen({Key? key}) : super(key: key);

  @override
  State<ConnectScreen> createState() => _ConnectScreenState();
}

class _ConnectScreenState extends State<ConnectScreen> {
  bool _isConnecting = false;
  bool _isConnected = false;

  void _simulateOAuth() {
    setState(() => _isConnecting = true);
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _isConnecting = false;
        _isConnected = true;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Connected to YouTube Subscriptions! 42 channels synced.'),
          backgroundColor: FeedlyColors.primary,
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FeedlyColors.canvas,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Step Progress
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text('STEP 2 OF 4', style: TextStyle(fontSize: 10, color: FeedlyColors.cyan, fontWeight: FontWeight.bold, letterSpacing: 1)),
                  Text('50% COMPLETED', style: TextStyle(fontSize: 10, color: FeedlyColors.textSecondary, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 6),
              LinearProgressIndicator(
                value: 0.5,
                backgroundColor: Colors.white10,
                color: FeedlyColors.cyan,
                minHeight: 3,
              ),
              const SizedBox(height: 24),

              // Title and badge
              Center(
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: FeedlyColors.cyan.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: FeedlyColors.cyan.withOpacity(0.3)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(Icons.bolt, size: 14, color: FeedlyColors.cyan),
                          SizedBox(width: 4),
                          Text('Deterministic Clarity', style: TextStyle(fontSize: 11, color: FeedlyColors.cyan, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Build a feed that\nbelongs to you.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, height: 1.2),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'FeedlyTube securely connects with your Google account to fetch only the channels you subscribe to. No algorithms, no shorts, no recommendations.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12, color: FeedlyColors.textSecondary, height: 1.4),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Scope Card (Matching Image 3)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: FeedlyColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: FeedlyColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Text('Permission Scope 🔒', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        Text('OAuth 2.0 Restricted', style: TextStyle(fontSize: 10, color: FeedlyColors.textSecondary, fontFamily: 'monospace')),
                      ],
                    ),
                    const Divider(color: Colors.white10, height: 20),
                    _buildScopeItem(
                      'Read-only access to YouTube Subscriptions',
                      'Syncs your creator list chronologically',
                    ),
                    const SizedBox(height: 12),
                    _buildScopeItem(
                      'Never posts, likes, or comments on your behalf',
                      'Zero write permissions requested or needed',
                    ),
                    const SizedBox(height: 12),
                    _buildScopeItem(
                      'Zero advertising data tracking or profiling',
                      'Tokens encrypted with AES-256 GCM',
                    ),
                    const SizedBox(height: 14),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: FeedlyColors.surfaceHover,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: const [
                          Text('Target Feed: Pure Chronological', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          Text('0 Algorithmic Injectors', style: TextStyle(fontSize: 10, color: FeedlyColors.cyan)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Connect Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _isConnecting ? null : _simulateOAuth,
                  icon: _isConnecting
                      ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Icon(Icons.play_circle_fill, size: 18),
                  label: Text(
                    _isConnecting
                        ? 'Connecting OAuth 2.0...'
                        : _isConnected
                            ? 'YouTube Connected'
                            : 'Connect YouTube Account',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: FeedlyColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Text('G Google OAuth Certified', style: TextStyle(fontSize: 10, color: FeedlyColors.textSecondary, fontWeight: FontWeight.bold)),
                    SizedBox(width: 8),
                    Text('•', style: TextStyle(color: FeedlyColors.textSecondary)),
                    SizedBox(width: 8),
                    Text('YouTube Data API v3', style: TextStyle(fontSize: 10, color: FeedlyColors.cyan, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScopeItem(String title, String subtitle) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(Icons.check_circle, size: 16, color: FeedlyColors.cyan),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 1),
              Text(subtitle, style: const TextStyle(fontSize: 10, color: FeedlyColors.textSecondary)),
            ],
          ),
        ),
      ],
    );
  }
}
