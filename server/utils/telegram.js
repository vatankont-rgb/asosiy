const https = require('https');
const settingRepository = require('../repositories/settingRepository');

async function sendTelegramMessage(message) {
  try {
    const settings = await settingRepository.getSettings();
    if (!settings || !settings.telegramBot || !settings.telegramBot.token || !settings.telegramBot.chatId) {
      return false; // Telegram bot not configured
    }

    const { token, chatId } = settings.telegramBot;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(true);
          } else {

            resolve(false);
          }
        });
      });

      req.on('error', (e) => {

        resolve(false);
      });

      req.write(payload);
      req.end();
    });
  } catch (err) {

    return false;
  }
}

module.exports = {
  sendTelegramMessage
};
