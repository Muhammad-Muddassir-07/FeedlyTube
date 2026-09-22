import 'package:flutter/material.dart';

class FeedlyColors {
  static const Color canvas = Color(0xFF0B0D10);
  static const Color surface = Color(0xFF13161B);
  static const Color surfaceHover = Color(0xFF1A1F26);
  static const Color primary = Color(0xFF6366F1);
  static const Color primaryLight = Color(0xFFC0C1FF);
  static const Color cyan = Color(0xFF06B6D4);
  static const Color cyanMuted = Color(0x2606B6D4);
  
  static const Color textPrimary = Color(0xFFF5F7FA);
  static const Color textSecondary = Color(0xFF9CA3AF);
  static const Color textMuted = Color(0xFF6B7280);
  
  static const Color border = Color(0x14FFFFFF);
  static const Color borderLight = Color(0x24FFFFFF);
}

class FeedlyTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: FeedlyColors.canvas,
      primaryColor: FeedlyColors.primary,
      colorScheme: const ColorScheme.dark(
        primary: FeedlyColors.primary,
        surface: FeedlyColors.surface,
        onSurface: FeedlyColors.textPrimary,
      ),
      fontFamily: 'Roboto',
      appBarTheme: const AppBarTheme(
        backgroundColor: FeedlyColors.canvas,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: FeedlyColors.textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.3,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: FeedlyColors.surface,
        selectedItemColor: FeedlyColors.primary,
        unselectedItemColor: FeedlyColors.textSecondary,
        type: BottomNavigationBarType.fixed,
        elevation: 10,
      ),
    );
  }
}
