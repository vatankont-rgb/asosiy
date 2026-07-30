const fs = require('fs');

const a = './server/storage/articles.json';
if (fs.existsSync(a)) {
  const d = JSON.parse(fs.readFileSync(a, 'utf8'));
  if (d.en && d.en.length >= 6) {
    const translations = [
      {
        category: 'Politics',
        title: 'Open budget discussions in regions will be held under new rules',
        summary: 'Local councils will publish a digital schedule for reviewing citizens\' proposals.',
        author: 'Dilnoza Karimova',
        time: 'Today',
        read: '4 minutes',
        body: 'Local councils will publish a digital schedule for reviewing citizens\' proposals. The editorial team will continue to monitor this topic and update the material as new details emerge.'
      },
      {
        category: 'Economy',
        title: 'Export consulting centers launched for small businesses',
        summary: 'The new service will assist with product certification, logistics, and foreign market requirements.',
        author: 'Akmal Saidov',
        time: 'Today',
        read: '4 minutes',
        body: 'The new service will assist with product certification, logistics, and foreign market requirements. The editorial team will continue to monitor this topic and update the material as new details emerge.'
      },
      {
        category: 'Technology',
        title: 'Local AI assistant tested in university laboratory',
        summary: 'The project focuses on Q&A in Uzbek, document analysis, and adapting to the educational process.',
        author: 'Shahlo Nazarova',
        time: 'Today',
        read: '4 minutes',
        body: 'The project focuses on Q&A in Uzbek, document analysis, and adapting to the educational process. The editorial team will continue to monitor this topic and update the material as new details emerge.'
      },
      {
        category: 'Sport',
        title: 'Spring stage of the national championship begins with unexpected results',
        summary: 'Young players are entering the starting lineup more frequently, and coaches are increasing rotation.',
        author: 'Jasur Tursunov',
        time: 'Today',
        read: '4 minutes',
        body: 'Young players are entering the starting lineup more frequently, and coaches are increasing rotation. The editorial team will continue to monitor this topic and update the material as new details emerge.'
      },
      {
        category: 'Culture',
        title: 'Week of young directors opens in city theaters',
        summary: 'The program includes experimental stage works, open discussions, and master classes.',
        author: 'Malika Qodirova',
        time: 'Today',
        read: '4 minutes',
        body: 'The program includes experimental stage works, open discussions, and master classes. The editorial team will continue to monitor this topic and update the material as new details emerge.'
      },
      {
        category: 'Analysis',
        title: 'Why digital payments are rapidly gaining popularity in city transport',
        summary: 'Experts explain the connection between convenience, monitoring, and tariff policy.',
        author: 'Zafar Jo\'rayev',
        time: 'Today',
        read: '4 minutes',
        body: 'Experts explain the connection between convenience, monitoring, and tariff policy. The editorial team will continue to monitor this topic and update the material as new details emerge.'
      }
    ];
    
    for (let i = 0; i < 6; i++) {
      if (d.en[i]) {
        Object.assign(d.en[i], translations[i]);
      }
    }
    fs.writeFileSync(a, JSON.stringify(d, null, 2));
    console.log('articles.json updated');
  }
}
