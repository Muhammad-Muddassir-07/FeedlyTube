import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../models/video.dart';

class VideoPlayerScreen extends StatefulWidget {
  final Video video;
  final List<Video> subscriptionVideos;
  final Function(String) onToggleSave;
  final Function(String) onToggleWatched;
  final Function(Video) onSelectVideo;

  const VideoPlayerScreen({
    Key? key,
    required this.video,
    required this.subscriptionVideos,
    required this.onToggleSave,
    required this.onToggleWatched,
    required this.onSelectVideo,
  }) : super(key: key);

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  bool _isPlaying = false;
  double _currentSeconds = 525.0;
  double _playbackSpeed = 1.25;
  bool _notesExpanded = true;
  int _activeChapterIndex = 1;

  String _formatTime(int totalSeconds) {
    final minutes = totalSeconds ~/ 60;
    final seconds = totalSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  void _cycleSpeed() {
    setState(() {
      if (_playbackSpeed == 1.0) _playbackSpeed = 1.25;
      else if (_playbackSpeed == 1.25) _playbackSpeed = 1.5;
      else if (_playbackSpeed == 1.5) _playbackSpeed = 2.0;
      else _playbackSpeed = 1.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final video = widget.video;
    final related = widget.subscriptionVideos.where((v) => v.id != video.id).take(3).toList();

    return Scaffold(
      backgroundColor: FeedlyColors.canvas,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: FeedlyColors.textSecondary),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: FeedlyColors.primary.withOpacity(0.2),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Icon(Icons.waves, color: FeedlyColors.primary, size: 16),
            ),
            const SizedBox(width: 8),
            const Text('Video Player', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: CircleAvatar(
              radius: 14,
              backgroundImage: NetworkImage(
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Aspect 16:9 Obsidian Video Viewport
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Container(
                color: Colors.black,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Image.network(
                      video.thumbnail,
                      width: double.infinity,
                      height: double.infinity,
                      fit: BoxFit.cover,
                      color: Colors.black.withOpacity(_isPlaying ? 0.2 : 0.4),
                      colorBlendMode: BlendMode.darken,
                    ),
                    // Top Telemetry Badge
                    Positioned(
                      top: 10,
                      right: 10,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.8),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white10),
                        ),
                        child: Row(
                          children: const [
                            Icon(Icons.circle, color: FeedlyColors.cyan, size: 6),
                            SizedBox(width: 4),
                            Text(
                              '1080p60 • Ad-free',
                              style: TextStyle(color: FeedlyColors.cyan, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ),
                    // Center Big Play Button
                    GestureDetector(
                      onTap: () => setState(() => _isPlaying = !_isPlaying),
                      child: Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.18),
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white30),
                        ),
                        child: Icon(
                          _isPlaying ? Icons.pause : Icons.play_arrow,
                          color: Colors.white,
                          size: 32,
                        ),
                      ),
                    ),
                    // Bottom Player Scrubber Bar
                    Positioned(
                      bottom: 0,
                      left: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [Colors.transparent, Colors.black.withOpacity(0.9)],
                          ),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            SliderTheme(
                              data: SliderTheme.of(context).copyWith(
                                trackHeight: 3,
                                thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                                activeTrackColor: FeedlyColors.cyan,
                                inactiveTrackColor: Colors.white24,
                                thumbColor: FeedlyColors.cyan,
                              ),
                              child: Slider(
                                value: _currentSeconds.clamp(0.0, video.durationSeconds.toDouble()),
                                min: 0.0,
                                max: video.durationSeconds.toDouble(),
                                onChanged: (val) => setState(() => _currentSeconds = val),
                              ),
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    IconButton(
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(),
                                      icon: Icon(_isPlaying ? Icons.pause : Icons.play_arrow, size: 20),
                                      onPressed: () => setState(() => _isPlaying = !_isPlaying),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      '${_formatTime(_currentSeconds.toInt())} / ${video.duration}',
                                      style: const TextStyle(fontSize: 11, color: FeedlyColors.textSecondary, fontFamily: 'monospace'),
                                    ),
                                  ],
                                ),
                                GestureDetector(
                                  onTap: _cycleSpeed,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: Colors.white10,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      '${_playbackSpeed}x',
                                      style: const TextStyle(fontSize: 11, color: FeedlyColors.cyan, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Video Meta & Actions
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: FeedlyColors.primary.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: FeedlyColors.primary.withOpacity(0.3)),
                        ),
                        child: const Text('Chronological Feed', style: TextStyle(color: FeedlyColors.primaryLight, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 6),
                      Text(video.isWatched ? 'Watched' : '• Unread •', style: TextStyle(color: video.isWatched ? Colors.greenAccent : FeedlyColors.cyan, fontSize: 11)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    video.title,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: FeedlyColors.textPrimary, height: 1.3),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Published ${video.relativeTime} • ${video.views} • 0 ads',
                    style: const TextStyle(fontSize: 11, color: FeedlyColors.textSecondary),
                  ),
                  const SizedBox(height: 16),

                  // Channel Row
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: FeedlyColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: FeedlyColors.border),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(radius: 18, backgroundImage: NetworkImage(video.channelAvatar)),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(video.channelTitle, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                  if (video.channelVerified) ...[
                                    const SizedBox(width: 4),
                                    const Icon(Icons.check_circle, size: 14, color: FeedlyColors.cyan),
                                  ],
                                ],
                              ),
                              const Text('Subscribed • 84 videos', style: TextStyle(color: FeedlyColors.textSecondary, fontSize: 11)),
                            ],
                          ),
                        ),
                        OutlinedButton(
                          onPressed: () {},
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.white24),
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          ),
                          child: const Text('Manage', style: TextStyle(fontSize: 11, color: FeedlyColors.textPrimary)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Action Buttons (Saved, Watched, Share)
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            setState(() => video.isSaved = !video.isSaved);
                            widget.onToggleSave(video.id);
                          },
                          icon: Icon(video.isSaved ? Icons.bookmark : Icons.bookmark_border, size: 16, color: video.isSaved ? FeedlyColors.primaryLight : Colors.white),
                          label: Text(video.isSaved ? 'Saved' : 'Watch Later', style: const TextStyle(fontSize: 11)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: video.isSaved ? FeedlyColors.primary.withOpacity(0.25) : FeedlyColors.surface,
                            foregroundColor: FeedlyColors.textPrimary,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10), side: const BorderSide(color: FeedlyColors.border)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            setState(() => video.isWatched = !video.isWatched);
                            widget.onToggleWatched(video.id);
                          },
                          icon: Icon(Icons.check_circle_outline, size: 16, color: video.isWatched ? Colors.greenAccent : FeedlyColors.cyan),
                          label: Text(video.isWatched ? 'Watched' : 'Mark Watched', style: const TextStyle(fontSize: 11)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: video.isWatched ? Colors.green.withOpacity(0.15) : FeedlyColors.surface,
                            foregroundColor: FeedlyColors.textPrimary,
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10), side: const BorderSide(color: FeedlyColors.border)),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Accordion: Notes & Timestamps
                  Container(
                    decoration: BoxDecoration(
                      color: FeedlyColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: FeedlyColors.border),
                    ),
                    child: Column(
                      children: [
                        ListTile(
                          dense: true,
                          title: const Text('Video Notes & Timestamps', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                          trailing: Icon(_notesExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, color: FeedlyColors.textSecondary),
                          onTap: () => setState(() => _notesExpanded = !_notesExpanded),
                        ),
                        if (_notesExpanded) ...[
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(video.description, style: const TextStyle(fontSize: 12, color: FeedlyColors.textSecondary, height: 1.4)),
                                const SizedBox(height: 10),
                                const Text('CHAPTERS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: FeedlyColors.textMuted, letterSpacing: 1)),
                                const SizedBox(height: 6),
                                ...video.chapters.asMap().entries.map((entry) {
                                  final idx = entry.key;
                                  final ch = entry.value;
                                  final isActive = idx == _activeChapterIndex;
                                  return InkWell(
                                    onTap: () {
                                      setState(() {
                                        _activeChapterIndex = idx;
                                        _currentSeconds = ch.seconds.toDouble();
                                        _isPlaying = true;
                                      });
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
                                      margin: const EdgeInsets.symmetric(vertical: 2),
                                      decoration: BoxDecoration(
                                        color: isActive ? FeedlyColors.primary.withOpacity(0.15) : Colors.transparent,
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Row(
                                        children: [
                                          Text(ch.time, style: const TextStyle(fontFamily: 'monospace', fontSize: 11, color: FeedlyColors.cyan)),
                                          const SizedBox(width: 8),
                                          Expanded(child: Text(ch.title, style: TextStyle(fontSize: 12, color: isActive ? FeedlyColors.primaryLight : FeedlyColors.textPrimary))),
                                          Icon(isActive ? Icons.bar_chart : Icons.play_arrow, size: 14, color: isActive ? FeedlyColors.cyan : FeedlyColors.textMuted),
                                        ],
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Up next from subscriptions
                  const Text('From Your Subscriptions', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  ...related.map((subVideo) {
                    return InkWell(
                      onTap: () {
                        widget.onSelectVideo(subVideo);
                        Navigator.of(context).pop();
                      },
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: FeedlyColors.surface,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: FeedlyColors.border),
                        ),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(6),
                              child: Image.network(subVideo.thumbnail, width: 90, height: 50, fit: BoxFit.cover),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(subVideo.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 2),
                                  Text('${subVideo.channelTitle} • ${subVideo.relativeTime}', style: const TextStyle(fontSize: 10, color: FeedlyColors.textSecondary)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
