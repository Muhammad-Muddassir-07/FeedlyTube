import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../models/video.dart';
import 'video_player_screen.dart';

class FeedScreen extends StatefulWidget {
  final List<Video> videos;
  final Function(String) onToggleSave;
  final Function(String) onToggleWatched;
  final VoidCallback onNavigateToChannels;

  const FeedScreen({
    Key? key,
    required this.videos,
    required this.onToggleSave,
    required this.onToggleWatched,
    required this.onNavigateToChannels,
  }) : super(key: key);

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  String _selectedFilter = 'All';

  @override
  Widget build(BuildContext context) {
    final filteredVideos = widget.videos.where((v) {
      if (_selectedFilter == 'Unwatched') return !v.isWatched;
      if (_selectedFilter != 'All') return v.category == _selectedFilter;
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: FeedlyColors.canvas,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // Top App Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: FeedlyColors.primary.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.waves, color: FeedlyColors.primary, size: 20),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'FeedlyTube',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: FeedlyColors.textPrimary),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.search, color: FeedlyColors.textSecondary),
                          onPressed: () {},
                        ),
                        const CircleAvatar(
                          radius: 14,
                          backgroundImage: NetworkImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Header Meta: "Your Feed", "Deterministic Timeline", Sync pill
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Your Feed',
                              style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: FeedlyColors.textPrimary, letterSpacing: -0.5),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Chronological • 14 updates today',
                              style: TextStyle(fontSize: 12, color: FeedlyColors.cyan, fontWeight: FontWeight.w500),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: FeedlyColors.surface,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: FeedlyColors.border),
                          ),
                          child: Row(
                            children: const [
                              Icon(Icons.circle, color: FeedlyColors.cyan, size: 6),
                              SizedBox(width: 6),
                              Text('Up to date • 2m', style: TextStyle(fontSize: 10, color: FeedlyColors.textSecondary)),
                              SizedBox(width: 4),
                              Icon(Icons.refresh, size: 12, color: FeedlyColors.cyan),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Deterministic timeline subhead
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [
                        Row(
                          children: [
                            Icon(Icons.access_time, size: 12, color: FeedlyColors.cyan),
                            SizedBox(width: 4),
                            Text('DETERMINISTIC TIMELINE', style: TextStyle(fontSize: 10, color: FeedlyColors.cyan, letterSpacing: 1, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Text('Newest First ▾', style: TextStyle(fontSize: 11, color: FeedlyColors.textSecondary)),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Filter chips row
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: ['All', 'Unwatched', 'Tech & Dev', 'Science', 'Design'].map((chip) {
                          final isSelected = _selectedFilter == chip;
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: FilterChip(
                              label: Text(chip, style: TextStyle(fontSize: 11, color: isSelected ? FeedlyColors.primaryLight : FeedlyColors.textSecondary)),
                              selected: isSelected,
                              backgroundColor: FeedlyColors.surface,
                              selectedColor: FeedlyColors.primary.withOpacity(0.2),
                              side: BorderSide(color: isSelected ? FeedlyColors.primary.withOpacity(0.5) : FeedlyColors.border),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              onSelected: (_) => setState(() => _selectedFilter = chip),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Video Cards List
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final video = filteredVideos[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    child: InkWell(
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) => VideoPlayerScreen(
                              video: video,
                              subscriptionVideos: widget.videos,
                              onToggleSave: widget.onToggleSave,
                              onToggleWatched: widget.onToggleWatched,
                              onSelectVideo: (newVid) {},
                            ),
                          ),
                        );
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          color: FeedlyColors.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: FeedlyColors.border),
                        ),
                        clipBehavior: Clip.antiAlias,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Thumbnail
                            Stack(
                              children: [
                                AspectRatio(
                                  aspectRatio: 16 / 9,
                                  child: Image.network(video.thumbnail, fit: BoxFit.cover),
                                ),
                                Positioned(
                                  bottom: 8,
                                  right: 8,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.85),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      video.duration,
                                      style: const TextStyle(fontSize: 10, color: Colors.white, fontFamily: 'monospace'),
                                    ),
                                  ),
                                ),
                                if (!video.isWatched)
                                  Positioned(
                                    top: 8,
                                    left: 8,
                                    child: Container(
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: FeedlyColors.cyan,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            // Details
                            Padding(
                              padding: const EdgeInsets.all(12),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  CircleAvatar(radius: 16, backgroundImage: NetworkImage(video.channelAvatar)),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          video.title,
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, height: 1.25),
                                        ),
                                        const SizedBox(height: 4),
                                        Row(
                                          children: [
                                            Text(video.channelTitle, style: const TextStyle(fontSize: 11, color: FeedlyColors.textSecondary)),
                                            const SizedBox(width: 4),
                                            if (video.channelVerified)
                                              const Icon(Icons.check_circle, size: 12, color: FeedlyColors.cyan),
                                            const SizedBox(width: 4),
                                            Text('• ${video.relativeTime}', style: const TextStyle(fontSize: 11, color: FeedlyColors.textSecondary)),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                  IconButton(
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                    icon: const Icon(Icons.more_vert, size: 18, color: FeedlyColors.textSecondary),
                                    onPressed: () {},
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
                childCount: filteredVideos.length,
              ),
            ),

            // End of feed: "You're all caught up!"
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: FeedlyColors.surface.withOpacity(0.8),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: FeedlyColors.border),
                  ),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: FeedlyColors.cyan.withOpacity(0.1),
                          shape: BoxShape.circle,
                          border: Border.all(color: FeedlyColors.cyan.withOpacity(0.3)),
                        ),
                        child: const Icon(Icons.verified_user_outlined, color: FeedlyColors.cyan, size: 24),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        "You're all caught up!",
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: FeedlyColors.textPrimary),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Subscriptions evaluated across 42 channels • 0 algorithmic interruptions • Pure chronological sanity.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 11, color: FeedlyColors.textSecondary, height: 1.4),
                      ),
                      const SizedBox(height: 14),
                      OutlinedButton.icon(
                        onPressed: widget.onNavigateToChannels,
                        icon: const Icon(Icons.tune, size: 14, color: FeedlyColors.cyan),
                        label: const Text('Manage 42 Channels', style: TextStyle(fontSize: 12, color: FeedlyColors.textPrimary)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Colors.white24),
                          backgroundColor: FeedlyColors.surfaceHover,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
