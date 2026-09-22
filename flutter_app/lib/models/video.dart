class Chapter {
  final String title;
  final String time;
  final int seconds;

  Chapter({
    required this.title,
    required this.time,
    required this.seconds,
  });

  factory Chapter.fromJson(Map<String, dynamic> json) {
    return Chapter(
      title: json['title'] ?? '',
      time: json['time'] ?? '00:00',
      seconds: json['seconds'] ?? 0,
    );
  }
}

class Video {
  final String id;
  final String youtubeVideoId;
  final String title;
  final String channelTitle;
  final String channelAvatar;
  final bool channelVerified;
  final String channelId;
  final String thumbnail;
  final String duration;
  final int durationSeconds;
  final String publishedAt;
  final String relativeTime;
  final String category;
  final String description;
  final String views;
  final List<Chapter> chapters;
  final List<String> tags;
  bool isSaved;
  bool isWatched;

  Video({
    required this.id,
    required this.youtubeVideoId,
    required this.title,
    required this.channelTitle,
    required this.channelAvatar,
    this.channelVerified = false,
    required this.channelId,
    required this.thumbnail,
    required this.duration,
    required this.durationSeconds,
    required this.publishedAt,
    required this.relativeTime,
    required this.category,
    required this.description,
    this.views = '24.5k views',
    this.chapters = const [],
    this.tags = const [],
    this.isSaved = false,
    this.isWatched = false,
  });
}
