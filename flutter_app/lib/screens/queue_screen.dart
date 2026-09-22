import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../models/video.dart';
import 'video_player_screen.dart';

class QueueScreen extends StatelessWidget {
  final List<Video> videos;
  final Function(String) onToggleSave;
  final Function(String) onToggleWatched;

  const QueueScreen({
    Key? key,
    required this.videos,
    required this.onToggleSave,
    required this.onToggleWatched,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final savedVideos = videos.where((v) => v.isSaved).toList();

    return Scaffold(
      backgroundColor: FeedlyColors.canvas,
      appBar: AppBar(
        title: Row(
          children: [
            const Text('Saved Queue', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: FeedlyColors.surfaceHigher,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '${savedVideos.length}',
                style: const TextStyle(color: FeedlyColors.primary, fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
      body: savedVideos.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.bookmark_border, size: 48, color: FeedlyColors.textSecondary),
                  const SizedBox(height: 12),
                  const Text('No videos in queue', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 6),
                  const Text('Save videos from your feed to watch them later.', style: TextStyle(color: FeedlyColors.textSecondary, fontSize: 13)),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: savedVideos.length,
              itemBuilder: (context, index) {
                final video = savedVideos[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: FeedlyColors.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.06)),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(10),
                    leading: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        video.thumbnail,
                        width: 80,
                        height: 50,
                        fit: BoxFit.cover,
                      ),
                    ),
                    title: Text(
                      video.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
                    ),
                    subtitle: Text(
                      '${video.channelTitle} • ${video.duration}',
                      style: const TextStyle(color: FeedlyColors.textSecondary, fontSize: 12),
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.bookmark_remove, color: FeedlyColors.accent),
                      onPressed: () => onToggleSave(video.id),
                      tooltip: 'Remove from Queue',
                    ),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => VideoPlayerScreen(
                            video: video,
                            subscriptionVideos: videos,
                            onToggleSave: onToggleSave,
                            onToggleWatched: onToggleWatched,
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
    );
  }
}
