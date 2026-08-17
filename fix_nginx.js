const { Client } = require('ssh2');
const conn = new Client();

const commands = [
  'sed -i "s|alias /var/www/vatanuz/uploads/;|alias /var/www/vatanuz/server/uploads/;|g" /etc/nginx/sites-available/vatanuz',
  'nginx -s reload'
];

conn.on('ready', () => {
  console.log('SSH ulandi. Nginx sozlanmoqda...');
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
