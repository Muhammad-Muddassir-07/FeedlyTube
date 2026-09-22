# FeedlyTube — Flutter Android & iOS Client

> "Your subscriptions. Your feed. Your focus."

FeedlyTube connects securely to your YouTube account to build a pure chronological feed containing ONLY channels you subscribe to. Zero algorithmic distractions, zero Shorts, zero recommendations.

---

## 📱 How to Build the APK

### Method 1: Automatic Cloud Build via GitHub Actions (Zero Setup Required)
This repository includes a pre-configured CI/CD workflow at `.github/workflows/build_apk.yml`:
1. Push or export this repository to your **GitHub** account.
2. Go to the **Actions** tab in your repository.
3. The **"Build FeedlyTube Android APK"** action will run automatically.
4. Once completed (approx. 2-3 minutes), click on the run and download the **`feedlytube-release-apks`** artifact containing the compiled `.apk` files directly to your Android device!

---

### Method 2: Local Machine Build (Command Line)

#### Prerequisites:
- [Flutter SDK](https://docs.flutter.dev/get-started/install) installed (`>= 3.22.x`)
- [Android Studio](https://developer.android.com/studio) with Android SDK and Command-line Tools installed.

#### Steps:
```bash
# 1. Navigate to the flutter_app directory
cd flutter_app

# 2. Get dependencies
flutter pub get

# 3. Build release APK
flutter build apk --release

# The compiled APK will be generated at:
# build/app/outputs/flutter-apk/app-release.apk
```

To install directly to a connected Android phone via USB:
```bash
flutter run --release
```

---

## 🎨 UI Architecture (Matching Google Stitch Designs)
- **FeedlyColors Theme**: Obsidian background (`#0B0D10`), Deep surface (`#13161B`), Indigo Brand (`#6366F1`), Cyan Telemetry (`#06B6D4`).
- **Feed Screen**: Chronological determinism, filter chips, video card context menus, "You're all caught up!" shield.
- **Channels Screen**: Search across 42 channels, unread dots, favorites/muted toggles, and sync bar.
- **Video Player**: Clean 16:9 obsidian viewport, speed switcher (1.25x), notes & interactive timestamps accordion, subscription queue.
- **Connect YouTube**: Step 2 of 4 restricted read-only OAuth 2.0 permission card.
