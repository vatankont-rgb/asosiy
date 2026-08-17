const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('pm2 logs vatanuz --lines 50 --nostream', (err, stream) => {
    stream.on('data', (d) => process.stdout.write(d)).stderr.on('data', (d) => process.stderr.write(d));
    stream.on('close', () => conn.end());
  });
}).connect({
  host: '189.74.97.12', port: 22, username: 'root', password: 'uF*qPp0^Qm&?hlia', readyTimeout: 99999
});
