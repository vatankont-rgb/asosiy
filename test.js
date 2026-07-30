const { useEffect, useMemo, useRef, useState, useCallback } = React;

const images = {
  city: "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1600&q=80')",
  parliament: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=85",
  business: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85",
  sport: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=85",
  culture: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1600&q=85",
  analysis: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=85",
  world: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
  newsroom: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
  power: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80",
  tourism: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80",
  cityPeople: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
  road: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  debate: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
  diplomacy: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=900&q=80",
  map: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80",
  studio: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80",
  photo1: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
  photo2: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
  photo3: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80",
  photo4: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
  photo5: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
  photo6: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=900&q=80",
};

const copy = {
  uz: {
    live: "Jonli lenta",
    date: new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" }),
    search: "Qidirish...",
    portal: "Yangiliklar portali",
    read: "O'qish",
    popular: "Ko'p o'qilganlar",
    newsletterTitle: "Kunlik dayjest",
    newsletterText: "Muhim xabarlar, tahlillar va maxsus maqolalarni pochtangizga oling.",
    email: "Email manzilingiz",
    subscribe: "Obuna bo'lish",
    latest: "So'nggi yangiliklar",
    latestNote: "Tahririyat tanlagan dolzarb xabarlar, qisqa sharhlar va mavzuga oid ma'lumotlar.",
    all: "Barchasi",
    special: "Maxsus loyiha",
    specialTitle: "Ma'lumotga tayangan jurnalistika: voqeani shovqindan ajratamiz",
    specialText:
      "Yangi Kun tahririyati siyosat, iqtisod, texnologiya, sport va madaniyatdagi muhim jarayonlarni ravon tilda tushuntiradi.",
    pages: ["Siyosat", "Iqtisodiyot", "Tarix", "Falsafa", "Adabiyot"],
    pageNotes: {
      "Bosh sahifa": "Asosiy xabarlar, trendlar va kunning eng muhim mavzulari.",
      Siyosat: "Davlat boshqaruvi, parlament, mahalliy kengashlar va jamoatchilik muhokamalari.",
      Iqtisod: "Bozorlar, biznes, moliya, bandlik va tadbirkorlik muhiti.",
      Texnologiya: "Startaplar, sun'iy intellekt, raqamli xizmatlar va kiberxavfsizlik.",
      Sport: "Futbol, olimpiya sportlari, turnirlar va sportchilar hikoyalari.",
      Madaniyat: "Kino, teatr, kitob, musiqa va shahar hayotidagi madaniy voqealar.",
      Aloqa: "Tahririyat bilan bog'lanish, reklama va hamkorlik uchun ma'lumotlar.",
    },
    contact: [
      ["Tahririyat", "Yangilik, press-reliz yoki foto material yuborish uchun: news@yangikun.uz"],
      ["Reklama", "Brend loyihalari, bannerlar va maxsus sahifalar: ads@yangikun.uz"],
      ["Manzil", "Toshkent shahri, matbuot markazi, 4-qavat. Dushanba-juma 09:00-18:00."],
    ],
    close: "Yopish",
  },
  ru: {
    live: "Р›РµРЅС‚Р°",
    date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
    search: "РџРѕРёСЃРє...",
    portal: "РќРѕРІРѕСЃС‚РЅРѕР№ РїРѕСЂС‚Р°Р»",
    read: "Р§РёС‚Р°С‚СЊ",
    popular: "РџРѕРїСѓР»СЏСЂРЅРѕРµ",
    newsletterTitle: "Р•Р¶РµРґРЅРµРІРЅС‹Р№ РґР°Р№РґР¶РµСЃС‚",
    newsletterText: "РџРѕР»СѓС‡Р°Р№С‚Рµ РіР»Р°РІРЅС‹Рµ РЅРѕРІРѕСЃС‚Рё, Р°РЅР°Р»РёС‚РёРєСѓ Рё СЃРїРµС†РёР°Р»СЊРЅС‹Рµ РјР°С‚РµСЂРёР°Р»С‹ РЅР° РїРѕС‡С‚Сѓ.",
    email: "Р’Р°С€ email",
    subscribe: "РџРѕРґРїРёСЃР°С‚СЊСЃСЏ",
    latest: "РџРѕСЃР»РµРґРЅРёРµ РЅРѕРІРѕСЃС‚Рё",
    latestNote: "РђРєС‚СѓР°Р»СЊРЅС‹Рµ СЃРѕРѕР±С‰РµРЅРёСЏ, РєРѕСЂРѕС‚РєРёРµ СЂР°Р·Р±РѕСЂС‹ Рё РєРѕРЅС‚РµРєСЃС‚ РѕС‚ СЂРµРґР°РєС†РёРё.",
    all: "Р’СЃРµ",
    special: "РЎРїРµС†РїСЂРѕРµРєС‚",
    specialTitle: "Р–СѓСЂРЅР°Р»РёСЃС‚РёРєР° РЅР° РѕСЃРЅРѕРІРµ РґР°РЅРЅС‹С…: РѕС‚РґРµР»СЏРµРј СЃРѕР±С‹С‚РёСЏ РѕС‚ С€СѓРјР°",
    specialText:
      "Р РµРґР°РєС†РёСЏ Yangi Kun РїРѕРЅСЏС‚РЅС‹Рј СЏР·С‹РєРѕРј РѕР±СЉСЏСЃРЅСЏРµС‚ РІР°Р¶РЅС‹Рµ РїСЂРѕС†РµСЃСЃС‹ РІ РїРѕР»РёС‚РёРєРµ, СЌРєРѕРЅРѕРјРёРєРµ, С‚РµС…РЅРѕР»РѕРіРёСЏС…, СЃРїРѕСЂС‚Рµ Рё РєСѓР»СЊС‚СѓСЂРµ.",
    pages: ["Р“Р»Р°РІРЅР°СЏ", "РџРѕР»РёС‚РёРєР°", "Р­РєРѕРЅРѕРјРёРєР°", "РСЃС‚РѕСЂРёСЏ", "Р¤РёР»РѕСЃРѕС„РёСЏ", "Р›РёС‚РµСЂР°С‚СѓСЂР°"],
    pageNotes: {
      "Р“Р»Р°РІРЅР°СЏ": "Р“Р»Р°РІРЅС‹Рµ РјР°С‚РµСЂРёР°Р»С‹, С‚СЂРµРЅРґС‹ Рё РєР»СЋС‡РµРІС‹Рµ С‚РµРјС‹ РґРЅСЏ.",
      "РџРѕР»РёС‚РёРєР°": "Р“РѕСЃСѓРїСЂР°РІР»РµРЅРёРµ, РїР°СЂР»Р°РјРµРЅС‚, РјРµСЃС‚РЅС‹Рµ СЃРѕРІРµС‚С‹ Рё РѕР±С‰РµСЃС‚РІРµРЅРЅС‹Рµ РѕР±СЃСѓР¶РґРµРЅРёСЏ.",
      "Р­РєРѕРЅРѕРјРёРєР°": "Р С‹РЅРєРё, Р±РёР·РЅРµСЃ, С„РёРЅР°РЅСЃС‹, Р·Р°РЅСЏС‚РѕСЃС‚СЊ Рё РїСЂРµРґРїСЂРёРЅРёРјР°С‚РµР»СЊСЃРєР°СЏ СЃСЂРµРґР°.",
      "РўРµС…РЅРѕР»РѕРіРёРё": "РЎС‚Р°СЂС‚Р°РїС‹, РёСЃРєСѓСЃСЃС‚РІРµРЅРЅС‹Р№ РёРЅС‚РµР»Р»РµРєС‚, С†РёС„СЂРѕРІС‹Рµ СЃРµСЂРІРёСЃС‹ Рё РєРёР±РµСЂР±РµР·РѕРїР°СЃРЅРѕСЃС‚СЊ.",
      "РЎРїРѕСЂС‚": "Р¤СѓС‚Р±РѕР», РѕР»РёРјРїРёР№СЃРєРёРµ РІРёРґС‹, С‚СѓСЂРЅРёСЂС‹ Рё РёСЃС‚РѕСЂРёРё СЃРїРѕСЂС‚СЃРјРµРЅРѕРІ.",
      "РљСѓР»СЊС‚СѓСЂР°": "РљРёРЅРѕ, С‚РµР°С‚СЂ, РєРЅРёРіРё, РјСѓР·С‹РєР° Рё РєСѓР»СЊС‚СѓСЂРЅС‹Рµ СЃРѕР±С‹С‚РёСЏ РіРѕСЂРѕРґСЃРєРѕР№ Р¶РёР·РЅРё.",
      "РљРѕРЅС‚Р°РєС‚С‹": "РЎРІСЏР·СЊ СЃ СЂРµРґР°РєС†РёРµР№, СЂРµРєР»Р°РјР° Рё РїР°СЂС‚РЅС‘СЂСЃРєРёРµ РїСЂРѕРµРєС‚С‹.",
    },
    contact: [
      ["Р РµРґР°РєС†РёСЏ", "РќРѕРІРѕСЃС‚Рё, РїСЂРµСЃСЃ-СЂРµР»РёР·С‹ Рё С„РѕС‚РѕРјР°С‚РµСЂРёР°Р»С‹: news@yangikun.uz"],
      ["Р РµРєР»Р°РјР°", "Р‘СЂРµРЅРґ-РїСЂРѕРµРєС‚С‹, Р±Р°РЅРЅРµСЂС‹ Рё СЃРїРµС†РёР°Р»СЊРЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹: ads@yangikun.uz"],
      ["РђРґСЂРµСЃ", "РўР°С€РєРµРЅС‚, РјРµРґРёР°С†РµРЅС‚СЂ, 4 СЌС‚Р°Р¶. РџРѕРЅРµРґРµР»СЊРЅРёРє-РїСЏС‚РЅРёС†Р° 09:00-18:00."],
    ],
    close: "Р—Р°РєСЂС‹С‚СЊ",
  },
};

copy["uzk"] = {
  live: "\u0416\u043e\u043d\u043b\u0438 \u043b\u0435\u043d\u0442\u0430",
  date: new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" }),
  search: "\u049a\u0438\u0434\u0438\u0440\u0438\u0448...",
  portal: "\u042f\u043d\u0433\u0438\u043b\u0438\u043a\u043b\u0430\u0440 \u043f\u043e\u0440\u0442\u0430\u043b\u0438",
  read: "\u040e\u049b\u0438\u0448",
  popular: "\u041a\u045e\u043f \u045e\u049b\u0438\u043b\u0433\u0430\u043d\u043b\u0430\u0440",
  newsletterTitle: "\u041a\u0443\u043d\u043b\u0438\u043a \u0434\u0430\u0439\u0436\u0435\u0441\u0442",
  newsletterText: "\u041c\u0443\u04b3\u0438\u043c \u0445\u0430\u0431\u0430\u0440\u043b\u0430\u0440, \u0442\u0430\u04b3\u043b\u0438\u043b\u043b\u0430\u0440 \u0432\u0430 \u043c\u0430\u0445\u0441\u0443\u0441 \u043c\u0430\u049b\u043e\u043b\u0430\u043b\u0430\u0440\u043d\u0438 \u043f\u043e\u0448\u0442\u0430\u043d\u0433\u0438\u0437\u0433\u0430 \u043e\u043b\u0438\u043d\u0433.",
  email: "Email \u043c\u0430\u043d\u0437\u0438\u043b\u0438\u043d\u0433\u0438\u0437",
  subscribe: "\u041e\u0431\u0443\u043d\u0430 \u0431\u045e\u043b\u0438\u0448",
  latest: "\u0421\u045e\u043d\u0433\u0433\u0438 \u044f\u043d\u0433\u0438\u043b\u0438\u043a\u043b\u0430\u0440",
  latestNote: "\u0422\u0430\u04b3\u0440\u0438\u0440\u0438\u044f\u0442 \u0442\u0430\u043d\u043b\u0430\u0433\u0430\u043d \u0434\u043e\u043b\u0437\u0430\u0440\u0431 \u0445\u0430\u0431\u0430\u0440\u043b\u0430\u0440, \u049b\u0438\u0441\u049b\u0430 \u0448\u0430\u0440\u04b3\u043b\u0430\u0440 \u0432\u0430 \u043c\u0430\u0432\u0437\u0443\u0433\u0430 \u043e\u0438\u0434 \u043c\u0430\u044a\u043b\u0443\u043c\u043e\u0442\u043b\u0430\u0440.",
  all: "\u0411\u0430\u0440\u0447\u0430\u0441\u0438",
  special: "\u041c\u0430\u0445\u0441\u0443\u0441 \u043b\u043e\u0439\u0438\u04b3\u0430",
  specialTitle: "\u041c\u0430\u044a\u043b\u0443\u043c\u043e\u0442\u0433\u0430 \u0442\u0430\u044f\u043d\u0433\u0430\u043d \u0436\u0443\u0440\u043d\u0430\u043b\u0438\u0441\u0442\u0438\u043a\u0430",
  specialText: "\u042f\u043d\u0433\u0438 \u041a\u0443\u043d \u0442\u0430\u04b3\u0440\u0438\u0440\u0438\u044f\u0442\u0438 \u0441\u0438\u0451\u0441\u0430\u0442, \u0438\u049b\u0442\u0438\u0441\u043e\u0434, \u0442\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u044f, \u0441\u043f\u043e\u0440\u0442 \u0432\u0430 \u043c\u0430\u0434\u0430\u043d\u0438\u044f\u0442\u0434\u0430\u0433\u0438 \u043c\u0443\u04b3\u0438\u043c \u0436\u0430\u0440\u0430\u0451\u043d\u043b\u0430\u0440\u043d\u0438 \u0440\u0430\u0432\u043e\u043d \u0442\u0438\u043b\u0434\u0430 \u0442\u0443\u0448\u0443\u043d\u0442\u0438\u0440\u0430\u0434\u0438.",
  pages: ["Bosh sahifa", "Siyosat", "Iqtisodiyot", "Tarix", "Falsafa", "Adabiyot"],
  pageNotes: {
    "\u0411\u043e\u0448 \u0441\u0430\u04b3\u0438\u0444\u0430": "\u0410\u0441\u043e\u0441\u0438\u0439 \u0445\u0430\u0431\u0430\u0440\u043b\u0430\u0440, \u0442\u0440\u0435\u043d\u0434\u043b\u0430\u0440 \u0432\u0430 \u043a\u0443\u043d\u043d\u0438\u043d\u0433 \u044d\u043d\u0433 \u043c\u0443\u04b3\u0438\u043c \u043c\u0430\u0432\u0437\u0443\u043b\u0430\u0440\u0438.",
    "\u0421\u0438\u0451\u0441\u0430\u0442": "\u0414\u0430\u0432\u043b\u0430\u0442 \u0431\u043e\u0448\u049b\u0430\u0440\u0443\u0432\u0438, \u043f\u0430\u0440\u043b\u0430\u043c\u0435\u043d\u0442, \u043c\u0430\u04b3\u0430\u043b\u043b\u0438\u0439 \u043a\u0435\u043d\u0433\u0430\u0448\u043b\u0430\u0440 \u0432\u0430 \u0436\u0430\u043c\u043e\u0430\u0442\u0447\u0438\u043b\u0438\u043a \u043c\u0443\u04b3\u043e\u043a\u0430\u043c\u0430\u043b\u0430\u0440\u0438.",
    "РўР°СЂРёС…": "РЋС‚РјРёС€ СЃР°ТіРёС„Р°Р»Р°СЂРё, С‚Р°СЂРёС…РёР№ РІРѕТ›РµР°Р»Р°СЂ РІР° С€Р°С…СЃР»Р°СЂ.",
    "Р¤Р°Р»СЃР°С„Р°": "Р¤Р°Р»СЃР°С„РёР№ Т›Р°СЂР°С€Р»Р°СЂ, РјСѓС‚Р°С„Р°РєРєРёСЂР»Р°СЂ РІР° РґСѓРЅС‘Т›Р°СЂР°С€.",
    "РђРґР°Р±РёС‘С‚": "РЁРµСЉСЂРёСЏС‚, РЅР°СЃСЂ, РєРёС‚РѕР±С…РѕРЅР»РёРє РІР° Р°РґР°Р±РёР№ С‚Р°РЅТ›РёРґ.",
  },
  contact: [
    ["\u0422\u0430\u04b3\u0440\u0438\u0440\u0438\u044f\u0442", "\u042f\u043d\u0433\u0438\u043b\u0438\u043a, \u043f\u0440\u0435\u0441\u0441-\u0440\u0435\u043b\u0438\u0437 \u0451\u043a\u0438 \u0444\u043e\u0442\u043e \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b \u044e\u0431\u043e\u0440\u0438\u0448 \u0443\u0447\u0443\u043d: news@yangikun.uz"],
    ["\u0420\u0435\u043a\u043b\u0430\u043c\u0430", "\u0411\u0440\u0435\u043d\u0434 \u043b\u043e\u0439\u0438\u04b3\u0430\u043b\u0430\u0440\u0438, \u0431\u0430\u043d\u043d\u0435\u0440\u043b\u0430\u0440 \u0432\u0430 \u043c\u0430\u0445\u0441\u0443\u0441 \u0441\u0430\u04b3\u0438\u0444\u0430\u043b\u0430\u0440: ads@yangikun.uz"],
    ["\u041c\u0430\u043d\u0437\u0438\u043b", "\u0422\u043e\u0448\u043a\u0435\u043d\u0442 \u0448\u0430\u04b3\u0440\u0438, \u043c\u0430\u0442\u0431\u0443\u043e\u0442 \u043c\u0430\u0440\u043a\u0430\u0437\u0438, 4-\u049b\u0430\u0432\u0430\u0442. \u0414\u0443\u0448\u0430\u043d\u0431\u0430-\u0436\u0443\u043c\u0430 09:00-18:00."],
  ],
  close: "\u0401\u043f\u0438\u0448",
};

const categoryMap = {
  uz: {
    "Bosh sahifa": null,
    "Siyosat": "Siyosat",
    "Iqtisod": "Iqtisod",
    "Texnologiya": "Texnologiya",
    "Sport": "Sport",
    "Madaniyat": "Madaniyat",
    "Aloqa": "Aloqa"
  },
  ru: {
    "Главная": null,
    "Политика": "Siyosat",
    "Экономика": "Iqtisod",
    "Технологии": "Texnologiya",
    "Спорт": "Sport",
    "Культура": "Madaniyat",
    "Контакты": "Aloqa"
  }
};
categoryMap["uzk"] = {
  "Бош саҳифа": null,
  "Сиёсат": "Siyosat",
  "Иқтисод": "Iqtisod",
  "Технология": "Texnologiya",
  "Спорт": "Sport",
  "Маданият": "Madaniyat",
  "Алоқа": "Aloqa"
};

const storyData = {
  uz: [
    {
      category: "Siyosat",
      title: "Hududlarda ochiq budjet muhokamalari yangi tartibda o'tkaziladi",
      summary: "Mahalliy kengashlar fuqarolar takliflarini ko'rib chiqish uchun raqamli jadval e'lon qiladi.",
      image: images.newsroom,
      author: "Ali Valiyev",
      time: "Bugun, 10:30",
      read: "3 daqiqa",
      body: "Maqola matni...",
      status: "published",
      tags: "byudjet, islohot",
      views: 120,
    },
    {
      category: "Iqtisod",
      title: "Kichik biznes uchun eksport maslahat markazlari ishga tushmoqda",
      summary: "Yangi xizmat mahsulot sertifikati, logistika va xorijiy bozor talablari bo'yicha yordam beradi.",
      image: images.newsroom,
      author: "Nodir Rahimov",
      time: "Kecha, 15:45",
      read: "5 daqiqa",
      body: "Iqtisodiy tahlil...",
      status: "published",
      tags: "biznes, eksport",
      views: 340,
    }
  ],
  ru: [
    {
      category: "Политика",
      title: "Новый порядок обсуждения открытого бюджета в регионах",
      summary: "Местные советы опубликуют цифровой график рассмотрения предложений граждан.",
      image: images.newsroom,
      author: "Али Валиев",
      time: "Сегодня, 10:30",
      read: "3 минуты",
      body: "Текст статьи...",
      status: "published",
      tags: "бюджет, реформа",
      views: 120,
    }
  ]
};

const mediaItems = {
  uz: [
    { type: "video", title: "Yangi loyiha taqdimoti", meta: "Video | 10:00", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { type: "photo", title: "Fotogalereya: Shahar ko'chalari", meta: "Foto | Kecha", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { type: "video", title: "Intervyu: Yosh tadbirkorlar", meta: "Video | 2 kun oldin", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { type: "video", title: "Tahliliy ko'rsatuv", meta: "Video | 1 hafta oldin", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
  ],
  ru: [
    { type: "video", title: "Презентация нового проекта", meta: "Видео | 10:00", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { type: "photo", title: "Фотогалерея: Улицы города", meta: "Фото | Вчера", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { type: "video", title: "Интервью: Молодые предприниматели", meta: "Видео | 2 дня назад", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { type: "video", title: "Аналитическая программа", meta: "Видео | Неделю назад", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
  ]
};

const DEFAULT_PASSWORD = "admin2026";
const emptyStory = {
  category: "Siyosat",
  title: "",
  summary: "",
  image: images.newsroom,
  author: "",
  time: "Hozir",
  read: "3 daqiqa",
  body: "",
  status: "published",
  tags: "",
  metaTitle: "",
  metaDesc: "",
  views: 0,
  isHero: false,
  isEditorPick: false,
  isBreaking: false,
  countViews: true,
  publishAt: "", // Rejalashtirish sanasi (YYYY-MM-DDTHH:mm)
};

const DEFAULT_SITE_CONFIG = {
  siteName: "Yangi Kun",
  logoUrl: "",
  email: "news@yangikun.uz",
  telegram: "https://t.me/yangikun",
  bannerText: "",
  bannerActive: false,
  specialUz: {
    kicker: "Maxsus loyiha",
    title: "Ma'lumotga tayangan jurnalistika: voqeani shovqindan ajratamiz",
    text: "Yangi Kun tahririyati siyosat, iqtisod, texnologiya, sport va madaniyatdagi muhim jarayonlarni ravon tilda tushuntiradi.",
    badge: "Jonli tahririyat",
    image: "",
    features: "Tezkor yangiliklar, Mustaqil tahlil, Ikki tilda, Ishonchli manba",
    stat1: "24/7", stat1label: "Monitoring",
    stat2: "7",    stat2label: "Bo'lim",
    stat3: "2",    stat3label: "Til",
    stat4: "100+", stat4label: "Maqola",
  },
  specialRu: {
    kicker: "РЎРїРµС†РїСЂРѕРµРєС‚",
    title: "Р–СѓСЂРЅР°Р»РёСЃС‚РёРєР° РЅР° РѕСЃРЅРѕРІРµ РґР°РЅРЅС‹С…: РѕС‚РґРµР»СЏРµРј СЃРѕР±С‹С‚РёСЏ РѕС‚ С€СѓРјР°",
    text: "Р РµРґР°РєС†РёСЏ Yangi Kun РїРѕРЅСЏС‚РЅС‹Рј СЏР·С‹РєРѕРј РѕР±СЉСЏСЃРЅСЏРµС‚ РІР°Р¶РЅС‹Рµ РїСЂРѕС†РµСЃСЃС‹ РІ РїРѕР»РёС‚РёРєРµ, СЌРєРѕРЅРѕРјРёРєРµ, С‚РµС…РЅРѕР»РѕРіРёСЏС…, СЃРїРѕСЂС‚Рµ Рё РєСѓР»СЊС‚СѓСЂРµ.",
    badge: "Р–РёРІР°СЏ СЂРµРґР°РєС†РёСЏ",
    image: "",
    features: "Р‘С‹СЃС‚СЂС‹Рµ РЅРѕРІРѕСЃС‚Рё, РќРµР·Р°РІРёСЃРёРјС‹Р№ Р°РЅР°Р»РёР·, РќР° РґРІСѓС… СЏР·С‹РєР°С…, РќР°РґС‘Р¶РЅС‹Р№ РёСЃС‚РѕС‡РЅРёРє",
    stat1: "24/7", stat1label: "РњРѕРЅРёС‚РѕСЂРёРЅРі",
    stat2: "7",    stat2label: "Р Р°Р·РґРµР»РѕРІ",
    stat3: "2",    stat3label: "РЇР·С‹РєР°",
    stat4: "100+", stat4label: "РЎС‚Р°С‚РµР№",
  },
  ads: [],
};
const fallbackStory = {
  ...emptyStory,
  id: "fallback-story",
  title: "Yangi maqola qo'shing",
  summary: "Admin panel orqali birinchi yangilikni joylashtiring.",
  author: "Yangi Kun",
  body: "Bu vaqtinchalik matn. Admin paneldan maqola qo'shilganda sayt lentasi yangilanadi.",
};

function makeId() {
  return `story-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const isComposing = useRef(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, []);

  function exec(cmd, val = null) {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    syncContent();
  }

  function syncContent() {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      exec("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  }

  async function uploadAndInsert(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataUrl: reader.result }),
          });
          const data = await res.json();
          if (data.url) {
            editorRef.current.focus();
            document.execCommand("insertImage", false, data.url);
            syncContent();
          }
        } catch {}
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { setUploading(false); }
  }

  function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        uploadAndInsert(item.getAsFile());
        return;
      }
    }
  }

  function handleDrop(e) {
    const file = e.dataTransfer?.files?.[0];
    if (file?.type.startsWith("image/")) {
      e.preventDefault();
      uploadAndInsert(file);
    }
  }
