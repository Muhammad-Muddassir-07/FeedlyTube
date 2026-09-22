import 'package:flutter/material.dart';
import 'constants/theme.dart';
import 'models/video.dart';
import 'models/channel.dart';
import 'services/mock_data_service.dart';
import 'screens/feed_screen.dart';
import 'screens/channels_screen.dart';
import 'screens/connect_screen.dart';
import 'screens/queue_screen.dart';

void main() {
  runApp(const FeedlyTubeApp());
}

class FeedlyTubeApp extends StatelessWidget {
  const FeedlyTubeApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FeedlyTube',
      debugShowCheckedModeBanner: false,
      theme: FeedlyTheme.darkTheme,
      home: const MainNavigationShell(),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({Key? key}) : super(key: key);

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;
  late List<Video> _videos;
  late List<Channel> _channels;

  @override
  void initState() {
    super.initState();
    _videos = MockDataService.getInitialVideos();
    _channels = MockDataService.getInitialChannels();
  }

  void _handleToggleSave(String videoId) {
    setState(() {
      for (var v in _videos) {
        if (v.id == videoId) {
          v.isSaved = !v.isSaved;
          break;
        }
      }
    });
  }

  void _handleToggleWatched(String videoId) {
    setState(() {
      for (var v in _videos) {
        if (v.id == videoId) {
          v.isWatched = !v.isWatched;
          break;
        }
      }
    });
  }

  void _handleToggleFavorite(String channelId) {
    setState(() {
      for (var c in _channels) {
        if (c.id == channelId) {
          c.isFavorite = !c.isFavorite;
          break;
        }
      }
    });
  }

  void _handleToggleMute(String channelId) {
    setState(() {
      for (var c in _channels) {
        if (c.id == channelId) {
          c.isMuted = !c.isMuted;
          break;
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      FeedScreen(
        videos: _videos,
        onToggleSave: _handleToggleSave,
        onToggleWatched: _handleToggleWatched,
        onNavigateToChannels: () => setState(() => _currentIndex = 1),
      ),
      ChannelsScreen(
        channels: _channels,
        onToggleFavorite: _handleToggleFavorite,
        onToggleMute: _handleToggleMute,
      ),
      // Queue (Watch Later)
      QueueScreen(
        videos: _videos,
        onToggleSave: _handleToggleSave,
        onToggleWatched: _handleToggleWatched,
      ),
      // Connect / Settings
      const ConnectScreen(),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        backgroundColor: FeedlyColors.surface,
        selectedItemColor: FeedlyColors.primary,
        unselectedItemColor: FeedlyColors.textSecondary,
        selectedFontSize: 11,
        unselectedFontSize: 11,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dynamic_feed),
            label: 'Feed',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.subscriptions),
            label: 'Channels',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bookmark_outline),
            label: 'Queue',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
