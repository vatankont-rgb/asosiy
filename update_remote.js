const { Client } = require('ssh2');
const conn = new Client();

const commands = [
  "sed -i 's/info@vatanuz.uz/vatankont@gmail.com/g' /var/www/vatanuz/server/storage/pages.json",
  "sed -i 's/info@vatanuz.uz/vatankont@gmail.com/g' /var/www/vatanuz/server/storage/settings.json",
  "pm2 restart vatanuz"
];

conn.on('ready', () => {
  let i = 0;
  const execNext = () => {
    if (i >= commands.length) {
      console.log('Update completed on remote server.');
      conn.end();
      process.exit(0);
      return;
    }
    console.log(`Bajarilmoqda: ${commands[i]}`);
    conn.exec(commands[i], (err, stream) => {
      if (err) throw err;
      stream.on('data', d => process.stdout.write(d))
            .stderr.on('data', d => process.stderr.write(d));
      stream.on('close', () => {
        i++;
        execNext();
      });
    });
  };
  execNext();
}).connect({
  host: '189.74.97.12', port: 22, username: 'root', password: 'uF*qPp0^Qm&?hlia', readyTimeout: 99999
});
