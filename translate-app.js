const fs = require('fs');

let appJsx = fs.readFileSync('app.jsx', 'utf8');

// Replace storyData.en
const storyDataEnMatch = /en:\s*\[\s*\{\s*category:\s*"Politics"[\s\S]*?\}\s*\]/;
const newStoryDataEn = `en: [
    {
      category: "Politics",
      title: "Open budget discussions in regions will be held under new rules",
      summary: "Local councils will publish a digital schedule for reviewing citizens' proposals.",
      image: images.newsroom,
      author: "Ali Valiyev",
      time: "Today, 10:30",
      read: "3 minutes",
      body: "Article text...",
      status: "published",
      tags: "budget, reform",
      views: 120,
    }
  ]`;
appJsx = appJsx.replace(storyDataEnMatch, newStoryDataEn);

// Replace copy["en"]
const copyEnRegex = /copy\["en"\] = \{[\s\S]*?\s+close:\s*"Закрыть",\s*\};/;
const newCopyEn = `copy["en"] = {
  live: "Live feed",
  date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
  search: "Search...",
  portal: "News Portal",
  read: "Read",
  popular: "Popular",
  newsletterTitle: "Daily Digest",
  newsletterText: "Get top news, analytics, and special materials delivered to your inbox.",
  email: "Your email",
  subscribe: "Subscribe",
  latest: "Latest News",
  latestNote: "Timely updates, short breakdowns, and context from the editorial team.",
  all: "All",
  special: "Special Project",
  specialTitle: "Data-driven journalism: separating events from noise",
  specialText:
    "Vatan.uz editorial team explains important processes in politics, economy, technology, sports, and culture in plain language.",
  pages: ["Home", "Politics", "Economy", "Technology", "Sports", "Culture", "Contacts"],
  pageNotes: {
    "Home": "Top materials, trends, and key topics of the day.",
    "Politics": "Public administration, parliament, local councils, and public discussions.",
    "Economy": "Markets, business, finance, employment, and the entrepreneurial environment.",
    "Technology": "Startups, artificial intelligence, digital services, and cybersecurity.",
    "Sports": "Football, Olympic sports, tournaments, and stories of athletes.",
    "Culture": "Cinema, theater, books, music, and cultural events of city life.",
    "Contacts": "Contact the editorial team, advertising, and partnership projects.",
  },
  contact: [
    ["Editorial", "News, press releases, and photo materials: news@vatan.uz"],
    ["Advertising", "Brand projects, banners, and special pages: ads@vatan.uz"],
    ["Address", "Tashkent, Media Center, 4th floor. Monday-Friday 09:00-18:00."],
  ],
  close: "Close",
};`;

appJsx = appJsx.replace(copyEnRegex, newCopyEn);

fs.writeFileSync('app.jsx', appJsx);
console.log('app.jsx translated!');
