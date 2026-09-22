import 'package:flutter/material.dart';
import '../constants/theme.dart';
import '../models/channel.dart';

class ChannelsScreen extends StatefulWidget {
  final List<Channel> channels;
  final Function(String) onToggleFavorite;
  final Function(String) onToggleMute;

  const ChannelsScreen({
    Key? key,
    required this.channels,
    required this.onToggleFavorite,
    required this.onToggleMute,
  }) : super(key: key);

  @override
  State<ChannelsScreen> createState() => _ChannelsScreenState();
}

class _ChannelsScreenState extends State<ChannelsScreen> {
  String _searchQuery = '';
  String _filter = 'All';

  @override
  Widget build(BuildContext context) {
    final filtered = widget.channels.where((c) {
      final matchesSearch = c.title.toLowerCase().contains(_searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (_filter == 'Favorites') return c.isFavorite;
      if (_filter == 'Muted') return c.isMuted;
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: FeedlyColors.canvas,
      body: SafeArea(
        child: Column(
          children: [
            // Top Search & Filter Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 42,
                      decoration: BoxDecoration(
                        color: FeedlyColors.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: FeedlyColors.border),
                      ),
                      child: TextField(
                        onChanged: (val) => setState(() => _searchQuery = val),
                        style: const TextStyle(fontSize: 13, color: FeedlyColors.textPrimary),
                        decoration: const InputDecoration(
                          hintText: 'Filter 42 channels...',
                          hintStyle: TextStyle(color: FeedlyColors.textSecondary, fontSize: 12),
                          prefixIcon: Icon(Icons.search, size: 18, color: FeedlyColors.textSecondary),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 10),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    height: 42,
                    width: 42,
                    decoration: BoxDecoration(
                      color: FeedlyColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: FeedlyColors.border),
                    ),
                    child: const Icon(Icons.swap_vert, color: FeedlyColors.cyan, size: 20),
                  ),
                ],
              ),
            ),

            // Chips
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Row(
                children: [
                  _buildChip('All Channels 42', 'All'),
                  const SizedBox(width: 8),
                  _buildChip('Favorites 8', 'Favorites'),
                  const SizedBox(width: 8),
                  _buildChip('Muted 3', 'Muted'),
                ],
              ),
            ),

            // Channel List
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 80),
                itemCount: filtered.length,
                itemBuilder: (context, index) {
                  final ch = filtered[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: FeedlyColors.surface,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: FeedlyColors.border),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Stack(
                          children: [
                            CircleAvatar(radius: 20, backgroundImage: NetworkImage(ch.avatar)),
                            if (ch.unreadCount > 0)
                              Positioned(
                                top: 0,
                                right: 0,
                                child: Container(
                                  width: 10,
                                  height: 10,
                                  decoration: BoxDecoration(
                                    color: FeedlyColors.cyan,
                                    shape: BoxShape.circle,
                                    border: Border.all(color: FeedlyColors.surface, width: 1.5),
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(ch.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                  if (ch.verified) ...[
                                    const SizedBox(width: 4),
                                    const Icon(Icons.check_circle, size: 12, color: FeedlyColors.cyan),
                                  ],
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text('${ch.videoCount} videos tracked • ${ch.description}', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: FeedlyColors.textSecondary, fontSize: 11)),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: Colors.black45,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text('Latest: ${ch.latestVideoTime}', style: const TextStyle(fontSize: 10, color: FeedlyColors.textSecondary)),
                                  ),
                                  const SizedBox(width: 6),
                                  if (ch.unreadCount > 0)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: FeedlyColors.primary.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: Text('${ch.unreadCount} unread', style: const TextStyle(fontSize: 10, color: FeedlyColors.primaryLight, fontWeight: FontWeight.bold)),
                                    ),
                                  const Spacer(),
                                  Row(
                                    children: const [
                                      Icon(Icons.circle, size: 6, color: FeedlyColors.cyan),
                                      SizedBox(width: 4),
                                      Text('Active', style: TextStyle(fontSize: 10, color: FeedlyColors.cyan, fontWeight: FontWeight.bold)),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        Column(
                          children: [
                            IconButton(
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                              icon: Icon(ch.isFavorite ? Icons.star : Icons.star_border, size: 18, color: ch.isFavorite ? Colors.amber : FeedlyColors.textSecondary),
                              onPressed: () {
                                setState(() => ch.isFavorite = !ch.isFavorite);
                                widget.onToggleFavorite(ch.id);
                              },
                            ),
                            const SizedBox(height: 8),
                            IconButton(
                              padding: EdgeInsets.zero,
                              constraints: const BoxConstraints(),
                              icon: Icon(ch.isMuted ? Icons.notifications_off : Icons.notifications_none, size: 18, color: ch.isMuted ? Colors.redAccent : FeedlyColors.textSecondary),
                              onPressed: () {
                                setState(() => ch.isMuted = !ch.isMuted);
                                widget.onToggleMute(ch.id);
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChip(String label, String value) {
    final isSelected = _filter == value;
    return GestureDetector(
      onTap: () => setState(() => _filter = value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? FeedlyColors.primary.withOpacity(0.2) : FeedlyColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? FeedlyColors.primary.withOpacity(0.5) : FeedlyColors.border),
        ),
        child: Text(
          label,
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isSelected ? FeedlyColors.primaryLight : FeedlyColors.textSecondary),
        ),
      ),
    );
  }
}
