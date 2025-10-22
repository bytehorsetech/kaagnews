
const admin = require("firebase-admin");
const Parser = require("rss-parser");

// Check if the FIREBASE_SERVICE_ACCOUNT environment variable is set.
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // In a GitHub Actions environment, the service account key is passed as a string.
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  // In a local or other Firebase environment, the SDK will automatically
  // discover the credentials.
  admin.initializeApp();
}

const parser = new Parser();

async function fetchFeeds() {
  // Temporarily hardcode the feed URLs for testing.
  const feedUrls = [
    "https://www.onlinekhabar.com/feed",
    "https://www.rajdhanidaily.com/feed/"
  ];

  for (const url of feedUrls) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items) {
        const article = {
          title: item.title,
          link: item.link,
          publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
          source: feed.title,
          imageUrl: item.enclosure ? item.enclosure.url : null,
        };

        const crypto = require("crypto");
        const hash = crypto.createHash('sha256').update(item.link).digest('hex');

        await admin.firestore().collection("articles").doc(hash).set(article, { merge: true });
      }
    } catch (error) {
      console.error(`Error fetching or parsing feed: ${url}`, error);
    }
  }
}

// If this script is run directly (e.g., from a GitHub Action), execute the fetchFeeds function.
if (require.main === module) {
  fetchFeeds().then(() => {
    console.log("Finished fetching feeds.");
    process.exit(0);
  }).catch(error => {
    console.error("Error fetching feeds:", error);
    process.exit(1);
  });
}
