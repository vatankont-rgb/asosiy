const fs = require('fs');
let txt = fs.readFileSync('server/app.js', 'utf8');

if (!txt.includes('languageRoutes')) {
  txt = txt.replace(
    /const translationRoutes = require\('\.\/routes\/translationRoutes'\);/,
    `const translationRoutes = require('./routes/translationRoutes');\nconst languageRoutes = require('./routes/languageRoutes');`
  );
  txt = txt.replace(
    /app\.use\('\/api', translationRoutes\);/,
    `app.use('/api', translationRoutes);\napp.use('/api', languageRoutes);`
  );
  fs.writeFileSync('server/app.js', txt);
  console.log('languageRoutes injected');
}
