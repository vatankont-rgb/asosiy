const { Client } = require('ssh2');
const conn = new Client();

conn.on('ready', () => {
  console.log('SSH ulandi.');
  conn.exec('cd /var/www/vatanuz && pm2 stop vatanuz && node server.js', (err, stream) => {
    if (err) throw err;
    let output = '';
    stream.on('data', d => {
      output += d.toString();
      process.stdout.write(d);
      if (output.includes('ishga tushdi') || output.includes('listening')) {
        console.log('Node started successfully!');
        conn.end();
      }
    }).stderr.on('data', d => {
      process.stderr.write(d);
    });
    setTimeout(() => conn.end(), 10000);
  });
}).connect({
  host: '189.74.97.12', port: 22, username: 'root', password: 'uF*qPp0^Qm&?hlia', readyTimeout: 99999
});
