const fs = require('fs');

let app = fs.readFileSync('app.jsx', 'utf8');

app = app.replace('<WeatherBar lang={lang} />\n      <header className="header">', '{page !== "admin" && (<>\n      <WeatherBar lang={lang} />\n      <header className="header">');

app = app.replace('</div>\n      </div>\n      {serverMessage', '</div>\n      </div>\n      </>)}\n      {serverMessage');

app = app.replace('<Footer t={t} pages={staticPages', '{page !== "admin" && (<>\n      <Footer t={t} pages={staticPages');

app = app.replace('</button>\n      </nav>\n    </div>', '</button>\n      </nav>\n      </>)}\n    </div>');

fs.writeFileSync('app.jsx', app);
console.log('Done!');
