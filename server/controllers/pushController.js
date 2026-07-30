const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

const VAPID_FILE = path.join(__dirname, '../storage/vapid.json');
const SUBS_FILE = path.join(__dirname, '../storage/subscriptions.json');

// Initialize storage files if they don't exist
if (!fs.existsSync(path.join(__dirname, '../storage'))) {
  fs.mkdirSync(path.join(__dirname, '../storage'), { recursive: true });
}
if (!fs.existsSync(SUBS_FILE)) {
  fs.writeFileSync(SUBS_FILE, JSON.stringify([]));
}

let vapidKeys = {};
if (fs.existsSync(VAPID_FILE)) {
  vapidKeys = JSON.parse(fs.readFileSync(VAPID_FILE, 'utf8'));
} else {
  vapidKeys = webpush.generateVAPIDKeys();
  fs.writeFileSync(VAPID_FILE, JSON.stringify(vapidKeys, null, 2));
}

webpush.setVapidDetails(
  'mailto:contact@vatanuz.uz',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

class PushController {
  getPublicKey(req, res) {
    res.json({ publicKey: vapidKeys.publicKey });
  }

  subscribe(req, res) {
    const subscription = req.body;
    let subscriptions = JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8'));
    
    // Avoid duplicates
    if (!subscriptions.find(s => s.endpoint === subscription.endpoint)) {
      subscriptions.push(subscription);
      fs.writeFileSync(SUBS_FILE, JSON.stringify(subscriptions, null, 2));
    }
    
    res.status(201).json({ success: true });
  }

  async sendPushNotification(payload) {
    let subscriptions = JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8'));
    const notifications = subscriptions.map((subscription) => 
      webpush.sendNotification(subscription, JSON.stringify(payload))
        .catch(err => {
          if (err.statusCode === 404 || err.statusCode === 410) {

            // In a real app, you should remove it from the DB here
          } else {

          }
        })
    );
    await Promise.all(notifications);
  }
}

module.exports = new PushController();
