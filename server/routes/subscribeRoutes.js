const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, '../storage/subscribers.json');

router.post('/', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  let subscribers = [];
  try {
    if (fs.existsSync(storagePath)) {
      subscribers = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
    }
  } catch (err) {}

  if (!subscribers.includes(email)) {
    subscribers.push(email);
    fs.writeFileSync(storagePath, JSON.stringify(subscribers, null, 2));
  }

  res.status(200).json({ success: true });
});

module.exports = router;
