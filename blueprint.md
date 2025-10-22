
# KaagNews App Blueprint

## Overview

KaagNews is a Flutter-based news aggregator application designed to provide users with a real-time news feed from various sources. The app features a clean, dark-themed, modern user interface and pulls live data from a Firebase backend.

## Implemented Features

*   **Modern UI**: A dark-themed, visually appealing interface built with Flutter and Material Design principles.
*   **Tabbed Navigation**: A top tab bar for browsing different news categories.
*   **Bottom Navigation**: A standard bottom navigation bar for accessing different sections of the app.
*   **Styled Components**: Custom-styled widgets, including featured story cards and standard story cards.
*   **Firebase Integration**: The app is connected to a Firebase project, ready for backend integration.

## Current Plan: RSS Feed Backend

The current goal is to implement a backend service that automatically fetches news from RSS feeds and displays it in the app in real-time.

### Action Steps

1.  **Initialize Firebase in the App**:
    *   Add `firebase_core` and `cloud_firestore` to `pubspec.yaml`.
    *   Run `flutterfire configure` to generate the `firebase_options.dart` file.
    *   Update `lib/main.dart` to initialize Firebase on startup.

2.  **Set Up Firebase Cloud Functions**:
    *   Create a `functions` directory for the backend code.
    *   Initialize a Node.js project and add the following dependencies:
        *   `firebase-functions`: To create and manage Cloud Functions.
        *   `firebase-admin`: To interact with Firebase services from the backend.
        *   `rss-parser`: To parse the XML from the RSS feeds.
    *   Create a scheduled Cloud Function (`rssFetcher`) that runs every 5 minutes.

3.  **Manage RSS Feeds in Firestore**:
    *   Create a Firestore collection named `rss_feeds` to store the list of RSS feed URLs. This will allow for easy updates.
    *   The initial feeds to be added are:
        *   `https://www.onlinekhabar.com/feed`
        *   `https://rajdhanidaily.com/feed/`

4.  **Fetch and Store Articles**:
    *   The `rssFetcher` function will:
        *   Read the list of URLs from the `rss_feeds` collection.
        *   Loop through each URL, fetch the feed content, and parse it.
        *   For each article in the feed, create a new document in an `articles` collection in Firestore. Each document will include the title, link, publication date, and source.

5.  **Update the Flutter UI for Real-Time News**:
    *   Modify the `_buildNewsFeed` method in `lib/main.dart` to use a `StreamBuilder`.
    *   The `StreamBuilder` will listen to the `articles` collection in Firestore.
    *   The UI will be rebuilt in real-time as new articles are added to the database, creating a live news feed.

6.  **Deploy the Backend**:
    *   Deploy the `rssFetcher` function to Firebase using the Firebase CLI.

This plan will create a robust, scalable backend that keeps your app's content fresh and up-to-date automatically.
