const { Client } = require('ssh2');
const conn = new Client();

const commands = [
  'curl -fsSL https://deb.nodesource.com/setup_22.x | bash -',
  'apt-get install -y nodejs',
  'cd /var/www/vatanuz && rm -rf node_modules package-lock.json && npm install',
  'pm2 restart vatanuz'
];

conn.on('ready', () => {
  console.log('SSH ulandi. Node.js yangilanmoqda...');
  let i = 0;
  const execNext = () => {
    if (i >= commands.length) {
      console.log('Barcha buyruqlar bajarildi!');
      conn.end();
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
