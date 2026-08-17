const { Client } = require('ssh2');
const conn = new Client();

console.log('----------------------------------------------------');
console.log('🚀 Sayt serverda yangilanmoqda. Iltimos, kuting...');
console.log('----------------------------------------------------');

const commands = [
  'cd /var/www/vatanuz && git fetch origin && git reset --hard origin/main && git clean -fd',
  'cd /var/www/vatanuz && npm install',
  'pm2 restart vatanuz'
];

conn.on('ready', () => {
  let i = 0;
  const execNext = () => {
    if (i >= commands.length) {
      console.log('----------------------------------------------------');
      console.log('✅ TABRIKLAYMIZ! Saytingiz muvaffaqiyatli yangilandi!');
      console.log("Endi brauzerdan kirib tekshirib ko'rishingiz mumkin.");
      console.log('----------------------------------------------------');
      conn.end();
      setTimeout(() => process.exit(0), 3000);
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
