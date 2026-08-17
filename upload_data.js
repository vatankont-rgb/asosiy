const { Client } = require('ssh2');
const fs = require('fs');
const conn = new Client();

conn.on('ready', () => {
  console.log('SSH :: ulandi');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Fayl yuklanmoqda...');
    sftp.fastPut('data.tar.gz', '/var/www/vatanuz/data.tar.gz', (err) => {
      if (err) throw err;
      console.log('Yuklandi! Endi arxivdan chiqarilmoqda...');
      conn.exec('cd /var/www/vatanuz && tar -xzvf data.tar.gz && mkdir -p server/logs && pm2 restart vatanuz', (err, stream) => {
        if (err) throw err;
        stream.on('data', (d) => process.stdout.write(d)).stderr.on('data', (d) => process.stderr.write(d));
        stream.on('close', () => {
          console.log('Barcha jarayonlar tugadi!');
          conn.end();
        });
      });
    });
  });
}).connect({
  host: '189.74.97.12', port: 22, username: 'root', password: 'uF*qPp0^Qm&?hlia', readyTimeout: 99999
});
