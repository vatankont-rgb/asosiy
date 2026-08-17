const { Client } = require('ssh2');

const conn = new Client();

const commands = [
  'ssh-keyscan github.com >> ~/.ssh/known_hosts',
  'rm -rf /var/www/vatanuz',
  'mkdir -p /var/www',
  'git clone git@github.com:vatankont-rgb/asosiy.git /var/www/vatanuz',
  'cd /var/www/vatanuz && npm install',
  'cd /var/www/vatanuz && pm2 delete vatanuz || true',
  'cd /var/www/vatanuz && pm2 start server.js --name vatanuz',
  'pm2 save',
  'env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root || true',
  `cat << 'EOF' > /etc/nginx/sites-available/vatanuz
server {
    listen 80;
    server_name vatanuz.uz www.vatanuz.uz 189.74.97.12;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \\$host;
        proxy_cache_bypass \\$http_upgrade;
    }
}
EOF`,
  'ln -sf /etc/nginx/sites-available/vatanuz /etc/nginx/sites-enabled/',
  'rm -f /etc/nginx/sites-enabled/default',
  'systemctl restart nginx'
];

conn.on('ready', () => {
  console.log('SSH :: ulandi. O\\\'rnatish jarayoni boshlandi...');
  let cmdIndex = 0;

  function runNext() {
    if (cmdIndex >= commands.length) {
      console.log('\\nBarcha jarayonlar muvaffaqiyatli tugadi!');
      conn.end();
      return;
    }

    const cmd = commands[cmdIndex];
    console.log(`\\nBajarilmoqda [${cmdIndex+1}/${commands.length}]: ${cmd.split('\\n')[0].substring(0, 50)}...`);
    
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      
      stream.on('close', (code, signal) => {
        console.log(`Tugadi (Kodi: ${code})`);
        cmdIndex++;
        runNext();
      }).on('data', (data) => {
        process.stdout.write(data);
      }).stderr.on('data', (data) => {
        process.stderr.write(data);
      });
    });
  }

  runNext();
}).connect({
  host: '189.74.97.12',
  port: 22,
  username: 'root',
  password: 'uF*qPp0^Qm&?hlia',
  readyTimeout: 99999
});
