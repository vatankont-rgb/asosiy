const { Client } = require('ssh2');

const conn = new Client();

const commands = [
  'apt-get update',
  'apt-get install -y nodejs npm nginx git curl',
  'npm install -g pm2',
  'if [ ! -f ~/.ssh/id_rsa ]; then ssh-keygen -t rsa -b 4096 -N "" -f ~/.ssh/id_rsa; fi',
  'cat ~/.ssh/id_rsa.pub'
];

conn.on('ready', () => {
  console.log('SSH :: ulandi');
  let cmdIndex = 0;

  function runNext() {
    if (cmdIndex >= commands.length) {
      console.log('Barcha buyruqlar bajarildi!');
      conn.end();
      return;
    }

    const cmd = commands[cmdIndex];
    console.log(`Bajarilmoqda: ${cmd}`);
    
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      
      let output = '';
      
      stream.on('close', (code, signal) => {
        console.log(`Tugadi (Kodi: ${code})`);
        
        // Agar kalitni o'qiyotgan bo'lsak, uni ajratib ko'rsatamiz
        if (cmd.includes('cat ~/.ssh/id_rsa.pub')) {
            console.log('\n================ NUXSHA OLISH UCHUN KALIT ================');
            console.log(output.trim());
            console.log('==========================================================\n');
        }
        
        cmdIndex++;
        runNext();
      }).on('data', (data) => {
        output += data.toString();
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
