class Channel {
  final String id;
  final String title;
  final String handle;
  final String avatar;
  final bool verified;
  final int videoCount;
  final String description;
  final int unreadCount;
  final String latestVideoTime;
  final String? subscriberCount;
  bool isFavorite;
  bool isMuted;

  Channel({
    required this.id,
    required this.title,
    required this.handle,
    required this.avatar,
    this.verified = false,
    required this.videoCount,
    required this.description,
    required this.unreadCount,
    required this.latestVideoTime,
    this.subscriberCount,
    this.isFavorite = false,
    this.isMuted = false,
  });
}
