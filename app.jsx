const { useEffect, useMemo, useRef, useState, useCallback } = React;

const getVideoThumb = (url) => {
  if (!url) return "";
  if (url.includes("youtube.com/watch?v=")) return `https://img.youtube.com/vi/${url.split("v=")[1].split("&")[0]}/0.jpg`;
  if (url.includes("youtu.be/")) return `https://img.youtube.com/vi/${url.split("youtu.be/")[1].split("?")[0]}/0.jpg`;
  if (url.includes("youtube.com/embed/")) return `https://img.youtube.com/vi/${url.split("embed/")[1].split("?")[0]}/0.jpg`;
  return url;
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
};

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
  photo3:"☁️",
  photo4: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
  photo5: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
  photo6: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=900&q=80",
};

const copy = {
  uz: {
    home: "Bosh sahifa",
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
      "Vatanuz.uz tahririyati siyosat, iqtisod, texnologiya, sport va madaniyatdagi muhim jarayonlarni ravon tilda tushuntiradi.",
    pages: ["Bosh sahifa", "Siyosat", "Iqtisodiyot", "Tarix", "Falsafa", "Adabiyot"],
    pageNotes: {
      "Bosh sahifa": "Asosiy xabarlar, trendlar va kunning eng muhim mavzulari.",
      Siyosat: "Davlat boshqaruvi, parlament, mahalliy kengashlar va jamoatchilik muhokamalari.",
      Iqtisodiyot: "Bozorlar, biznes, moliya, bandlik va tadbirkorlik muhiti.",
      Tarix: "O'tmish sahifalari, tarixiy voqealar va shaxslar.",
      Falsafa: "Falsafiy qarashlar, mutafakkirlar va dunyoqarash.",
      Adabiyot: "She'riyat, nasr, kitobxonlik va adabiy tanqid.",
      Videolar: "Kunning eng muhim videolari, suhbatlar va tahlillar.",
      Aloqa: "Tahririyat bilan bog'lanish, reklama va hamkorlik uchun ma'lumotlar.",
    },
    contact: [
      ["Tahririyat", "Yangilik, press-reliz yoki foto material yuborish uchun: "],
      ["Reklama", "Brend loyihalari, bannerlar va maxsus sahifalar: vatankont@gmail.com"],
      ["Manzil", "Toshkent shahri, matbuot markazi, 4-qavat. Dushanba-juma 09:00-18:00."],
    ],
    close: "Yopish",
  },
  en: {
    home: "Home",
    live: "Live feed",
    date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
    search: "Search...",
    portal: "News Portal",
    read: "Read",
    popular: "Popular",
    newsletterTitle: "Daily Digest",
    newsletterText: "Get top news, analytics, and special materials delivered to your inbox.",
    email: "Your email",
    subscribe: "Subscribe",
    latest: "Latest News",
    latestNote: "Timely updates, short breakdowns, and context from the editorial team.",
    all: "All",
    special: "Special Project",
    specialTitle: "Data-driven journalism: separating events from noise",
    specialText:
      "Vatanuz.uz editorial team explains important processes in politics, economy, technology, sports, and culture in plain language.",
    pages: ["Home", "Politics", "Economy", "Technology", "Sports", "Culture", "Contacts"],
    pageNotes: {
      "Home": "Top materials, trends, and key topics of the day.",
      "Politics": "Public administration, parliament, local councils, and public discussions.",
      "Economy": "Markets, business, finance, employment, and the entrepreneurial environment.",
      "Technology": "Startups, artificial intelligence, digital services, and cybersecurity.",
      "Sports": "Football, Olympic sports, tournaments, and stories of athletes.",
      "Culture": "Cinema, theater, books, music, and cultural events of city life.",
      "Contacts": "Contact the editorial team, advertising, and partnership projects.",
    },
    contact: [
      ["Editorial", "News, press releases, and photo materials: vatankont@gmail.com"],
      ["Advertising", "Brand projects, banners, and special pages: vatankont@gmail.com"],
      ["Address", "Tashkent, Media Center, 4th floor. Monday-Friday 09:00-18:00."],
    ],
    close: "Close",
  },
};

copy["uzk"] = {
  home: "Бош саҳифа",
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
  pages: ["Бош саҳифа", "Сиёсат", "Иқтисодиёт", "Тарих", "Фалсафа", "Адабиёт"],
  pageNotes: {
    "\u0411\u043e\u0448 \u0441\u0430\u04b3\u0438\u0444\u0430": "\u0410\u0441\u043e\u0441\u0438\u0439 \u0445\u0430\u0431\u0430\u0440\u043b\u0430\u0440, \u0442\u0440\u0435\u043d\u0434\u043b\u0430\u0440 \u0432\u0430 \u043a\u0443\u043d\u043d\u0438\u043d\u0433 \u044d\u043d\u0433 \u043c\u0443\u04b3\u0438\u043c \u043c\u0430\u0432\u0437\u0443\u043b\u0430\u0440\u0438.",
    "\u0421\u0438\u0451\u0441\u0430\u0442": "\u0414\u0430\u0432\u043b\u0430\u0442 \u0431\u043e\u0448\u049b\u0430\u0440\u0443\u0432\u0438, \u043f\u0430\u0440\u043b\u0430\u043c\u0435\u043d\u0442, \u043c\u0430\u04b3\u0430\u043b\u043b\u0438\u0439 \u043a\u0435\u043d\u0433\u0430\u0448\u043b\u0430\u0440 \u0432\u0430 \u0436\u0430\u043c\u043e\u0430\u0442\u0447\u0438\u043b\u0438\u043a \u043c\u0443\u04b3\u043e\u043a\u0430\u043c\u0430\u043b\u0430\u0440\u0438.",
    "Тарих": "Ўтмиш саҳифалари, тарихий воқеалар ва шахслар.",
    "Фалсафа": "Фалсафий қарашлар, мутафаккирлар ва дунёқараш.",
    "Адабиёт": "Шеърият, наср, китобхонлик ва адабий танқид.",
  },
  contact: [
    ["\u0422\u0430\u04b3\u0440\u0438\u0440\u0438\u044f\u0442", "\u042f\u043d\u0433\u0438\u043b\u0438\u043a, \u043f\u0440\u0435\u0441\u0441-\u0440\u0435\u043b\u0438\u0437 \u0451\u043a\u0438 \u0444\u043e\u0442\u043e \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b \u044e\u0431\u043e\u0440\u0438\u0448 \u0443\u0447\u0443\u043d: vatankont@gmail.com"],
    ["\u0420\u0435\u043a\u043b\u0430\u043c\u0430", "\u0411\u0440\u0435\u043d\u0434 \u043b\u043e\u0439\u0438\u04b3\u0430\u043b\u0430\u0440\u0438, \u0431\u0430\u043d\u043d\u0435\u0440\u043b\u0430\u0440 \u0432\u0430 \u043c\u0430\u0445\u0441\u0443\u0441 \u0441\u0430\u04b3\u0438\u0444\u0430\u043b\u0430\u0440: vatankont@gmail.com"],
    ["\u041c\u0430\u043d\u0437\u0438\u043b", "\u0422\u043e\u0448\u043a\u0435\u043d\u0442 \u0448\u0430\u04b3\u0440\u0438, \u043c\u0430\u0442\u0431\u0443\u043e\u0442 \u043c\u0430\u0440\u043a\u0430\u0437\u0438, 4-\u049b\u0430\u0432\u0430\u0442. \u0414\u0443\u0448\u0430\u043d\u0431\u0430-\u0436\u0443\u043c\u0430 09:00-18:00."],
  ],
  close: "\u0401\u043f\u0438\u0448",
};

const storyData = { uz: [], uzk: [], en: [] };

const mediaItems = { uz: [], uzk: [], en: [] };


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
  siteName: "Vatanuz.uz",
  logoUrl: "",
  email: "vatankont@gmail.com",
  telegram: "https://t.me/vatanuz",
  bannerText: "",
  bannerActive: false,
  specialUz: {
    kicker: "Maxsus loyiha",
    title: "Ma'lumotga tayangan jurnalistika: voqeani shovqindan ajratamiz",
    text: "Vatanuz.uz tahririyati siyosat, iqtisod, texnologiya, sport va madaniyatdagi muhim jarayonlarni ravon tilda tushuntiradi.",
    badge: "Jonli tahririyat",
    image: "",
    features: "Tezkor yangiliklar, Mustaqil tahlil, Ikki tilda, Ishonchli manba",
    stat1: "24/7", stat1label: "Monitoring",
    stat2: "7",    stat2label: "Bo'lim",
    stat3: "2",    stat3label: "Til",
    stat4: "100+", stat4label: "Maqola",
  },
  specialEn: {
    kicker: "Special Project",
    title: "Data journalism: separating events from noise",
    text: "Vatanuz.uz explains important processes in politics, economics, technology, sports and culture in clear language.",
    badge: "Live Newsroom",
    image: "",
    features: "Fast news, Independent analysis, Bilingual, Reliable source",
    stat1: "24/7", stat1label: "Monitoring",
    stat2: "7",    stat2label: "Sections",
    stat3: "2",    stat3label: "Languages",
    stat4: "100+", stat4label: "Articles",
  },
  ads: [],
};
const fallbackStory = {
  ...emptyStory,
  id: "fallback-story",
  title: "Yangi maqola qo'shing",
  summary: "Admin panel orqali birinchi yangilikni joylashtiring.",
  author: "Vatanuz.uz",
  body: "Bu vaqtinchalik matn. Admin paneldan maqola qo'shilganda sayt lentasi yangilanadi.",
};

function makeId() {
  return `story-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const isComposing = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

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
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) return alert("Faqat rasm yoki PDF yuklash mumkin");
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            credentials: "same-origin",
            headers: { 
              "Content-Type": "application/json",
              'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
            },
            body: JSON.stringify({ dataUrl: reader.result }),
          });
          const data = await res.json();
          if (data.url) {
            editorRef.current.focus();
            if (isImage) {
              document.execCommand("insertImage", false, data.url);
            } else if (isPdf) {
              const linkHtml = `<a href="${data.url}" target="_blank" style="color:var(--brand); text-decoration:underline;">📄 ${file.name} (PDF)</a>&nbsp;`;
              document.execCommand("insertHTML", false, linkHtml);
            }
            syncContent();
          }
        } catch(e){}
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch(e){ setUploading(false); }
  }

  function handlePaste(e) {
    const items = (e.clipboardData && e.clipboardData.items);
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
    const file = (e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files[0] : null);
    if ((file && file.type).startsWith("image/")) {
      e.preventDefault();
      uploadAndInsert(file);
    }
  }

  const AlignLeftIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
    </svg>
  );
  const AlignCenterIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  );
  const AlignRightIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
    </svg>
  );
  const AlignJustifyIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );

  function insertLink() {
    const url = prompt("Havola URL:", "https://");
    if (url) exec("createLink", url);
  }

  function insertImage() {
    const url = prompt("Rasm URL:", "https://");
    if (url) exec("insertImage", url);
  }

  function clearFormat() {
    exec("removeFormat");
    exec("formatBlock", "p");
  }

  const Divider = () => <span className="rich-divider" />;

  return (
    <div className="rich-editor">
      <div className="rich-toolbar">
        <div className="rich-toolbar-row">
          {/* Matn formatlash */}
          <div className="rich-toolbar-group">
            <button type="button" title="Qalin (Ctrl+B)" className="rich-tool-btn" style={{fontWeight:900}} onMouseDown={e=>{e.preventDefault();exec("bold");}}>B</button>
            <button type="button" title="Kursiv (Ctrl+I)" className="rich-tool-btn" style={{fontStyle:"italic"}} onMouseDown={e=>{e.preventDefault();exec("italic");}}>I</button>
            <button type="button" title="Chizilgan (Ctrl+U)" className="rich-tool-btn" style={{textDecoration:"underline"}} onMouseDown={e=>{e.preventDefault();exec("underline");}}>U</button>
            <button type="button" title="O'tkazib chizilgan" className="rich-tool-btn" style={{textDecoration:"line-through"}} onMouseDown={e=>{e.preventDefault();exec("strikeThrough");}}>S</button>
          </div>

          <Divider />

          {/* Sarlavhalar */}
          <div className="rich-toolbar-group">
            <button type="button" title="Katta sarlavha" className="rich-tool-btn rich-tool-h1" onMouseDown={e=>{e.preventDefault();exec("formatBlock","h2");}}>H1</button>
            <button type="button" title="Kichik sarlavha" className="rich-tool-btn rich-tool-h2" onMouseDown={e=>{e.preventDefault();exec("formatBlock","h3");}}>H2</button>
            <button type="button" title="Paragraf" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("formatBlock","p");}}>¶</button>
          </div>

          <Divider />

          {/* Hizalanish */}
          <div className="rich-toolbar-group">
            <button type="button" title="Chapga hizalash" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("justifyLeft");}}><AlignLeftIcon /></button>
            <button type="button" title="Markazga hizalash" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("justifyCenter");}}><AlignCenterIcon /></button>
            <button type="button" title="O'ngga hizalash" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("justifyRight");}}><AlignRightIcon /></button>
            <button type="button" title="Ikki tomonga hizalash" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("justifyFull");}}><AlignJustifyIcon /></button>
          </div>

          <Divider />

          {/* Ro'yxatlar */}
          <div className="rich-toolbar-group">
            <button type="button" title="Raqamli ro'yxat" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("insertOrderedList");}}>1.</button>
            <button type="button" title="Nuqtali ro'yxat" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("insertUnorderedList");}}>•</button>
            <button type="button" title="Ajratgich chiziq" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("insertHorizontalRule");}}>—</button>
          </div>

          <Divider />

          {/* Qo'shish */}
          <div className="rich-toolbar-group">
            <button type="button" title="Havola qo'shish" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();insertLink();}}>🔗</button>
            <button
              type="button"
              title="Rasm yuklash (kompyuterdan)"
              className={`rich-tool-btn rich-tool-img ${uploading ? "uploading" : ""}`}
              onMouseDown={e=>{ e.preventDefault(); (fileInputRef.current && fileInputRef.current.click()); }}
            >{uploading ? "⏳" : "🖼"}</button>
            <button
              type="button"
              title="Kutubxonadan tanlash"
              className="rich-tool-btn"
              onMouseDown={e=>{ e.preventDefault(); setShowMediaModal(true); }}
            >📂</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{display:"none"}}
              onChange={e => { uploadAndInsert(e.target.files?.[0]); e.target.value=""; }}
            />
            <button
              type="button"
              title="PDF yuklash"
              className={`rich-tool-btn ${uploading ? "uploading" : ""}`}
              onMouseDown={e=>{ e.preventDefault(); (pdfInputRef.current && pdfInputRef.current.click()); }}
            >📄</button>
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              style={{display:"none"}}
              onChange={e => { uploadAndInsert(e.target.files?.[0]); e.target.value=""; }}
            />
          </div>

          <Divider />

          {/* Undo/Redo + Tozalash */}
          <div className="rich-toolbar-group">
            <button type="button" title="Bekor qilish (Ctrl+Z)" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("undo");}}>↺</button>
            <button type="button" title="Qayta qilish (Ctrl+Y)" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("redo");}}>↻</button>
            <button type="button" title="Formatlashni tozalash" className="rich-tool-btn rich-tool-clear" onMouseDown={e=>{e.preventDefault();clearFormat();}}>✕</button>
          </div>
        </div>
      </div>
      {uploading && (
        <div className="rich-upload-bar">
          <span className="rich-upload-spinner" /> Rasm yuklanmoqda...
        </div>
      )}
      <div
        ref={editorRef}
        className="rich-content"
        contentEditable
        suppressContentEditableWarning
        onInput={syncContent}
        onClick={(e) => {
          if (e.target.tagName === 'IMG') {
            if (window.confirm("Ushbu rasmni o'chirib tashlashni xohlaysizmi?")) {
              e.target.remove();
              syncContent();
            }
          }
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; syncContent(); }}
        data-placeholder="To'liq maqola matni. Paragraflarni Enter bilan ajrating..."
      />
      {showMediaModal && (
        <MediaSelectModal
          isUz={true}
          onClose={() => setShowMediaModal(false)}
          onSelect={(url) => {
            let html = '';
            const lowerUrl = url.toLowerCase();
            if (lowerUrl.endsWith('.pdf')) {
              html = `<a href="${url}" target="_blank">📄 Hujjatni yuklab olish</a>`;
            } else if (lowerUrl.match(/\.(mp4|webm|ogg)$/)) {
              html = `<video src="${url}" controls style="max-width:100%"></video>`;
            } else {
              html = `<img src="${url}" alt="media" />`;
            }
            exec('insertHTML', html);
            setShowMediaModal(false);
          }}
        />
      )}
    </div>
  );
}

function withIds(stories) {
  return {
    uz: stories.uz.map((story, index) => ({ id: story.id || `uz-seed-${index}`, status: story.status || "published", ...story })),
    en: stories.en.map((story, index) => ({ id: story.id || `ru-seed-${index}`, status: story.status || "published", ...story })),
    uzk: stories.uz.map((story, index) => ({ id: story.id || `uzk-seed-${index}`, status: story.status || "published", ...story })),
  };
}

// Лотин <-> Кирилл о'гириш
const latToCyr = {
  'a':'а','b':'б','d':'д','e':'е','f':'ф','g':'г','h':'ҳ','i':'и','j':'ж','k':'к','l':'л','m':'м','n':'н',
  'o':'о','p':'п','q':'қ','r':'р','s':'с','t':'т','u':'у','v':'в','x':'х','y':'й','z':'з',
  // о'збек апостроф турлари
  "o'":'ў',"oʻ":'ў',"o`":'ў',"oʻ":'ў',"oʼ":'ў',
  "g'":'ғ',"gʻ":'ғ',"g`":'ғ',"gʻ":'ғ',"gʼ":'ғ',
  // икки ҳарфли комбинациялар
  'sh':'ш','ch':'ч','ng':'ң','ts':'ц','yo':'ё','yu':'ю','ya':'я','ye':'е','yo\'':'йў',
  'ʼ':'ъ','"':'ъ',
  'A':'А','B':'Б','D':'Д','E':'Е','F':'Ф','G':'Г','H':'Ҳ','I':'И','J':'Ж','K':'К','L':'Л','M':'М','N':'Н',
  'O':'О','P':'П','Q':'Қ','R':'Р','S':'С','T':'Т','U':'У','V':'В','X':'Х','Y':'Й','Z':'З',
  "O'":'Ў',"Oʻ":'Ў',"O`":'Ў',"Oʻ":'Ў',"Oʼ":'Ў',
  "G'":'Ғ',"Gʻ":'Ғ',"G`":'Ғ',"Gʻ":'Ғ',"Gʼ":'Ғ',
  'Sh':'Ш','Ch':'Ч','Ng':'Ң','Ts':'Ц','Yo':'Ё','Yu':'Ю','Ya':'Я','Ye':'Е'
};

// 2-harfli tezkor qidiruv uchun kesh
const lat2Char = {};
for (let k in latToCyr) { if (k.length === 2) lat2Char[k.toLowerCase()] = latToCyr[k]; }

const cyrToLat = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'j','з':'z',
  'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
  'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'x','ц':'ts','ч':'ch',
  'ш':'sh','ъ':'ʼ','ь':'','э':'e','ю':'yu','я':'ya',
  'ў':'oʻ','қ':'q','ғ':'gʻ','ҳ':'h','ң':'ng',
  'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'J','З':'Z',
  'И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P',
  'Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'X','Ц':'Ts','Ч':'Ch',
  'Ш':'Sh','Э':'E','Ю':'Yu','Я':'Ya',
  'Ў':'Oʻ','Қ':'Q','Ғ':'Gʻ','Ҳ':'H','Ң':'Ng'
};

const cyr2Char = {};
for (let k in cyrToLat) { if (k.length === 2) cyr2Char[k.toLowerCase()] = cyrToLat[k]; }

const uiEn = {
  "Bosh sahifa": "Home",
  "Maqolalar": "Articles",
  "Barcha yangiliklar": "All news",
  "Qidiruv natijalari": "Search results",
  "Siz uchun tavsiyalar": "Recommendations for you",
  "Ko'p o'qiysiz: ": "You read often: ",
  "Ko'proq yangiliklar": "More news",
  "Video": "Video",
  "Foto": "Photo",
  "Tomosha qilish →": "Watch →",
  "Ko'rish →": "Watch →",
  "Kunning eng muhim videolari": "Main videos of the day",
  "Fotoreportajlar va vizual materiallar": "Photo reports and visual materials",
  "Tezkor yangiliklar": "Fast news",
  "Mustaqil tahlil": "Independent analysis",
  "Ikki tilda": "Bilingual",
  "Ishonchli manba": "Reliable source",
  "Monitoring": "Monitoring",
  "Bo'lim": "Sections",
  "Til": "Languages",
  "Maqola": "Articles",
  "Bu bo'limda hozircha maqola yo'q.": "No articles in this section yet.",
  "Saqlash": "Save",
  "Saqlangandan olib tashlash": "Remove from saved",
  "★ Saqlangan": "★ Saved",
  "☆ Saqlash": "☆ Save",
  "Izohlar": "Comments",
  "Hozircha izoh yo'q. Birinchi bo'ling!": "No comments yet. Be the first!",
  "Vatanuz.uz tahririyati": "Vatanuz.uz Editorial",
  "Jonli tahririyat": "Live Newsroom"
};

function T(str) {
  if (!str) return str;
  const lang = window.__currentLang || "uz";
  if (lang === "en") return uiEn[str] || str;
  if (lang === "uzk") return convertText(str, true);
  return str;
}

function convertText(text, toCyrillic) {
  if (!text) return text;
  if (toCyrillic) {
    text = text
      .replace(/yo'/g, 'йў').replace(/Yo'/g, 'Йў')
      .replace(/yoʻ/g, 'йў').replace(/Yoʻ/g, 'Йў')
      .replace(/yoʼ/g, 'йў').replace(/Yoʼ/g, 'Йў')
      .replace(/yo`/g, 'йў').replace(/Yo`/g, 'Йў');
  }
  const map = toCyrillic ? latToCyr : cyrToLat;
  const twoCharMap = toCyrillic ? lat2Char : cyr2Char;
  let result = '';
  let i = 0;
  const len = text.length;
  let inTag = false;
  
  while (i < len) {
    const ch = text[i];
    if (ch === '<') {
      inTag = true;
      result += ch;
      i++;
      continue;
    }
    if (inTag) {
      result += ch;
      if (ch === '>') inTag = false;
      i++;
      continue;
    }
    if (ch === '&') {
      let j = i + 1;
      let isEntity = false;
      while (j < len && j < i + 10) {
        if (text[j] === ';') {
          isEntity = true;
          break;
        }
        if (!/^[a-zA-Z#0-9]$/.test(text[j])) break;
        j++;
      }
      if (isEntity) {
        result += text.substring(i, j + 1);
        i = j + 1;
        continue;
      }
    }
    
    if (i < len - 1) {
      const two = text[i] + text[i+1];
      const twoLower = two.toLowerCase();
      let mapped = map[two];
      if (mapped === undefined && twoCharMap[twoLower] !== undefined) {
        mapped = twoCharMap[twoLower];
        if (two[0] === two[0].toUpperCase()) {
          mapped = mapped.toUpperCase();
        }
      }
      if (mapped !== undefined) {
        result += mapped;
        i += 2;
        continue;
      }
    }
    
    if (toCyrillic && (ch === "'" || ch === "ʼ" || ch === "ʻ" || ch === "`")) {
      const prev = i > 0 ? text[i-1] : '';
      const next = i < len - 1 ? text[i+1] : '';
      if (/[a-zA-Z]/.test(prev) && /[a-zA-Z]/.test(next)) {
        result += 'ъ';
      } else {
        result += ch;
      }
    } else {
      result += map[ch] || ch;
    }
    i++;
  }
  return result;
}


function VideosPage({ lang, t, mediaItems, onOpen, setPage }) {
  const isUz = lang !== "en";
  const videos = mediaItems.filter(item => item.type === "video");
  const title = lang === "uz" ? "Videolar" : (lang === "uzk" ? "Видеолар" : "Video");
  const note = lang === "uz" ? "Kunning eng muhim videolari" : (lang === "uzk" ? "Куннинг энг муҳим видеолари" : "Main videos of the day");

  return (
    <main className="section animate-fade-in">
      <div className="section-inner">
        <button 
          className="article-back-btn" 
          onClick={() => { setPage(lang === "uz" ? "Bosh sahifa" : (lang === "uzk" ? "Бош саҳифа" : "Home")); window.scrollTo({ top: 0, behavior: "instant" }); }} 
          style={{marginBottom: 24}}
        >
          <span>&#8592;</span> {isUz ? (lang === "uzk" ? "Орқага" : "Orqaga") : "Back"}
        </button>
        <div className="section-head">
          <div>
            <h2 className="section-title">📺 {title}</h2>
            <p className="section-note">{note}</p>
          </div>
        </div>
        
        <div className="videos-grid-page">
          {videos.map((item, idx) => {
            const { title: itemTitle, meta, url: image } = item;
            return (
              <button 
                key={idx}
                className="video-card-page"
                onClick={() => {
                  onOpen({
                    id: `media-${Date.now()}-${Math.random()}`,
                    title: itemTitle,
                    category: meta ? meta.split(' | ')[0] : "video",
                    time: meta ? meta.split(' | ')[1] : "",
                    image: null,
                    body: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin-bottom: 8px; border-radius: 12px; box-shadow: var(--shadow);">
                             <iframe src="${getYouTubeEmbedUrl(item.url)}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                           </div>
                           <div style="text-align: center; margin-bottom: 24px;">
                             <a href="${item.url}" target="_blank" rel="noreferrer" style="font-size: 14px; color: var(--brand); text-decoration: underline;">Videoni Youtubeda ko'rish</a>
                           </div>
                           ${item.body || ""}`
                  });
                }}
              >
                <div className="video-card-thumb">
                  <img src={getVideoThumb(image)} alt="" />
                  <span className="video-card-play">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                  </span>
                </div>
                <div className="video-card-body">
                  <strong className="video-card-title">{itemTitle}</strong>
                  <span className="video-card-meta">{meta}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function PhotosPage({ lang, t, mediaItems, onOpen, setPage }) {
  const isUz = lang !== "en";
  const photos = mediaItems.filter(item => item.type === "photo");
  const title = lang === "uz" ? "Fotolar" : (lang === "uzk" ? "Фотолар" : "Photo");
  const note = lang === "uz" ? "Fotoreportajlar va vizual materiallar" : (lang === "uzk" ? "Фоторепортажлар ва визуал материаллар" : "Photo reports and visual materials");

  return (
    <main className="section animate-fade-in">
      <div className="section-inner">
        <button 
          className="article-back-btn" 
          onClick={() => { setPage(lang === "uz" ? "Bosh sahifa" : (lang === "uzk" ? "Бош саҳифа" : "Home")); window.scrollTo({ top: 0, behavior: "instant" }); }} 
          style={{marginBottom: 24}}
        >
          <span>&#8592;</span> {isUz ? (lang === "uzk" ? "Орқага" : "Orqaga") : "Back"}
        </button>
        <div className="section-head">
          <div>
            <h2 className="section-title">📷 {title}</h2>
            <p className="section-note">{note}</p>
          </div>
        </div>
        <div className="media-photo-grid" style={{marginTop: 24}}>
          {photos.map((item, idx) => {
            const { title: itemTitle, meta, url: image } = item;
            return (
              <article className="media-photo-card" key={idx}>
                <button onClick={() => {
                  onOpen({
                    id: `media-${Date.now()}-${Math.random()}`,
                    title: itemTitle,
                    category: meta ? meta.split(' | ')[0] : "photo",
                    time: meta ? meta.split(' | ')[1] : "",
                    image: image,
                    images: item.images || (image ? [image] : []),
                    body: item.body || ""
                  });
                }}>
                  <div className="media-photo-thumb">
                    <img src={image} alt="" />
                    <div className="media-photo-overlay" />
                    <span className="media-photo-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></span>
                    <span className="media-photo-meta">{meta}</span>
                  </div>
                  <div className="media-photo-body">
                    <strong>{itemTitle}</strong>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function StaticPageView({ pageSlug, staticPages, lang }) {
  const page = staticPages.find(p => p.slug === pageSlug);
  if (!page) return <div className="section"><div className="section-inner"><h1>Sahifa topilmadi</h1></div></div>;
  
  const title = page.title[lang] || page.title["uzk"] || page.title["uz"];
  const body = page.body[lang] || page.body["uzk"] || page.body["uz"];
  
  return (
    <main className="section page-section" style={{ minHeight: "60vh", background: "#fff", paddingTop: "60px", paddingBottom: "60px" }}>
      <div className="section-inner" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "20px", color: "var(--color-heading, #111)" }}>{title}</h1>
        <div className="page-content" style={{ fontSize: "18px", lineHeight: "1.6", color: "var(--color-text, #333)" }} dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </main>
  );
}

function App() {
  const [lang, setLang] = useState("uzk");
  const [uiStrings, setUiStrings] = useState({});
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [staticPages, setStaticPages] = useState([]);
  const [siteConfig, setSiteConfig] = useState(DEFAULT_SITE_CONFIG);
  const [videos, setVideos] = useState({ uz: [], uzk: [], en: [] });
  const [photos, setPhotos] = useState({ uz: [], uzk: [], en: [] });
  const [latestNewsCount, setLatestNewsCount] = useState(7);
  const [searchOpen, setSearchOpen] = useState(false);

  const handlePushSubscribe = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert("Bildirishnomalarga ruxsat berilmadi!");
        return;
      }
      const res = await fetch('/api/push/vapidPublicKey');
      const { publicKey } = await res.json();
      
      const convertedVapidKey = new Uint8Array(atob(publicKey.replace(/-/g, '+').replace(/_/g, '/')).split('').map(c => c.charCodeAt(0)));
      
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });
      alert("Bildirishnomalarga muvaffaqiyatli obuna bo'ldingiz!");
    } catch (err) {
      alert("Xatolik yuz berdi: " + err.message);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/translations').then(r => r.json()).catch(e => ({})),
      fetch('/api/languages').then(r => r.json()).catch(e => ({})),
      fetch('/api/categories').then(r => r.json()).catch(e => ({})),
      fetch('/api/pages').then(r => r.json()).catch(e => ({})),
      fetch('/api/admin/settings').then(r => r.json()).catch(e => ({})),
      fetch('/api/videos').then(r => r.json()).catch(e => null),
      fetch('/api/photos').then(r => r.json()).catch(e => null)
    ]).then(([transData, langData, catData, pageData, settingsData, videosData, photosData]) => {
      if (transData.translations) setUiStrings(transData.translations);
      if (langData.data) setLanguages(langData.data);
      if (catData.data) setCategories(catData.data);
      if (pageData.data) setStaticPages(pageData.data);
      if (videosData) setVideos(videosData);
      if (photosData) setPhotos(photosData);
      if (settingsData.data && settingsData.data.mainColor) {
        document.documentElement.style.setProperty('--brand', settingsData.data.mainColor);
        document.documentElement.style.setProperty('--brand-dark', settingsData.data.mainColor);
      }
      if (settingsData.data) {
        setSiteConfig(prev => ({ ...prev, ...settingsData.data }));
      }
    }).catch(console.error);
  }, []);

  window.__currentLang = lang;
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [page, setPage] = useState(window.location.hash === "#admin" ? "admin" : "home");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeStory, setActiveStory] = useState(null);
  const [allStories, setAllStories] = useState({ uz: [], uzk: [], en: [] });
  const [serverMessage, setServerMessage] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("yk-dark") === "1");
  const [savedIds, setSavedIds] = useState(() => JSON.parse(localStorage.getItem("yk-saved") || "[]"));
  const [scrollVisible, setScrollVisible] = useState(false);
  const [pinnedHeroId, setPinnedHeroId] = useState(() => localStorage.getItem("yk-hero") || "");
  const [pinnedSideIds, setPinnedSideIds] = useState(() => JSON.parse(localStorage.getItem("yk-sides") || "[]"));
  const [copiedShare, setCopiedShare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeAuthor, setActiveAuthor] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [reactions, setReactions] = useState(() => JSON.parse(localStorage.getItem("yk-reactions") || "{}"));
  const [ads, setAds] = useState([]);

  const initialStoryIdRef = useRef((() => {
    try {
      const url = new URL(window.location);
      let sId = url.searchParams.get("story") || url.searchParams.get("id");
      if (!sId) {
        const m = window.location.pathname.match(/^\/(?:news|story|article|yangilik)\/([a-zA-Z0-9_-]+)/i);
        if (m) sId = m[1];
      }
      return sId || null;
    } catch(e) {
      return null;
    }
  })());
  const initialCheckedRef = useRef(!initialStoryIdRef.current);

  useEffect(() => {
    localStorage.setItem("yk-reactions", JSON.stringify(reactions));
  }, [reactions]);

  function addReaction(storyId, emoji) {
    setReactions(prev => {
      const cur = prev[storyId] || {};
      const myPrev = cur._mine;
      if (myPrev === emoji) return prev;
      const updated = { ...cur };
      if (myPrev) updated[myPrev] = Math.max(0, (updated[myPrev] || 1) - 1);
      updated[emoji] = (updated[emoji] || 0) + 1;
      updated._mine = emoji;
      return { ...prev, [storyId]: updated };
    });
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("yk-dark", darkMode ? "1" : "0");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("yk-saved", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    if (pinnedHeroId) localStorage.setItem("yk-hero", pinnedHeroId);
    else localStorage.removeItem("yk-hero");
  }, [pinnedHeroId]);

  useEffect(() => {
    localStorage.setItem("yk-sides", JSON.stringify(pinnedSideIds));
  }, [pinnedSideIds]);

  useEffect(() => {
    function onScroll() {
      setScrollVisible(window.scrollY > 400);
      // Glassmorphism header scrolled class
      const header = document.querySelector(".header");
      if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll fade-in animation (IntersectionObserver)
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in-up");
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });

  // Keyboard shortcuts: / → search, ESC → close story
  useEffect(() => {
    function onKey(e) {
      if (e.key === "/" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        document.querySelector(".search")?.focus();
      }
      if (e.key === "Escape" && activeStory) {
        setActiveStory(null); window.scrollTo({top:0,behavior:"smooth"});
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeStory]);

  useEffect(() => {
    if (!initialCheckedRef.current) return;
    const url = new URL(window.location);
    if (activeStory) {
      url.searchParams.set("story", activeStory.id);
      window.history.replaceState(null, "", url.toString());
    } else if (url.searchParams.has("story") || url.searchParams.has("id")) {
      url.searchParams.delete("story");
      url.searchParams.delete("id");
      window.history.replaceState(null, "", url.toString().replace(/\?$/, ""));
    }
  }, [activeStory]);

  function toggleSave(id) {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleView(storyId) {
    setAllStories(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(l => {
        if (next[l] && Array.isArray(next[l])) {
          next[l] = next[l].map(s => s.id === storyId ? { ...s, views: (s.views || 0) + 1 } : s);
        }
      });
      return next;
    });
  }

  useEffect(() => {
    function onHash() {
      if (window.location.hash === "#admin") setPage("admin");
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const baseCopy = copy[lang] || copy.uz;
  const remoteCopy = uiStrings && uiStrings[lang] ? uiStrings[lang] : {};
  const t = { ...baseCopy, ...remoteCopy };
  const dataLang = lang;
  const now = new Date().toISOString();
  const isPublished = (story) => {
    if (story.status !== "published") return false;
    if (story.publishAt && story.publishAt > now) return false;
    return true;
  };
  // UZ va UZK maqolalarini birlashtirish: kril maqolalari lotinda ham, lotin maqolalari krilda ham ko'rinadi
  const rawStories = (() => {
    if (lang === "uz") {
      const native = (allStories["uz"] || []).filter(isPublished);
      const nativeIds = new Set(native.map(s => s.id));
      const fromCyrillic = (allStories["uzk"] || []).filter(isPublished).filter(s => !nativeIds.has(s.id)).map(s => ({
        ...s,
        title: convertText(s.title, false),
        summary: convertText(s.summary, false),
        body: convertText(s.body, false),
        author: convertText(s.author, false),
        category: convertText(s.category, false),
        read: convertText(s.read, false),
        time: convertText(s.time, false),
        tags: convertText(s.tags, false),
        _transliterated: true
      }));
      return [...native, ...fromCyrillic].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (lang === "uzk") {
      const native = (allStories["uzk"] || []).filter(isPublished);
      const nativeIds = new Set(native.map(s => s.id));
      const fromLatin = (allStories["uz"] || []).filter(isPublished).filter(s => !nativeIds.has(s.id)).map(s => ({
        ...s,
        title: convertText(s.title, true),
        summary: convertText(s.summary, true),
        body: convertText(s.body, true),
        author: convertText(s.author, true),
        category: convertText(s.category, true),
        read: convertText(s.read, true),
        time: convertText(s.time, true),
        tags: convertText(s.tags, true),
        _transliterated: true
      }));
      return [...native, ...fromLatin].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return (allStories[dataLang] || []).filter(isPublished);
  })();
  // Крилл тилда кўрсатишда матнни автоматик ўгириш
  const stories = rawStories.map(story => {
    let catVal = story.category === "Iqtisod" ? "Iqtisodiyot" : story.category;
    let displayCat = catVal;
    if (categories && categories.length > 0) {
      const catObj = categories.find(c => c.slug === catVal || c.names["uz"] === catVal || c.names["en"] === catVal);
      if(catObj) {
        displayCat = catObj.names[lang] || catObj.names["en"] || catObj.slug;
      }
    } else if (lang === "uzk") {
       displayCat = convertText(catVal, true);
    }
    
    if (lang === "en") {
       return {
         ...story,
         category: displayCat,
         author: story.author === "Vatanuz.uz tahririyati" ? "Vatanuz.uz Editorial" : story.author,
         read: story.read ? story.read.replace('daqiqa', 'minutes') : story.read
       };
    }
    if (lang === "uzk") {
       if (story._transliterated) {
         return { ...story, category: displayCat };
       }
       return {
         ...story,
         title: convertText(story.title, true),
         summary: convertText(story.summary, true),
         body: convertText(story.body, true),
         author: convertText(story.author, true),
         category: displayCat,
         read: convertText(story.read, true),
         time: convertText(story.time, true),
         tags: convertText(story.tags, true)
       };
    }
    if (story._transliterated) {
      return { ...story, category: displayCat };
    }
    return { ...story, category: displayCat };
  });
  const adminStories = allStories[dataLang] || [];
  const displayVideos = lang === "uz" ? (videos["uz"]?.length ? videos["uz"] : (videos["uzk"] || []).map(v => ({...v, title: convertText(v.title, false), meta: convertText(v.meta, false), body: convertText(v.body, false)}))) : (videos[lang] || []);
  const displayPhotos = lang === "uz" ? (photos["uz"]?.length ? photos["uz"] : (photos["uzk"] || []).map(p => ({...p, title: convertText(p.title, false), meta: convertText(p.meta, false), body: convertText(p.body, false)}))) : (photos[lang] || []);
  // URL orqali to'g'ridan-to'g'ri ochilgan maqolani topish va ko'rsatish
  useEffect(() => {
    if (initialCheckedRef.current) return;
    const targetId = initialStoryIdRef.current;
    if (!targetId) {
      initialCheckedRef.current = true;
      return;
    }
    if (stories && stories.length > 0) {
      const found = stories.find(s => s && (s.id === targetId || s.slug === targetId))
        || (allStories.uz || []).find(s => s && (s.id === targetId || s.slug === targetId))
        || (allStories.uzk || []).find(s => s && (s.id === targetId || s.slug === targetId))
        || (allStories.en || []).find(s => s && (s.id === targetId || s.slug === targetId));

      if (found) {
        const activeItem = stories.find(s => s.id === found.id) || found;
        setActiveStory(activeItem);
        window.scrollTo({ top: 0, behavior: "instant" });
        initialCheckedRef.current = true;
        initialStoryIdRef.current = null;
      } else if (!loading) {
        initialCheckedRef.current = true;
        initialStoryIdRef.current = null;
      }
    } else if (!loading) {
      initialCheckedRef.current = true;
      initialStoryIdRef.current = null;
    }
  }, [stories, allStories, loading]);

  // Til o'zgarganda ochiq maqolani yangilash
  useEffect(() => {
    if (activeStory && stories && stories.length > 0) {
      const updated = stories.find(s => s.id === activeStory.id);
      if (updated && (updated.title !== activeStory.title || updated.body !== activeStory.body || updated.category !== activeStory.category)) {
        setActiveStory(updated);
      }
    }
  }, [lang, stories]);

  // Brauzer tarixi (orqaga / oldinga) tugmalari bosilganda
  useEffect(() => {
    function onPopState() {
      const url = new URL(window.location);
      let sId = url.searchParams.get("story") || url.searchParams.get("id");
      if (!sId) {
        const m = window.location.pathname.match(/^\/(?:news|story|article|yangilik)\/([a-zA-Z0-9_-]+)/i);
        if (m) sId = m[1];
      }
      if (sId && stories && stories.length > 0) {
        const found = stories.find(s => s && (s.id === sId || s.slug === sId));
        if (found) {
          setActiveStory(found);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }
      if (!sId) {
        setActiveStory(null);
      }
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [stories]);

  const pages = categories.map(c => ({ slug: c.slug, name: c.names[lang] || c.names["en"] || c.slug }));
  const selectedCategory = page === 'home' || page === 'admin' || page === 'barcha-yangiliklar' ? null : (categories.find(c => c.slug === page)?.names[lang] || categories.find(c => c.slug === page)?.names["en"] || page);

  function changeLang(nextLang) {
    try {
      setLang(nextLang);
      setFilter("all");
      setQuery("");
    } catch(e) {
    }
  }

  const getDisplayCat = (cat) => {
    if (!cat) return cat;
    if (cat === 'photo') return T('Foto');
    if (cat === 'video') return T('Video');
    const c = categories.find(x => x.slug === cat);
    return c ? (c.names[lang] || c.names["en"] || cat) : cat;
  };

  const filterCategories = useMemo(() => [t.all, ...categories.map(c => c.names[lang] || c.names["uz"] || c.slug)], [categories, lang, t.all]);

  const visibleStories = stories.filter((story) => {
    if (query) {
      const text = `${story.title} ${story.summary} ${story.category}`.toLowerCase();
      return text.includes(query.toLowerCase());
    }
    const matchesPage = !selectedCategory || story.category === selectedCategory;
    const matchesFilter = filter === "all" || story.category === filter || getDisplayCat(story.category) === filter || filter === t.all;
    const isEditor = true;
    return matchesPage && matchesFilter && isEditor;
  });

  const pinnedStory = pinnedHeroId ? stories.find(s => s && s.id === pinnedHeroId) : null;
  const featuredStories = stories.filter(s => s && s.isFeatured);
  const hero = featuredStories[0] || pinnedStory || stories[0] || adminStories[0] || fallbackStory;
  const pinnedSideStories = pinnedSideIds.map(id => stories.find(s => s && s.id === id)).filter(Boolean);
  
  // Tahririyat tanlovi (Editor's choice)
  const editorChoiceStories = stories.filter(s => s && (s.isEditorChoice || s.isEditorPick) && s.id !== hero?.id);
  const otherFeatured = featuredStories.filter(s => s && s.id !== hero?.id && !s.isEditorChoice && !s.isEditorPick);
  const remainingStories = stories.filter(s => s && s.id !== hero?.id && !pinnedSideIds.includes(s.id) && !s.isFeatured && !s.isEditorChoice && !s.isEditorPick);
  
  // Left side sub-grid cards under hero: 6 ta karta (1 ta hero + 6 ta kichik karta = jami 7 ta maqola)
  const gridStories = [
    ...editorChoiceStories,
    ...otherFeatured,
    ...pinnedSideStories.filter(s => !editorChoiceStories.some(e => e.id === s.id)),
    ...remainingStories
  ].filter((s, idx, self) => self.findIndex(x => x.id === s.id) === idx).slice(0, 6);
  
  // Right side "So'nggi yangiliklar" list (shows recent stories, non-hero if available, or all stories)
  const nonHeroStories = stories.filter(s => s && s.id !== hero?.id);
  const latestStories = (nonHeroStories.length > 0 ? nonHeroStories : stories).slice(0, latestNewsCount || 7);

  useEffect(() => {
    refreshPublicStories();
    fetchAds();
  }, []);

  async function fetchAds() {
    try {
      const res = await fetch("/api/ads");
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      }
    } catch(err) {
    }
  }

  async function refreshPublicStories() {
    setLoading(true);
    try {
      const response = await fetch("/api/stories", {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' }
      });
      if (!response.ok) throw new Error("API javob bermadi");
      const data = await response.json();
      const uzStories = data.stories.uz.length ? data.stories.uz : withIds(storyData).uz;
      const uzkStories = data.stories.uzk && data.stories.uzk.length ? data.stories.uzk : uzStories;
      setAllStories(prev => {
        const next = {
          ...prev,
          uz: uzStories,
          en: data.stories.en?.length ? data.stories.en : withIds(storyData).en,
          uzk: uzkStories,
        };
        setTimeout(() => {
          const url = new URL(window.location);
          let storyId = url.searchParams.get("story") || url.searchParams.get("id");
          if (!storyId) {
            const m = window.location.pathname.match(/^\/(?:news|story|article|yangilik)\/([a-zA-Z0-9_-]+)/i);
            if (m) storyId = m[1];
          }
          if (storyId) {
            window.__pendingStoryId = storyId;
          }
        }, 100);
        return next;
      });
      setServerMessage("");
    } catch (error) {
      setServerMessage("Server API bilan aloqa bo'lmadi, demo maqolalar ko'rsatilmoqda.");
      setAllStories(withIds(storyData));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      {page !== "admin" && (<>
      <AdBanner position="super_top" ads={ads} />
      <WeatherBar lang={lang} />
      <header className="header">
        <div className="nav-inner">
          <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </button>
          <button className="brand nav-link" onClick={() => { setPage("home"); setActiveStory(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label={siteConfig.siteName || "VATAN"} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            {siteConfig.logoUrl ? (
              <img src={siteConfig.logoUrl} alt="Logo" height="44" style={{ objectFit: "contain", borderRadius: "4px" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg width="44" height="44" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" rx="22" fill={darkMode ? "#ffffff" : "var(--brand)"} />
                  <rect x="18" y="18" width="64" height="64" rx="14" fill="none" stroke={darkMode ? "var(--brand)" : "#ffffff"} strokeWidth="8" />
                  <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill={darkMode ? "var(--brand)" : "#ffffff"} fontFamily="Georgia, serif" fontWeight="bold" fontSize="42">V</text>
                </svg>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "32px", fontWeight: "900", letterSpacing: "1px", color: darkMode ? "#ffffff" : "var(--brand)", lineHeight: "1", textTransform: "uppercase" }}>
                    VATAN
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                    <div style={{ height: "2px", background: darkMode ? "#ffffff" : "var(--brand)", flex: 1, minWidth: "20px" }}></div>
                    <span style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", fontWeight: "800", color: darkMode ? "#ffffff" : "var(--brand)", letterSpacing: "0.5px" }}>MILLIY KONTENTI</span>
                    <div style={{ height: "2px", background: darkMode ? "#ffffff" : "var(--brand)", flex: 1, minWidth: "20px" }}></div>
                  </div>
                </div>
              </div>
            )}
          </button>

          <div className="nav-links">
            {pages.map((item) => (
              <button
                key={item.slug}
                className={`nav-link ${page === item.slug ? "active" : ""}`}
                onClick={() => {
                  setPage(item.slug);
                  setActiveStory(null);
                  setSearchOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="actions">
            <div className="desktop-search">
              {!searchOpen ? (
                <button 
                  className="dark-toggle" 
                  onClick={() => setSearchOpen(true)} 
                  style={{ padding: "8px", background: "transparent", border: "none", cursor: "pointer", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  aria-label="Qidirish"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
              ) : (
                <input
                  className="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.search}
                  aria-label={t.search}
                  autoFocus
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setSearchOpen(false);
                    }
                  }}
                  style={{ width: "200px", padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)", fontSize: "14px", outline: "none", transition: "width 0.2s" }}
                />
              )}
            </div>
            <button
              className="dark-toggle"
              title="Obuna bo'lish"
              onClick={handlePushSubscribe}
              style={{ padding: "6px", background: "transparent", border: "none", cursor: "pointer", color: "var(--ink)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="lang-toggle" aria-label="Language">
              {languages.filter(l => l.isActive !== false).map(l => (
                <button key={l.id} className={lang === l.id ? "active" : ""} onClick={() => changeLang(l.id)}>
                  {l.id === "uzk" ? "\u040e\u0417" : (l.id === "uz" ? "UZ" : (l.id === "en" ? "EN" : l.shortName))}
                </button>
              ))}
            </div>
            <button
              className="dark-toggle"
              title={darkMode ? "Kunduz rejimi" : "Qorong'u rejim"}
              onClick={() => setDarkMode(d => !d)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", padding: 0, borderRadius: "50%", background: "var(--fill)", border: "1px solid var(--line)", color: "var(--ink)", cursor: "pointer" }}
            >
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            {savedIds.length > 0 && (
              <button
                className={`nav-link ${page === "__saved__" ? "active" : ""}`}
                style={{fontSize:18, padding:"4px 8px", position:"relative"}}
                title={lang !== "en" ? "Saqlangan" : "Saved"}
                onClick={() => { setPage("__saved__"); setActiveStory(null); window.scrollTo({top:0,behavior:"smooth"}); }}
              >🔖 <span style={{fontSize:12,fontWeight:800}}>{savedIds.length}</span></button>
            )}
          </div>
        </div>
      </header>

      {/* 📱 Mobile Drawer Menu */}
      <div className={`mobile-drawer-overlay ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-logo" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="22" fill="var(--brand)" />
              <rect x="18" y="18" width="64" height="64" rx="14" fill="none" stroke="#ffffff" strokeWidth="8" />
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#ffffff" fontFamily="Georgia, serif" fontWeight="bold" fontSize="42">V</text>
            </svg>
            <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "22px", fontWeight: "900", letterSpacing: "1px", color: "var(--brand)", textTransform: "uppercase" }}>
              VATAN
            </span>
          </div>
          <button className="drawer-close" onClick={() => setMenuOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: "0 0 16px 0" }}>
          <input
            className="search"
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)", fontSize: "15px" }}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
        </div>
        <nav className="drawer-nav">
          {pages.map((item) => (
            <button
              key={item.slug}
              className={`drawer-link ${page === item.slug ? "active" : ""}`}
              onClick={() => {
                setPage(item.slug);
                setFilter("all");
                setActiveStory(null);
                setMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>
        <div className="drawer-footer">
          <div className="drawer-lang-toggle">
            {languages.filter(l => l.isActive !== false).map(l => (
              <button key={l.id} className={lang === l.id ? "active" : ""} onClick={() => { changeLang(l.id); setMenuOpen(false); }}>
                {l.id === "uzk" ? "\u040e\u0417" : (l.id === "uz" ? "UZ" : (l.id === "en" ? "EN" : l.shortName))}
              </button>
            ))}
          </div>
          <button className="drawer-theme-btn" onClick={() => { setDarkMode(!darkMode); setMenuOpen(false); }}>
            {darkMode 
              ? (lang === "en" ? "☀️ Light theme" : (lang === "uzk" ? "☀️ Ёруғ мавзу" : "☀️ Yorug' mavzu"))
              : (lang === "en" ? "🌙 Dark theme" : (lang === "uzk" ? "🌙 Қоронғу мавзу" : "🌙 Qorong'u mavzu"))
            }
          </button>
        </div>
      </div>
      </>)}
      {serverMessage && page !== "admin" && <div className="api-banner">{serverMessage}</div>}

      {siteConfig?.maintenanceMode && page !== "admin" ? (
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px 20px" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "16px", color: "var(--brand)" }}>Sayt ta'mirlanmoqda</h1>
          <p style={{ fontSize: "1.2rem", color: "var(--muted)", maxWidth: "500px" }}>Keltirilgan noqulayliklar uchun uzr so'raymiz. Tez orada sayt o'z ishini davom ettiradi.</p>
        </div>
      ) : activeStory ? (
        <ArticlePage
          lang={lang} t={t} story={activeStory} stories={stories} ads={ads} getDisplayCat={getDisplayCat}
          savedIds={savedIds} onToggleSave={toggleSave}
          copiedShare={copiedShare} setCopiedShare={setCopiedShare}
          onClose={() => { setActiveStory(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          onOpen={(s) => { setActiveStory(s); window.scrollTo({ top: 0, behavior: "instant" }); }}
          onView={handleView}
          reactions={reactions} addReaction={addReaction}
          onAuthorClick={(author) => { setActiveAuthor(author); setActiveStory(null); window.scrollTo({top:0,behavior:"smooth"}); }}
          onTagClick={(tag) => { setActiveTag(tag); setActiveStory(null); window.scrollTo({top:0,behavior:"smooth"}); }}
        />
      ) : activeAuthor ? (
        <AuthorPage
          author={activeAuthor} stories={stories} lang={lang}
          onOpen={(s) => { setActiveStory(s); window.scrollTo({top:0,behavior:"instant"}); }}
          onBack={() => setActiveAuthor(null)}
          savedIds={savedIds} onToggleSave={toggleSave}
        />
      ) : activeTag ? (
        <TagPage
          tag={activeTag} stories={stories} lang={lang}
          onOpen={(s) => { setActiveStory(s); window.scrollTo({top:0,behavior:"instant"}); }}
          onBack={() => setActiveTag(null)}
          savedIds={savedIds} onToggleSave={toggleSave}
        />
      ) : (
        <>
          {page === "home" && !query && (
            loading ? (
              <HeroSkeleton />
            ) : (
              <Hero t={t} lang={lang} hero={hero} gridStories={gridStories} latestStories={latestStories} getDisplayCat={getDisplayCat} openStory={(s) => { setActiveStory(s); window.scrollTo({ top: 0, behavior: "instant" }); }} pinnedHeroId={pinnedHeroId} onLoadMore={() => { setPage("barcha-yangiliklar"); window.scrollTo({ top: 0, behavior: "instant" }); }} />
            )
          )}
          {page !== "admin" && page !== "__saved__" && <AdBanner ads={ads} position="top" />}

          {page === "admin" ? (
            <AdminPanel
              lang={lang}
              setLang={setLang}
              allStories={allStories}
              stories={adminStories}
              setAllStories={setAllStories}
              refreshPublicStories={refreshPublicStories}
              siteConfig={siteConfig}
              setSiteConfig={setSiteConfig}
              pinnedHeroId={pinnedHeroId}
              setPinnedHeroId={setPinnedHeroId}
              pinnedSideIds={pinnedSideIds}
              setPinnedSideIds={setPinnedSideIds}
              ads={ads}
              setAds={setAds}
              languages={languages}
              setLanguages={setLanguages}
              categories={categories}
              setCategories={setCategories}
              staticPages={staticPages}
              setStaticPages={setStaticPages}
              videos={videos}
              setVideos={setVideos}
              photos={photos}
              setPhotos={setPhotos}
            />
          ) : page === "__saved__" ? (
            <main className="section saved-page">
              <div className="section-inner">
                <div className="section-head">
                  <div>
                    <h2 className="section-title">🔖 {lang !== "en" ? "Saqlangan maqolalar" : "Saved articles"}</h2>
                    <p className="saved-count">{savedIds.length} ta maqola saqlangan</p>
                  </div>
                  {savedIds.length > 0 && (
                    <button className="adm-btn ghost" style={{fontSize:12}} onClick={() => setSavedIds([])}>
                      {lang !== "en" ? "Hammasini o'chirish" : "Clear all"}
                    </button>
                  )}
                </div>
                {savedIds.length === 0 ? (
                  <div className="saved-empty">
                    <span>🔖</span>
                    <p>{lang !== "en" ? "Hozircha hech narsa saqlanmagan" : "Nothing saved yet"}</p>
                    <small>{lang !== "en" ? "Maqolalardagi в˜… tugmasini bosing" : "Нажмите в˜… в статье"}</small>
                  </div>
                ) : (
                  <div className="layout">
                    <div className="stories-grid">
                      {stories.filter(s => savedIds.includes(s.id)).map(story => (
                        <StoryCard lang={lang} key={story.id} story={story} savedIds={savedIds} onToggleSave={toggleSave}
                          onOpen={() => { setActiveStory(story); window.scrollTo({ top: 0, behavior: "instant" }); }} />
                      ))}
                    </div>
                    <Sidebar t={t} stories={stories} onOpen={(s) => { setActiveStory(s); window.scrollTo({ top: 0, behavior: "instant" }); }} ads={ads} />
                  </div>
                )}
              </div>
            </main>
          ) : page === "Aloqa" ? (
            <ContactPage t={t} page={page} siteConfig={siteConfig} />
          ) : typeof page === "string" && page.startsWith("page_") ? (
            <StaticPageView pageSlug={page.replace("page_", "")} staticPages={staticPages} lang={lang} />
          ) : (page === "Videolar" || page === "Видеолар" || page === "Video") ? (
            <VideosPage 
              lang={lang} 
              t={t} 
              mediaItems={displayVideos}
              onOpen={(video) => {
                setActiveStory(video);
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
              setPage={setPage}
            />
          ) : (page === "Fotolar" || page === "Фотолар" || page === "Photo") ? (
            <PhotosPage 
              lang={lang} 
              t={t} 
              mediaItems={displayPhotos}
              onOpen={(photo) => {
                setActiveStory(photo);
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
              setPage={setPage}
            />
          ) : (
            <main className={`section ${page === "home" ? "home-section" : "category-section"}`}>
              <div className="section-inner">
                {page !== "home" && page !== "barcha-yangiliklar" && (
                  <div className="category-masthead">
                    <span>{t.portal}</span>
                    <h1>{page}</h1>
                    <p>{t.pageNotes[page]}</p>
                  </div>
                )}
                <div className="section-head" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "24px", width: "100%", overflow: "hidden" }}>
                    <h2 className="section-title" style={{ display: "inline-flex", alignItems: "center", gap: "10px", margin: 0, flexShrink: 0 }}>
                      <span className="dot"></span>
                      {query ? T("Qidiruv natijalari") : (page === "home" ? (t.articlesTitle || T("Maqolalar")) : (page === "barcha-yangiliklar" ? T("Barcha yangiliklar") : (pages.find(p => p.slug === page)?.name || page)))}
                    </h2>
                    <div className="page-tools" style={{ flex: 1, margin: 0 }}>
                      {filterCategories.map((cat) => (
                        <button
                          key={cat}
                          className={`chip ${(filter === cat || (filter === "all" && cat === t.all)) ? "active" : ""}`}
                          onClick={() => setFilter(cat === t.all ? "all" : cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="section-note" style={{ margin: 0 }}>{page === "home" || page === "barcha-yangiliklar" ? t.latestNote : t.pageNotes[page]}</p>
                </div>
                <div className="layout">
                  <div>
                    <AdBanner ads={ads} position="inline" />
                    <div className="stories-grid">
                      {loading
                        ? Array.from({length: 6}).map((_, i) => <SkeletonCard key={i} />)
                        : visibleStories.length ? (page === "home" ? visibleStories.slice(0, 8) : visibleStories).map((story, index) => (
                          <StoryCard lang={lang} key={`${story.id}-${index}`} story={story} featured={page !== "home" && index === 0}
                            savedIds={savedIds} onToggleSave={toggleSave}
                            onOpen={() => { setActiveStory(story); window.scrollTo({ top: 0, behavior: "instant" }); }} />
                        )) : <div className="empty-state">{T("Bu bo'limda hozircha maqola yo'q.")}</div>}
                    </div>
                    
                  </div>
                  <Sidebar t={t} stories={stories} onOpen={(s) => { setActiveStory(s); window.scrollTo({ top: 0, behavior: "instant" }); }} ads={ads} />
                </div>
              </div>
            </main>
          )}

          {page !== "admin" && page !== "Fotolar" && page !== "Фотолар" && page !== "Photo" && page !== "Videolar" && page !== "Видеолар" && page !== "Video" && page !== "barcha-yangiliklar" && <AdBanner ads={ads} position="bottom" />}
          {page !== "admin" && page !== "Aloqa" && page !== "Fotolar" && page !== "Фотолар" && page !== "Photo" && page !== "Videolar" && page !== "Видеолар" && page !== "Video" && page !== "barcha-yangiliklar" && <BreakingBanner t={t} lang={lang} stories={stories} onOpen={(s) => { setActiveStory(s); window.scrollTo({ top: 0, behavior: "instant" }); }} />}
          {page !== "admin" && page !== "Aloqa" && page !== "Fotolar" && page !== "Фотолар" && page !== "Photo" && page !== "Videolar" && page !== "Видеолар" && page !== "Video" && page !== "barcha-yangiliklar" && <MediaSection lang={lang} items={[...displayVideos, ...displayPhotos]} onOpen={(story) => { setActiveStory(story); window.scrollTo({ top: 0, behavior: "instant" }); }} setPage={setPage} />}
          {page !== "admin" && page !== "Fotolar" && page !== "Фотолар" && page !== "Photo" && page !== "Videolar" && page !== "Видеолар" && page !== "Video" && page !== "barcha-yangiliklar" && <Special t={t} dial={false} siteConfig={siteConfig} />}
        </>
      )}

      {page !== "admin" && (<>
      <Footer t={t} siteConfig={siteConfig} pages={staticPages.map(p => ({ slug: `page_${p.slug}`, name: p.title[lang] || p.title["uzk"] }))} setPage={(slug) => { setPage(slug); setActiveStory(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} openAdmin={() => { setPage("admin"); setActiveStory(null); }} />

      <button
        className={`scroll-top-btn ${scrollVisible ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Yuqoriga"
      >↑</button>

      {/* 📱 Mobile bottom navigation */}
      <nav className="mobile-bottom-nav">
        <button className={`mob-nav-btn ${page === "home" && !activeStory ? "active" : ""}`}
          onClick={() => { setPage("home"); setActiveStory(null); setActiveAuthor(null); setActiveTag(null); window.scrollTo({top:0,behavior:"smooth"}); }}>
          <svg className="mob-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>{lang === "uz" ? "Bosh" : (lang === "uzk" ? "Бош" : "Home")}</span>
        </button>
        <button className={`mob-nav-btn ${query ? "active" : ""}`}
          onClick={() => { setMenuOpen(true); setTimeout(() => { const els = document.querySelectorAll(".search"); (els[1] || els[0])?.focus(); }, 100); }}>
          <svg className="mob-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>{lang === "uz" ? "Qidirish" : (lang === "uzk" ? "Қидириш" : "Поиск")}</span>
        </button>
        <button className={`mob-nav-btn ${["Videolar", "Видеолар", "Video"].includes(page) ? "active" : ""}`}
          onClick={() => { setPage(lang === "uz" ? "Videolar" : (lang === "uzk" ? "Видеолар" : "Video")); setActiveStory(null); window.scrollTo({top:0,behavior:"smooth"}); }}>
          <svg className="mob-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
          <span>{lang === "uz" ? "Video" : (lang === "uzk" ? "Видео" : "Видео")}</span>
        </button>
        <button className={`mob-nav-btn ${menuOpen ? "active" : ""}`}
          onClick={() => { setMenuOpen(true); }}>
          <svg className="mob-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <span>{lang === "uz" ? "Menyu" : (lang === "uzk" ? "Меню" : "Меню")}</span>
        </button>
      </nav>
      </>)}
    </div>
  );
}

function BreakingBanner({ t, lang, stories, onOpen }) {
  const isUz = lang !== "en";

  const label = t.breakingLabel || T(isUz ? "TEZKOR" : "BREAKING");
  const title = t.breakingTitle || T(isUz ? "Haftaning eng dolzarb xabarlari" : "Top news of the week");
  const sub = t.breakingSub || T(isUz ? "Tahririyat tanlovi" : "Editor's Choice");
  const btnLabel = t.breakingBtn || T(isUz ? "Barchasini o'qish" : "Read all");
  const picks = stories.filter(s => s.isBreaking).slice(0, 3);

  if (picks.length === 0) return null;

  return (
    <div className="breaking-banner">
      <div className="breaking-inner">
        <div className="breaking-left">
          <span className="breaking-badge">
            <span className="breaking-live-dot" />
            {label}
          </span>
          <h2>{title}</h2>
          <p>{sub}</p>
        </div>
        <div className="breaking-cards">
          {picks.map((story) => (
            <button key={story.id} className="breaking-card" onClick={() => onOpen(story)}>
              <img src={story.image} alt="" />
              <div className="breaking-card-overlay" />
              <div className="breaking-card-body">
                <span className="breaking-cat">{story.category}</span>
                <strong>{story.title}</strong>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MediaSection({ lang, items, onOpen, setPage }) {
  const isUz = lang !== "en";
  const safeItems = items || [];
  const videos = safeItems.filter((item) => item.type === "video");
  const photos = safeItems.filter((item) => item.type === "photo");

  const videoLabel = T(isUz ? "Video" : "Video");
  const photoLabel = T(isUz ? "Foto" : "Photo");
  const videoNote = T(isUz ? "Kunning eng muhim videolari" : "Main videos of the day");
  const photoNote = T(isUz ? "Fotoreportajlar va vizual materiallar" : "Photo reports and visual materials");
  const watchLabel = T(isUz ? "Tomosha qilish →" : "Watch →");
  const viewLabel = T(isUz ? "Ko'rish →" : "View →");

  function MediaBlock({ type, blockItems, title, note, onOpen }) {
    const handleOpen = (item) => {
      if (!onOpen) return;
      const { type, title: itemTitle, meta, url: image } = item;
      onOpen({
        id: `media-${Date.now()}-${Math.random()}`,
        title: itemTitle,
        category: meta ? meta.split(' | ')[0] : type,
        time: meta ? meta.split(' | ')[1] : "",
        image: type === "video" ? null : image,
        images: item.images || (image ? [image] : []),
        body: type === "video" 
          ? `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin-bottom: 8px;">
               <iframe src="${getYouTubeEmbedUrl(item.url)}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
             </div>
             <div style="text-align: center; margin-bottom: 24px;">
               <a href="${item.url}" target="_blank" rel="noreferrer" style="font-size: 14px; color: var(--brand); text-decoration: underline;">Videoni Youtubeda ko'rish</a>
             </div>
             ${item.body || ""}`
          : (item.body || "")
      });
    };
    if (!blockItems.length) return null;
    const featured = blockItems[0];
    const rest = blockItems.slice(1);
    return (
      <div className="media-block">
        {/* DEBUG: type={type}, blockItems={blockItems.length} */}
        <div className="media-block-head">
          {type === "photo" ? (
            <button 
              className="media-block-icon-label photo"
              style={{ cursor: "pointer", border: 0, outline: "none", display: "inline-flex", fontFamily: "inherit", background: "rgba(0, 51, 160, 0.1)" }}
              onClick={() => {
                const targetPage = lang === "uz" ? "Fotolar" : (lang === "uzk" ? "Фотолар" : "Photo");
                if (setPage) {
                  setPage(targetPage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              ◉ {title}
            </button>
          ) : (
            <button 
              className="media-block-icon-label video"
              style={{ cursor: "pointer", border: 0, outline: "none", display: "inline-flex", fontFamily: "inherit", background: "rgba(0, 51, 160, 0.1)" }}
              onClick={() => {
                const targetPage = lang === "uz" ? "Videolar" : (lang === "uzk" ? "Видеолар" : "Video");
                if (setPage) {
                  setPage(targetPage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              ▶ {title}
            </button>
          )}
          <p>{note}</p>
        </div>

        {type === "video" ? (
          <div className="media-v2-layout">
            <article className="media-featured" onClick={() => handleOpen(featured)} style={{cursor: "pointer"}}>
              <div className="media-featured-thumb">
                <img src={getVideoThumb(featured.url)} alt="" />
                <div className="media-featured-overlay" />
                <span className={`media-featured-icon video`}>▶</span>
                <div className="media-featured-meta">
                  <span className="media-type-badge video">{title}</span>
                  <span>{featured.meta}</span>
                </div>
              </div>
              <div className="media-featured-body">
                <strong>{featured.title}</strong>
                <button className="media-play-btn" onClick={(e) => { e.stopPropagation(); handleOpen(featured); }}>{watchLabel}</button>
              </div>
            </article>
            <div className="media-v2-list">
              {rest.slice(0, 5).map((item, idx) => {
                const { title: itemTitle, meta, url: image } = item;
                return (
                <article className="media-list-item" key={idx}>
                  <button onClick={() => handleOpen(item)}>
                    <span className="media-list-thumb">
                      <img src={getVideoThumb(image)} alt="" />
                      <span className="media-list-icon video">▶</span>
                    </span>
                    <span className="media-list-body">
                      <strong>{itemTitle}</strong>
                      <small>{meta}</small>
                    </span>
                  </button>
                </article>
              )})}
            </div>
          </div>
        ) : (
          <div className="media-photo-grid">
            {blockItems.slice(0, 8).map((item, idx) => {
              const { title: itemTitle, meta, url: image } = item;
              return (
              <article className="media-photo-card" key={idx}>
                <button onClick={() => handleOpen(item)}>
                  <div className="media-photo-thumb">
                    <img src={image} alt="" />
                    <div className="media-photo-overlay" />
                    <span className="media-photo-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></span>
                    <span className="media-photo-meta">{meta}</span>
                  </div>
                  <div className="media-photo-body">
                    <strong>{itemTitle}</strong>
                  </div>
                </button>
              </article>
            )})}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="section media-section">
      <div className="section-inner">
        <MediaBlock type="video" blockItems={videos} title={videoLabel} note={videoNote} onOpen={onOpen} />
        <div style={{ margin: "48px 0", borderTop: "1px dashed var(--line)" }} />
        <MediaBlock type="photo" blockItems={photos} title={photoLabel} note={photoNote} onOpen={onOpen} />
      </div>
    </section>
  );
}


function WeatherBar({ lang }) {
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=41.2995&longitude=69.2401&current=temperature_2m,weathercode,windspeed_10m&timezone=Asia%2FTashkent")
      .then(r => r.json())
      .then(data => {
        const code = data.current.weathercode;
        const temp = Math.round(data.current.temperature_2m);
        const wind = Math.round(data.current.windspeed_10m);
        const icons = {
          0:"☀️", 1:"🌤", 2:"⛅", 3:"в˜ЃпёЏ",
          45:"🌫", 48:"🌫", 51:"🌦", 53:"🌦", 55:"🌧",
          61:"🌧", 63:"🌧", 65:"🌧", 71:"🌨", 73:"🌨",
          75:"🌨", 80:"🌦", 81:"🌧", 82:"⛈", 95:"⛈", 96:"⛈", 99:"⛈"
        };
        const descs = {
          uz:  { 0:"Ochiq", 1:"Asosan ochiq", 2:"Qisman bulutli", 3:"Bulutli", 45:"Tuman", 48:"Tuman",
            51:"Yengil yomg'ir", 53:"Yomg'ir", 55:"Kuchli yomg'ir", 61:"Yomg'ir", 63:"Yomg'ir",
            65:"Kuchli yomg'ir", 71:"Qor", 73:"Qor", 75:"Kuchli qor", 80:"Yomg'ir", 81:"Yomg'ir",
            82:"Momaqaldiroq", 95:"Momaqaldiroq", 96:"Do'l", 99:"Do'l" },
          uzk: { 0:"Очиқ", 1:"Асосан очиқ", 2:"Қисман булутли", 3:"Булутли", 45:"Туман", 48:"Туман",
            51:"Енгил ёмғир", 53:"Ёмғир", 55:"Кучли ёмғир", 61:"Ёмғир", 63:"Ёмғир",
            65:"Кучли ёмғир", 71:"Қор", 73:"Қор", 75:"Кучли қор", 80:"Ёмғир", 81:"Ёмғир",
            82:"Момақалдироқ", 95:"Момақалдироқ", 96:"Дўл", 99:"Дўл" },
          en: { 0:"Clear", 1:"Mostly clear", 2:"Partly cloudy", 3:"Overcast", 45:"Fog", 48:"Fog", 51:"Light rain", 53:"Rain", 55:"Heavy rain", 61:"Rain", 63:"Rain", 65:"Heavy rain", 71:"Snow", 73:"Snow", 75:"Heavy snow", 80:"Rain", 81:"Rain", 82:"Thunderstorm", 95:"Thunderstorm", 96:"Hail", 99:"Hail" }
        };
        const langKey = lang === "en" ? "en" : lang === "uzk" ? "uzk" : "uz";
        const fallback = lang === "en" ? "Weather" : lang === "uzk" ? "Об-ҳаво" : "Ob-havo";
        const desc = (descs[langKey] || descs.uz)[code] || fallback;
        setWeather({ temp, wind, icon: icons[code] || "🌡", desc });
      })
      .catch(() => {});
  }, [lang]);

  const isUz = lang !== "en";
  const locale = lang === "en" ? "en-US" : "uz-UZ";
  const dd = String(time.getDate()).padStart(2, "0");
  const mm = String(time.getMonth() + 1).padStart(2, "0");
  const yyyy = time.getFullYear();
  const timeStr = time.toLocaleTimeString(locale, { hour:"2-digit", minute:"2-digit", second:"2-digit" });

  return (
    <div className="weather-bar">
      <div className="weather-bar-inner">
        <div className="weather-left">
          {weather ? (
            <>
              <span className="weather-icon">{weather.icon}</span>
              <span className="weather-city">{lang === "en" ? "Tashkent" : lang === "uzk" ? "Тошкент" : "Toshkent"}</span>
              <span className="weather-temp">{weather.temp}°C</span>
              <span className="weather-desc">{weather.desc}</span>
              <span className="weather-wind">💨 {weather.wind} km/h</span>
            </>
          ) : (
            <span className="weather-loading">🌡 {isUz ? "Yuklanmoqda..." : "Loading..."}</span>
          )}
        </div>
        <div className="weather-right">
          <span className="wdate-dot">
            <span className="wdate-part">{dd}</span>
            <span className="wdate-sep">.</span>
            <span className="wdate-part">{mm}</span>
            <span className="wdate-sep">.</span>
            <span className="wdate-part">{yyyy}</span>
          </span>
          <span className="weather-time">{timeStr}</span>
        </div>
      </div>
    </div>
  );
}

function Hero({ t, lang, hero, gridStories, latestStories, getDisplayCat, openStory, onLoadMore }) {
  const getStoryTime = (s) => {
    if (!s) return "";
    return s.time || s.date || "";
  };

  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-left-block">
          <div className="hero-block-header">
            <span className="dot"></span>
            <h2>{t.home || "Bosh sahifa"}</h2>
          </div>
          
          {hero && (
            <a className="hero-main" href={`/?story=${hero.id}`} onClick={(e) => { e.preventDefault(); window.history.pushState(null, "", "/?story=" + hero.id); openStory(hero); }} style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
              <div className="hero-main-content">
                <div className="hero-main-meta-top" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span className="kicker">{getDisplayCat ? getDisplayCat(hero.category) : hero.category}</span>
                  {hero.isBreaking && <span className="story-badge breaking" style={{ background: "var(--accent-red)", color: "#fff", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>🔴 TEZKOR</span>}
                  {calcReadTime(hero.body || hero.summary, lang) && (
                    <span className="hero-read-time" style={{ fontSize: "12px", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {calcReadTime(hero.body || hero.summary, lang)}
                    </span>
                  )}
                </div>
                <h1>{hero.title}</h1>
                <p>{hero.summary}</p>
                <div className="hero-meta-bottom" style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", fontSize: "12px", color: "var(--muted)" }}>
                  {getStoryTime(hero) && (
                    <span className="hero-time" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {getStoryTime(hero)}
                    </span>
                  )}
                  {(hero.views || 0) > 0 && (
                    <span className="hero-views" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      {hero.views}
                    </span>
                  )}
                </div>
              </div>
              {hero.image && (
                <div className="hero-main-thumb">
                  <img src={hero.image} alt={hero.title} />
                </div>
              )}
            </a>
          )}

          {gridStories && gridStories.length > 0 && (
            <div className="hero-sub-grid">
              {gridStories.map((story, idx) => (
                <a
                  className="hero-sub-card"
                  href={`/?story=${story.id}`}
                  key={`${story.id || story.title}-${idx}`}
                  onClick={(e) => { e.preventDefault(); window.history.pushState(null, "", "/?story=" + story.id); openStory(story); }}
                  style={{ textDecoration: "none", color: "inherit", display: "flex", border: "none", background: "transparent", textAlign: "left", cursor: "pointer" }}
                >
                  {story.image && (
                    <div className="side-thumb">
                      <img src={story.image} alt={story.title} />
                    </div>
                  )}
                  <span className="side-copy">
                    <span className="kicker-small">{getDisplayCat ? getDisplayCat(story.category) : story.category}</span>
                    <h3>{story.title}</h3>
                    {getStoryTime(story) && (
                      <span className="sub-card-time" style={{ fontSize: "11px", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "3px", marginTop: "4px" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {getStoryTime(story)}
                      </span>
                    )}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="hero-right-block">
          <div className="hero-block-header">
            <span className="dot"></span>
            <h2>{t.latest || 'So\'nggi yangiliklar'}</h2>
          </div>
          
          <div className="hero-latest-list">
            {latestStories && latestStories.length > 0 ? (
              latestStories.map((story, idx) => (
                <a
                  className="hero-latest-card"
                  href={`/?story=${story.id}`}
                  key={`${story.id || story.title}-${idx}`}
                  onClick={(e) => { e.preventDefault(); window.history.pushState(null, "", "/?story=" + story.id); openStory(story); }}
                  style={{ textDecoration: "none", color: "inherit", display: "flex", border: "none", background: "transparent", textAlign: "left", cursor: "pointer" }}
                >
                  <span className="latest-copy">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span className="kicker-small">{getDisplayCat ? getDisplayCat(story.category) : story.category}</span>
                      {getStoryTime(story) && (
                        <span style={{ fontSize: "11px", color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {getStoryTime(story)}
                        </span>
                      )}
                    </div>
                    <h3>{story.title}</h3>
                  </span>
                  {story.image && (
                    <div className="latest-thumb">
                      <img src={story.image} alt={story.title} />
                    </div>
                  )}
                </a>
              ))
            ) : (
              <p style={{ padding: "20px 0", color: "var(--muted)", fontSize: "14px", margin: 0 }}>
                {t.empty || "Hozircha yangiliklar yo'q"}
              </p>
            )}
          </div>
          <button className="more-news-btn" onClick={onLoadMore}>{t.moreNews || T("Ko'proq yangiliklar")}</button>
        </div>
      </div>
    </section>
  );
}

function StoryBadge({ story }) {
  if (!story) return null;
  if (story.isBreaking) return <span className="story-badge breaking">🔴 TEZKOR</span>;
  if (story.isFeatured) return <span className="story-badge featured" style={{ background: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>⭐ ASOSIY</span>;
  if (story.isEditorChoice || story.isEditorPick) return <span className="story-badge editor">⭐ MUHARRIR</span>;
  if ((story.views || 0) > 50) return <span className="story-badge trend">🔥 TREND</span>;
  return null;
}

function calcReadTime(text, lang) {
  if (!text) return null;
  const words = text.replace(/<[^>]+>/g,"").split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return lang === "en" ? `${mins} min` : `${mins} daq`;
}

function StoryCard({ story, onOpen, featured = false, savedIds = [], onToggleSave }) {
  const isSaved = savedIds.includes(story.id);
  return (
    <article className={`story-card fade-in-up ${featured ? "featured-story" : ""}`} style={{position:"relative"}}>
      <StoryBadge story={story} />
      <a href={`/?story=${story.id}`} onClick={(e) => { e.preventDefault(); window.history.pushState(null, "", "/?story=" + story.id); if (onOpen) onOpen(); }} style={{ textDecoration: 'none', color: 'inherit', display: 'block', border: 'none', background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer' }}>
        <img className="story-image" src={story.image} alt="" loading="lazy" />
        <div className="story-body">
          <span className="category" data-cat={story.category}>{story.category}</span>
          <h3>{story.title}</h3>
          <p>{story.summary}</p>
          <div className="story-footer">
            
            {(story.views || 0) > 0 && <span className="story-views">👁 {story.views}</span>}
          </div>
        </div>
      </a>
      {onToggleSave && (
        <button
          className={`bookmark-corner ${isSaved ? "saved" : ""}`}
          onClick={e => { e.stopPropagation(); onToggleSave(story.id); }}
          title={isSaved ? T("Saqlangandan olib tashlash") : T("Saqlash")}
        >{isSaved ? "в˜…" : "в˜†"}</button>
      )}
    </article>
  );
}

function Sidebar({ t, stories, onOpen, ads }) {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [history] = React.useState(() => JSON.parse(localStorage.getItem("yk-history") || "[]"));
  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    } catch (error) {
    }
  }
  return (
    <aside className="sidebar">
      <div className="panel">
        <h3>{t.popular}</h3>
        {[...stories].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((story, index) => (
          <a className="trend" href={`/?story=${story.id}`} key={story.id} onClick={(e) => { e.preventDefault(); window.history.pushState(null, "", "/?story=" + story.id); if (onOpen) onOpen(story); }} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: "12px", width: "100%", border: 0, background: "transparent", textAlign: "left", cursor: "pointer", padding: "12px 0", borderTop: index === 0 ? 0 : "1px solid var(--line)", textDecoration: "none" }}>
            <span className="trend-num">{index + 1}</span>
            <span>
              <strong style={{ display: "block", lineHeight: "1.28", color: "var(--ink)" }}>{story.title}</strong>
              <small style={{ color: "var(--muted)" }}>{story.category}</small>
            </span>
          </a>
        ))}
      </div>
      <div className="panel newsletter">
        <h3>{t.newsletterTitle}</h3>
        <p>{t.newsletterText}</p>
        {subscribed ? (
          <p style={{ color: "#4ade80", fontWeight: 700, margin: "8px 0 0" }}>✓ Muvaffaqiyatli obuna bo'ldingiz!</p>
        ) : (
          <form onSubmit={handleSubscribe}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder={t.email} type="email" />
            <button className="primary" type="submit" style={{ width: "100%", marginTop: "2px" }}>{t.subscribe}</button>
          </form>
        )}
      </div>

      <div className="panel ai-recommend-panel">
        <div className="ai-panel-head">
          <span className="ai-badge">AI</span>
          <h3>{T("Siz uchun tavsiyalar")}</h3>
        </div>
        <p className="ai-panel-sub">{t.close === "Yopish" ? "O'qish tarixingiz asosida" : "Based on reading history"}</p>
        {(() => {
          const historyIds = JSON.parse(localStorage.getItem("yk-history") || "[]").map(h => h.id);
          const readCats = JSON.parse(localStorage.getItem("yk-history") || "[]").map(h => h.category);
          const topCat = readCats.length ? readCats.sort((a,b) => readCats.filter(c=>c===b).length - readCats.filter(c=>c===a).length)[0] : null;
          const recommended = topCat
            ? stories.filter(s => s.category === topCat && !historyIds.includes(s.id)).slice(0, 4)
            : stories.filter(s => (s.views||0) > 0).sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,4);
          const fallback = stories.slice(0,4);
          const list = recommended.length ? recommended : fallback;
          return list.map((s, i) => (
            <button key={s.id} className="ai-rec-item" onClick={() => onOpen && onOpen(s)}
              style={{borderTop: i === 0 ? 0 : "1px solid var(--line)"}}>
              <img src={s.image} alt="" loading="lazy" />
              <div>
                <span className="ai-rec-cat">{s.category}</span>
                <p>{s.title}</p>
              </div>
            </button>
          ));
        })()}
        {(() => {
          const h = JSON.parse(localStorage.getItem("yk-history")||"[]").map(x=>x.category);
          const top = h.length ? h.sort((a,b)=>h.filter(c=>c===b).length-h.filter(c=>c===a).length)[0] : null;
          return top ? (
            <div className="ai-panel-tag">
              <span>🎯</span>
              {T("Ko'p o'qiysiz: ")}
              <strong>{top}</strong>
            </div>
          ) : null;
        })()}
      </div>
      <AdBanner ads={ads} position="sidebar" />
    </aside>
  );
}

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = parseInt(target);
    if (isNaN(num)) { setCount(target); return; }
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(num / (duration / 16));
      const timer = setInterval(() => {
        start += step;
        if (start >= num) { setCount(target); clearInterval(timer); }
        else setCount(start + (target.includes("+") ? "+" : ""));
      }, 16);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return [count, ref];
}

function StatNum({ value }) {
  const [count, ref] = useCountUp(String(value));
  return <strong ref={ref} className="counter-num">{count || value}</strong>;
}

function Special({ t, siteConfig }) {
  const currentLang = window.__currentLang || "uz";
  const isUz = currentLang !== "en";

  const sp = (siteConfig && siteConfig.specialProject) ? siteConfig.specialProject : {};
  if (sp.isActive === false) return null;

  const design = sp.design || "classic";

  const kicker   = sp.kicker || t.specialKicker || T(isUz ? "Maxsus loyiha" : "Special Project");
  const title    = sp.title || t.specialTitle || T(isUz ? "Ma'lumotga tayangan jurnalistika: voqeani shovqindan ajratamiz" : "Data journalism: separating events from noise");
  const text     = sp.text || t.specialText || T(isUz ? "Vatanuz.uz tahririyati siyosat, iqtisod, texnologiya, sport va madaniyatdagi muhim jarayonlarni ravon tilda tushuntiradi." : "Vatanuz.uz explains important processes in clear language.");
  const badge    = sp.badge || t.specialBadge || T(isUz ? "Jonli tahririyat" : "Live Newsroom");
  const imgSrc   = sp.image || images.newsroom;
  
  const featuresStr = sp.features || t.specialFeatures || (isUz ? "Tezkor yangiliklar, Mustaqil tahlil, Ikki tilda, Ishonchli manba" : "Fast news, Independent analysis, Bilingual, Reliable source");
  const features = featuresStr.split(",").map(f => f.trim()).filter(Boolean);

  const stats = [
    { num: sp.stat1Num || t.stat1Num || "24/7", label: sp.stat1Label || t.stat1Label || T(isUz ? "Monitoring" : "Monitoring") },
    { num: sp.stat2Num || t.stat2Num || "7",    label: sp.stat2Label || t.stat2Label || T(isUz ? "Bo'lim" : "Sections") },
    { num: sp.stat3Num || t.stat3Num || "2",    label: sp.stat3Label || t.stat3Label || T(isUz ? "Til" : "Languages") },
    { num: sp.stat4Num || t.stat4Num || "100+", label: sp.stat4Label || t.stat4Label || T(isUz ? "Maqola" : "Articles") },
  ];

  return (
    <section className={"special-section special-design-" + design}>
      <div className="special-bg-grid" />
      <div className="special-inner">
        <div className="special-left">
          <span className="special-kicker">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6}}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            {kicker}
          </span>
          <h2 className="special-title">{title}</h2>
          <p className="special-desc">{text}</p>
          <div className="special-features">
            {features.map((f) => (
              <span key={f} className="special-feature-tag">
                <span className="special-dot" />
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="special-right">
          <div className="special-img-wrap">
            <img src={imgSrc} alt="" className="special-img" />
            <div className="special-img-overlay" />
            <div className="special-img-badge">
              <span className="live-dot" />
              {badge}
            </div>
          </div>
          <div className="special-stats">
            {stats.map((s) => (
              <div key={s.num + s.label} className="special-stat fade-in-up">
                <StatNum value={s.num} />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactPage({ t, page, siteConfig }) {
  const contactEmail = siteConfig?.contact?.email || siteConfig?.email || "vatankont@gmail.com";
  return (
    <main className="section">
      <div className="section-inner">
        <div className="section-head">
          <div>
            <h2 className="section-title">{page}</h2>
            <p className="section-note">{t.pageNotes[page]}</p>
          </div>
        </div>
        <div className="contact-grid">
          {t.contact.map(([title, text], i) => (
            <div className="contact-card" key={title}>
              <strong>{title}</strong>
              <p>{text}{i === 0 ? contactEmail : ""}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function HeroSkeleton() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-left-block">
          <div className="hero-block-header">
            <span className="dot"></span>
            <div className="skeleton-line skeleton-anim" style={{ width: 140, height: 22 }} />
          </div>
          <div className="hero-main skeleton-card" style={{ cursor: "default" }}>
            <div className="hero-main-content">
              <div className="skeleton-line skeleton-anim" style={{ width: 90, height: 14, marginBottom: 12 }} />
              <div className="skeleton-line skeleton-anim" style={{ width: "95%", height: 30, marginBottom: 10 }} />
              <div className="skeleton-line skeleton-anim" style={{ width: "80%", height: 30, marginBottom: 14 }} />
              <div className="skeleton-line skeleton-anim" style={{ width: "90%", height: 16, marginBottom: 8 }} />
              <div className="skeleton-line skeleton-anim" style={{ width: "65%", height: 16 }} />
            </div>
            <div className="hero-main-thumb">
              <div className="skeleton-img skeleton-anim" style={{ width: "100%", height: "100%", minHeight: 240, borderRadius: 12 }} />
            </div>
          </div>
          <div className="hero-sub-grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div className="hero-sub-card skeleton-card" key={idx} style={{ display: "flex", gap: 12, cursor: "default" }}>
                <div className="side-thumb">
                  <div className="skeleton-img skeleton-anim" style={{ width: 100, height: 75, borderRadius: 8 }} />
                </div>
                <span className="side-copy" style={{ flex: 1 }}>
                  <div className="skeleton-line skeleton-anim" style={{ width: 60, height: 12, marginBottom: 8 }} />
                  <div className="skeleton-line skeleton-anim" style={{ width: "92%", height: 15, marginBottom: 6 }} />
                  <div className="skeleton-line skeleton-anim" style={{ width: "70%", height: 15 }} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-right-block">
          <div className="hero-block-header">
            <span className="dot"></span>
            <div className="skeleton-line skeleton-anim" style={{ width: 160, height: 22 }} />
          </div>
          <div className="hero-latest-list">
            {Array.from({ length: 7 }).map((_, idx) => (
              <div className="hero-latest-card skeleton-card" key={idx} style={{ display: "flex", gap: 12, cursor: "default" }}>
                <span className="latest-copy" style={{ flex: 1 }}>
                  <div className="skeleton-line skeleton-anim" style={{ width: 50, height: 12, marginBottom: 6 }} />
                  <div className="skeleton-line skeleton-anim" style={{ width: "92%", height: 14, marginBottom: 4 }} />
                  <div className="skeleton-line skeleton-anim" style={{ width: "75%", height: 14 }} />
                </span>
                <div className="latest-thumb">
                  <div className="skeleton-img skeleton-anim" style={{ width: 70, height: 55, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkeletonCard() {
  return (
    <article className="story-card skeleton-card">
      <div className="skeleton-img skeleton-anim" />
      <div className="story-body">
        <div className="skeleton-line skeleton-anim" style={{width:"40%",height:14,marginBottom:8}} />
        <div className="skeleton-line skeleton-anim" style={{width:"90%",height:18,marginBottom:6}} />
        <div className="skeleton-line skeleton-anim" style={{width:"75%",height:18,marginBottom:12}} />
        <div className="skeleton-line skeleton-anim" style={{width:"60%",height:13}} />
      </div>
    </article>
  );
}

function AuthorPage({ author, stories, lang, onOpen, onBack, savedIds, onToggleSave }) {
  const authorStories = stories.filter(s => (s.author || "Vatanuz.uz tahririyati") === author);
  const initials = author.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const isUz = lang !== "en";
  return (
    <main className="section">
      <div className="section-inner">
        <button className="article-back-btn" onClick={onBack} style={{marginBottom:24}}>
          <span>&#8592;</span> {isUz ? "Orqaga" : "Back"}
        </button>
        <div className="author-page-header">
          <div className="author-page-avatar">{initials}</div>
          <div>
            <h1 className="author-page-name">{author}</h1>
            <p className="author-page-count">{authorStories.length} {isUz ? "ta maqola" : "articles"}</p>
          </div>
        </div>
        <div className="stories-grid" style={{marginTop:32}}>
          {authorStories.length === 0 ? (
            <p style={{color:"var(--muted)"}}>{isUz ? "Maqolalar topilmadi" : "No articles found"}</p>
          ) : authorStories.map(story => (
            <StoryCard lang={lang} key={story.id} story={story} savedIds={savedIds} onToggleSave={onToggleSave}
              onOpen={() => onOpen(story)} />
          ))}
        </div>
      </div>
    </main>
  );
}

function TagPage({ tag, stories, lang, onOpen, onBack, savedIds, onToggleSave }) {
  const cleanStr = (str) => (str || "").replace(/^[#\s]+|[#\s]+$/g, "").toLowerCase().trim();
  const targetTag = cleanStr(tag);
  
  const tagStories = (stories || []).filter(s => {
    if (!s || !s.tags) return false;
    const sTags = (Array.isArray(s.tags) ? s.tags : s.tags.split(/[,;\n]+/))
      .map(cleanStr)
      .filter(Boolean);
    return sTags.some(t => t === targetTag || t.includes(targetTag) || targetTag.includes(t));
  });
  
  const isUz = lang === "uz";
  const isUzk = lang === "uzk";
  const backText = isUz ? "Orqaga" : (isUzk ? "Орқага" : "Back");
  const countText = isUz ? "ta maqola" : (isUzk ? "та мақола" : "articles");
  const emptyText = isUz ? "Ushbu teg bo'yicha maqolalar topilmadi" : (isUzk ? "Ушбу тег бўйича мақолалар топилмади" : "No articles found for this tag");

  return (
    <main className="section">
      <div className="section-inner">
        <button className="article-back-btn" onClick={onBack} style={{marginBottom:24}}>
          <span>&#8592;</span> {backText}
        </button>
        <div className="section-head">
          <div>
            <h2 className="section-title">🏷️ #{tag ? tag.replace(/^[#\s]+/, '') : ''}</h2>
            <p className="section-note">{tagStories.length} {countText}</p>
          </div>
        </div>
        <div className="stories-grid" style={{marginTop:24}}>
          {tagStories.length === 0 ? (
            <p style={{color:"var(--muted)", padding:"24px 0"}}>{emptyText}</p>
          ) : tagStories.map(story => (
            <StoryCard lang={lang} key={story.id} story={story} savedIds={savedIds} onToggleSave={onToggleSave}
              onOpen={() => onOpen(story)} />
          ))}
        </div>
      </div>
    </main>
  );
}

function ArticlePage({ lang, t, story, stories, ads, getDisplayCat, savedIds, onToggleSave, copiedShare, setCopiedShare, onClose, onOpen, onView, reactions, addReaction, onAuthorClick, onTagClick }) {
  const initials = (story.author || "YK").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const isHtml = story.body && /<[a-z]/.test(story.body);
  const paragraphs = isHtml ? [] : (story.body || story.summary || "").split("\n\n").filter(Boolean);
  const related = stories.filter(s => s.id !== story.id && s.category === story.category).slice(0, 3);
  const more = stories.filter(s => s.id !== story.id && s.category !== story.category).slice(0, 3);
  const readMore = related.length ? related : more;
  const parseTags = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str.map(t => String(t).replace(/^[#\s]+|[#\s]+$/g, '').trim()).filter(Boolean);
    return String(str)
      .split(/[,;\n]+/)
      .map(t => t.replace(/^[#\s]+|[#\s]+$/g, '').trim())
      .filter(Boolean);
  };
  const tags = parseTags(story.tags);
  const [readProgress, setReadProgress] = useState(0);
  const [comments, setComments] = useState([]);
  const [localViews, setLocalViews] = useState(story.views || 0);
  
  useEffect(() => {
    fetch(`/api/comments/${story.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          // Sort latest first
          setComments(data.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      })
      .catch(console.error);
      
    // Increment views
    const viewedKey = `viewed_${story.id}`;
    if (!localStorage.getItem(viewedKey)) {
      localStorage.setItem(viewedKey, "true");
      fetch(`/api/${lang}/${story.id}/view`, { 
        method: 'POST',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      })
        .then(res => {
          if (res.ok) {
            setLocalViews(prev => prev + 1);
            if (typeof onView === 'function') onView(story.id);
          } else {
            localStorage.removeItem(viewedKey);
          }
        })
        .catch(err => {
          console.error(err);
          localStorage.removeItem(viewedKey);
        });
    }
  }, [story.id, lang]);

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentSent, setCommentSent] = useState(false);
  const isUz = lang !== "en";
  const [cleanRead, setCleanRead] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const readTime = calcReadTime((story.body || story.summary || ""), t.close !== "Yopish" ? "ru" : "uz");
  // Table of contents (h2 headings dan)
  const headings = isHtml ? Array.from(new DOMParser().parseFromString(story.body,"text/html").querySelectorAll("h2")).map(h=>h.textContent) : [];
  // Swipe navigation
  const storyIndex = stories.findIndex(s => s.id === story.id);
  const prevStory = storyIndex > 0 ? stories[storyIndex - 1] : null;
  const nextStory = storyIndex < stories.length - 1 ? stories[storyIndex + 1] : null;
  const touchRef = useRef(null);
  useEffect(() => {
    function onTouchStart(e) { touchRef.current = e.touches[0].clientX; }
    function onTouchEnd(e) {
      if (touchRef.current === null) return;
      const diff = touchRef.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0 && nextStory) { onOpen(nextStory); window.scrollTo({top:0,behavior:"instant"}); }
        if (diff < 0 && prevStory) { onOpen(prevStory); window.scrollTo({top:0,behavior:"instant"}); }
      }
      touchRef.current = null;
    }
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => { document.removeEventListener("touchstart", onTouchStart); document.removeEventListener("touchend", onTouchEnd); };
  }, [nextStory, prevStory]);

  useEffect(() => {
    if (onView) onView(story.id);
    const history = JSON.parse(localStorage.getItem("yk-history") || "[]");
    const filtered = history.filter(h => h.id !== story.id);
    const updated = [{ id: story.id, title: story.title, image: story.image, category: story.category, time: story.time }, ...filtered].slice(0, 15);
    localStorage.setItem("yk-history", JSON.stringify(updated));
  }, [story.id]);

  useEffect(() => {
    document.title = `${story.title} — Vatanuz.uz`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = story.summary || "";
    let og = document.querySelector('meta[property="og:title"]');
    if (!og) { og = document.createElement('meta'); og.setAttribute('property','og:title'); document.head.appendChild(og); }
    og.content = story.title;
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (!ogImg) { ogImg = document.createElement('meta'); ogImg.setAttribute('property','og:image'); document.head.appendChild(ogImg); }
    ogImg.content = story.image || "";
    return () => { document.title = "Vatanuz.uz"; };
  }, [story.id]);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setReadProgress(total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      const res = await fetch(`/api/comments/${story.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: commentName.trim() || (isUz ? "Mehmon" : "Guest"),
          text: commentText.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setComments([data.data, ...comments]);
      } else {
        throw new Error(data.message || "Failed to post comment");
      }
    } catch(err) {
      // Fallback update UI anyway in case of network issue
      const newComment = {
        id: Date.now(),
        name: commentName.trim() || (isUz ? "Mehmon" : "Guest"),
        text: commentText.trim(),
        createdAt: new Date().toISOString()
      };
      setComments([newComment, ...comments]);
    }
    
    setCommentText("");
    setCommentName("");
    setCommentSent(true);
    setTimeout(() => setCommentSent(false), 3000);
  }

  return (
    <div className={`article-page ${cleanRead ? "clean-read-active" : ""}`}>
      <div className="read-progress-bar" style={{width: readProgress + "%"}} />
      <div className="article-page-inner">

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <button className="article-back-btn" onClick={onClose} style={{ margin: 0 }}>
            <span>&#8592;</span> {lang === "uz" ? "Orqaga" : (lang === "uzk" ? "Орқага" : "Back")}
          </button>
          
          <button 
            className="clean-read-btn"
            onClick={() => setCleanRead(!cleanRead)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              border: "1px solid var(--line)",
              background: cleanRead ? "var(--brand)" : "var(--fill)",
              color: cleanRead ? "#fff" : "var(--ink)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {cleanRead 
              ? (lang === "uz" ? "👓 Standart o'qish" : (lang === "uzk" ? "👓 Стандарт ўқиш" : "👓 Normal view"))
              : (lang === "uz" ? "👓 Toza o'qish" : (lang === "uzk" ? "👓 Тоза ўқиш" : "👓 Clean read"))
            }
          </button>
        </div>

        <article className="article-full"><div className="article-page-content">
          {/* Breadcrumbs */}
          <div className="article-breadcrumbs" style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
            {lang === "uz" ? "Bosh sahifa" : (lang === "uzk" ? "Бош саҳифа" : "Home")} &gt; {getDisplayCat(story.category)}
          </div>

          {/* Title */}
          <h1 className="article-main-title" style={{ fontSize: "28px", fontWeight: "800", color: "var(--ink)", lineHeight: "1.3", marginBottom: "12px", fontFamily: "inherit" }}>
            {story.title}
          </h1>

          {/* Lead / Subtitle */}
          {story.summary && (
            <p className="article-main-lead" style={{ fontSize: "16px", color: "var(--muted)", lineHeight: "1.5", marginBottom: "20px", fontWeight: "500" }}>
              {story.summary}
            </p>
          )}

          {/* Meta Bar */}
          <div className="article-meta-bar" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 16px", background: "var(--fill)", borderRadius: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "500" }}>
              {getDisplayCat(story.category)} | {story.time && story.time.toLowerCase() !== "bugun" && story.time.toLowerCase() !== "бугун" ? story.time + " / " : ""}{story.date || "07.07.2026"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginLeft: "auto" }}>
              <span style={{ fontSize: "14px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                {localViews || 0}
              </span>
              {(!story.category || (!story.category.toLowerCase().includes("video") && !story.category.toLowerCase().includes("видео"))) && !story.videoUrl && (
                <span style={{ fontSize: "14px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {lang === "uz" ? `${story.read || 3} daqiqada o'qiladi` : (lang === "uzk" ? `${story.read || 3} дақиқада ўқилади` : `${story.read || 3} min read`)}
                </span>
              )}
            </div>
          </div>

          {/* Inline Hero Image */}
          {story.image && (
            <div className="article-inline-image-wrap" style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
              <img src={story.image} alt={story.title} style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          )}

          <div>
            {headings.length > 1 && (
              <nav className="toc-box">
                <strong className="toc-title">{isUz ? "📋 Mundarija" : "📋 Table of Contents"}</strong>
                <ol className="toc-list">
                  {headings.map((h, i) => (
                    <li key={i}><a href={`#heading-${i}`} className="toc-link">{h}</a></li>
                  ))}
                </ol>
              </nav>
            )}

            {story.videoUrl && (
              <>
                <div className="article-video" style={{ margin: "20px 0 8px 0", borderRadius: "8px", overflow: "hidden", aspectRatio: "16/9" }}>
                  <iframe width="100%" height="100%" src={getYouTubeEmbedUrl(story.videoUrl)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
                {story.videoUrl.includes('youtu') && (
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <a href={story.videoUrl} target="_blank" rel="noreferrer" style={{ fontSize: "14px", color: "var(--brand)", textDecoration: "underline" }}>
                      {lang === "uz" ? "Videoni Youtubeda ko'rish" : (lang === "uzk" ? "Видеолани Ютубда кўриш" : "Watch video on YouTube")}
                    </a>
                  </div>
                )}
              </>
            )}

            <AdBanner ads={ads} position="article_inline" />

            <div className="article-body-text">
              {isHtml
                ? <div dangerouslySetInnerHTML={{__html: story.body}} />
                : paragraphs.length > 1
                  ? paragraphs.map((para, i) => <p key={i}>{para}</p>)
                  : <p>{story.body || story.summary}</p>}
            </div>

            {/* Fotogalereya (Photo Gallery) */}
            {story.category === "photo" && story.images && story.images.length > 0 && (
              <div style={{ marginTop: "40px", borderTop: "2px solid var(--line)", paddingTop: "32px", paddingBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "28px", fontWeight: "800", color: "var(--ink)", letterSpacing: "-0.5px" }}>
                    {lang === "en" ? "Photo Gallery" : "Fotogalereya"}
                  </h3>
                  <span style={{ fontSize: "16px", color: "var(--muted)", fontWeight: "500", background: "var(--fill)", padding: "4px 12px", borderRadius: "20px" }}>
                    {story.images.length} {lang === "en" ? "photos" : "ta rasm"}
                  </span>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", gridAutoRows: "280px" }}>
                  {story.images.map((img, i) => {
                    const isFeatured = (i % 5 === 0) && story.images.length > 2;
                    return (
                      <div 
                        key={i} 
                        onClick={() => setLightboxIndex(i)} 
                        style={{ 
                          gridColumn: isFeatured ? "1 / -1" : "auto", 
                          gridRow: isFeatured ? "span 2" : "span 1", 
                          borderRadius: "16px", 
                          overflow: "hidden", 
                          cursor: "pointer", 
                          position: "relative",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          background: "#000"
                        }}
                      >
                        <img 
                          src={img} 
                          alt={`Gallery ${i+1}`} 
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s" }} 
                          onMouseOver={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.opacity = "0.9"; }} 
                          onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }} 
                        />
                        <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 8px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", backdropFilter: "blur(4px)" }}>
                          ⛶
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}




            {addReaction && (() => {
              const storyReactions = reactions[story.id] || {};
              const myReaction = storyReactions._mine;
              const emojis = ["👍", "❤️", "😮", "😂", "😢"];
              return (
                <div className="reactions-row">
                  <span className="reactions-label">{lang === "uz" ? "Fikr bildiring:" : (lang === "uzk" ? "Фикр билдиринг:" : "Reaction:")}</span>
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      className={`reaction-btn ${myReaction === emoji ? "active" : ""}`}
                      onClick={() => addReaction(story.id, emoji)}
                    >
                      {emoji}
                      {storyReactions[emoji] > 0 && <span className="reaction-count">{storyReactions[emoji]}</span>}
                    </button>
                  ))}
                </div>
              );
            })()}

            {tags && tags.length > 0 && (
              <div className="article-tags-bottom" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginTop: "24px", marginBottom: "24px" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--muted)", marginRight: "4px" }}>
                  {lang === "uz" ? "Teglar:" : (lang === "uzk" ? "Теглар:" : "Tags:")}
                </span>
                {tags.map((tag, i) => (
                  <button
                    key={i}
                    type="button"
                    className="article-tag-item"
                    onClick={() => {
                      if (onTagClick) {
                        onTagClick(tag);
                      }
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            <div className="article-share">
              <span className="article-share-label">{lang === "uz" ? "Ulashish:" : (lang === "uzk" ? "Улашиш:" : "Share:")}</span>
              {(() => {
                const shareUrl = `${window.location.origin}/news/${story.id}`;
                return (
                  <>
                    <a
                      className="share-btn telegram"
                      href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(story.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >✈️ Telegram</a>
                    <button
                      className={`share-btn ${copiedShare ? "copied" : ""}`}
                      onClick={() => {
                        const copyText = (text) => {
                          if (navigator.clipboard && window.isSecureContext) {
                            navigator.clipboard.writeText(text);
                          } else {
                            const textArea = document.createElement("textarea");
                            textArea.value = text;
                            textArea.style.position = "fixed";
                            textArea.style.left = "-999999px";
                            document.body.appendChild(textArea);
                            textArea.focus();
                            textArea.select();
                            try { document.execCommand('copy'); } catch(e) {}
                            textArea.remove();
                          }
                        };
                        copyText(shareUrl);
                        setCopiedShare(true);
                        setTimeout(() => setCopiedShare(false), 2000);
                      }}
                    >{copiedShare 
                      ? (lang === "uz" ? "✓ Nusxalandi" : (lang === "uzk" ? "✓ Нусхаланди" : "✓ Copied")) 
                      : (lang === "uz" ? "🔗 Havola" : (lang === "uzk" ? "🔗 Ҳавола" : "🔗 Link"))
                    }</button>
                  </>
                );
              })()}
              <button
                className={`bookmark-btn ${savedIds.includes(story.id) ? "saved" : ""}`}
                onClick={() => onToggleSave && onToggleSave(story.id)}
              >{savedIds.includes(story.id) ? "★ Saqlangan" : "☆ Saqlash"}</button>
              <button className="share-btn" onClick={() => window.print()}>🖨️ {lang === "uz" ? "Chop etish" : (lang === "uzk" ? "Чоп этиш" : "Print")}</button>
            </div>
          </div>
        </div>
        </article>

        <AdBanner ads={ads} position="bottom" />

        {readMore.length > 0 && (
          <section className="article-related">
            <h2 className="section-title">{lang === "uz" ? "O'xshash maqolalar" : (lang === "uzk" ? "Ўхшаш мақолалар" : "Related articles")}</h2>
            <div className="article-related-grid">
              {readMore.map(s => (
                <article key={s.id} className="story-card">
                  <button onClick={() => onOpen(s)}>
                    <img className="story-image" src={s.image} alt="" loading="lazy" />
                    <div className="story-body">
                      <span className="category" data-cat={s.category}>{s.category}</span>
                      <h3>{s.title}</h3>
                      <p>{s.summary}</p>
                      <div className="story-footer">
                        <span>{s.time}</span>
                        <span>{s.read}</span>
                      </div>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="comments-section">
          <h2 className="section-title">
            💬 {T("Izohlar")}
            {comments.length > 0 && <span className="comments-count">{comments.length}</span>}
          </h2>

          <form className="comment-form" onSubmit={submitComment}>
            <input
              className="comment-input"
              placeholder={lang === "uz" ? "Ismingiz (ixtiyoriy)" : (lang === "uzk" ? "Исмингиз (ихтиёрий)" : "Your name (optional)")}
              value={commentName}
              onChange={e => setCommentName(e.target.value)}
              maxLength={60}
            />
            <textarea
              className="comment-textarea"
              placeholder={lang === "uz" ? "Fikringizni yozing..." : (lang === "uzk" ? "Фикрингизни ёзинг..." : "Write your comment...")}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              rows={3}
              maxLength={1000}
              required
            />
            <div className="comment-form-footer">
              {commentSent && (
                <span className="comment-sent">
                  ✓ {lang === "uz" ? "Izoh qo'shildi!" : (lang === "uzk" ? "Изоҳ қўшилди!" : "Comment added!")}
                </span>
              )}
              <button type="submit" className="adm-btn primary" style={{marginLeft:"auto"}}>
                {lang === "uz" ? "Yuborish" : (lang === "uzk" ? "Юбориш" : "Send")}
              </button>
            </div>
          </form>

          {comments.length === 0 ? (
            <div className="comments-empty">
              <span>💬</span>
              <p>{T("Hozircha izoh yo'q. Birinchi bo'ling!")}</p>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-avatar">{c.name[0].toUpperCase()}</div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <strong>{c.name}</strong>
                      <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString(isUz ? "uz-UZ" : "en-US") : c.date}</span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}



function MediaLibrary() {
  const [media, setMedia] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  const fetchMedia = () => {
    fetch('/api/admin/media', {
      headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.media) setMedia(data.media);
    }).catch(console.error);
  };

  React.useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = (files) => {
    if (!files.length) return;
    setUploading(true);
    
    // Process one by one for simplicity
    const uploadFile = async (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            await fetch('/api/admin/upload', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
              },
              body: JSON.stringify({ dataUrl: e.target.result })
            });
          } catch(err) {}
          resolve();
        };
        reader.readAsDataURL(file);
      });
    };

    const run = async () => {
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i]);
      }
      setUploading(false);
      fetchMedia();
    };
    run();
  };

  const handleDelete = async (filename) => {
    if (!confirm("Faylni o'chirishni tasdiqlaysizmi?")) return;
    try {
      const res = await fetch(`/api/admin/media/${filename}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      if (res.ok) fetchMedia();
    } catch(err) {
      alert("Xatolik");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>🖼️ Media Kutubxona</h2>
      </div>
      
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
        style={{ padding: "40px", border: "2px dashed var(--brand)", borderRadius: "12px", background: "rgba(0, 51, 160, 0.03)", textAlign: "center", cursor: "pointer" }}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.accept = "image/*,video/*";
          input.onchange = (e) => handleUpload(e.target.files);
          input.click();
        }}
      >
        <h3 style={{ color: "var(--brand)", fontSize: "18px", marginBottom: "8px" }}>Drag & Drop yoki fayllarni tanlang</h3>
        <p style={{ color: "var(--muted)", fontSize: "14px" }}>Ko'p fayl yuklash qo'llab-quvvatlanadi (Avto-o'lcham va WebP formatlash backend'da qilinadi)</p>
        {uploading && <div style={{ marginTop: "16px", fontWeight: "bold", color: "var(--brand)" }}>Yuklanmoqda... ⏳</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
        {media.map((file, i) => (
          <div key={i} style={{ background: "var(--surface)", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--line)", position: "relative" }}>
            {file.type === 'image' ? (
              <img src={file.url} style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }} />
            ) : (
              <video src={file.url} style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }} />
            )}
            <div style={{ padding: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{file.name}</span>
              <button onClick={() => handleDelete(file.name)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "bold" }}>🗑️</button>
            </div>
          </div>
        ))}
        {media.length === 0 && <p style={{ color: "var(--muted)" }}>Fayllar topilmadi.</p>}
      </div>
    </div>
  );
}

// Main Admin Panel Component registered on window

function AdminLanguages({ languages, setLanguages }) {
  const [newLang, setNewLang] = React.useState({ id: "", name: "", shortName: "" });
  const [editId, setEditId] = React.useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editId;
      const url = isEdit ? `/api/admin/languages/${editId}` : "/api/admin/languages";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` },
        body: JSON.stringify(newLang)
      });
      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setLanguages(languages.map(l => l.id === editId ? data.data : l));
        } else {
          setLanguages([...languages, data.data]);
        }
        setNewLang({ id: "", name: "", shortName: "" });
        setEditId(null);
        alert(isEdit ? "Til muvaffaqiyatli tahrirlandi!" : "Til muvaffaqiyatli qo'shildi!");
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleEdit = (lang) => {
    setEditId(lang.id);
    setNewLang({ id: lang.id, name: lang.name, shortName: lang.shortName });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/languages/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      if (res.ok) {
        setLanguages(languages.filter(l => l.id !== id));
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleToggleActive = async (lang) => {
    try {
      const updatedLang = { ...lang, isActive: lang.isActive === false ? true : false };
      const res = await fetch(`/api/admin/languages/${lang.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` 
        },
        body: JSON.stringify(updatedLang)
      });
      if (res.ok) {
        const data = await res.json();
        setLanguages(languages.map(l => l.id === lang.id ? data.data : l));
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>🌐 Tillar (Languages)</h2>
      
      <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>{editId ? "Tilni tahrirlash" : "Yangi til qo'shish"}</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <label className="adm-form-label">ID (masalan: ru, tr)</label>
            <input disabled={!!editId} required type="text" value={newLang.id} onChange={e => setNewLang({...newLang, id: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)", opacity: editId ? 0.5 : 1 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <label className="adm-form-label">To'liq nomi (masalan: Русский)</label>
            <input required type="text" value={newLang.name} onChange={e => setNewLang({...newLang, name: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <label className="adm-form-label">Qisqa nomi (masalan: Рус)</label>
            <input required type="text" value={newLang.shortName} onChange={e => setNewLang({...newLang, shortName: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }} />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="submit" style={{ padding: "10px 24px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", height: "42px" }}>{editId ? "Saqlash" : "Qo'shish"}</button>
            {editId && (
              <button type="button" onClick={() => {setEditId(null); setNewLang({id: "", name: "", shortName: ""})}} style={{ padding: "10px 24px", background: "var(--fill)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer", height: "42px" }}>Bekor qilish</button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--fill)", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "16px 24px" }}>ID</th>
              <th style={{ padding: "16px 24px" }}>To'liq Nomi</th>
              <th style={{ padding: "16px 24px" }}>Qisqa Nomi</th>
              <th style={{ padding: "16px 24px" }}>Holati</th>
              <th style={{ padding: "16px 24px", textAlign: "right" }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {languages.map(l => (
              <tr key={l.id} style={{ borderBottom: "1px solid var(--line)", opacity: l.isActive === false ? 0.6 : 1 }}>
                <td style={{ padding: "16px 24px", fontWeight: "700" }}>{l.id}</td>
                <td style={{ padding: "16px 24px" }}>{l.name}</td>
                <td style={{ padding: "16px 24px" }}>{l.shortName}</td>
                <td style={{ padding: "16px 24px" }}>
                  <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600", background: l.isActive !== false ? "#dcfce7" : "#f1f5f9", color: l.isActive !== false ? "#166534" : "#475569" }}>
                    {l.isActive !== false ? "Faol" : "Nofaol"}
                  </span>
                </td>
                <td style={{ padding: "16px 24px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => handleToggleActive(l)} style={{ padding: "6px 12px", background: l.isActive !== false ? "rgba(234, 179, 8, 0.1)" : "rgba(34, 197, 94, 0.1)", color: l.isActive !== false ? "#ca8a04" : "#16a34a", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    {l.isActive !== false ? "O'chirish" : "Yoqish"}
                  </button>
                  <button type="button" onClick={() => handleEdit(l)} style={{ padding: "6px 12px", background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", border: "none", borderRadius: "4px", cursor: "pointer" }}>Tahrirlash</button>
                  <button onClick={() => handleDelete(l.id)} style={{ padding: "6px 12px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", borderRadius: "4px", cursor: "pointer" }}>O'ch. yuborish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCategories({ categories, setCategories, languages }) {
  const [newCat, setNewCat] = React.useState({ slug: "", names: {} });
  const [editId, setEditId] = React.useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editId;
      const url = isEdit ? `/api/categories/${editId}` : "/api/categories";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` },
        body: JSON.stringify(newCat)
      });
      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setCategories(categories.map(c => c.id === editId ? data.data : c));
        } else {
          setCategories([...categories, data.data]);
        }
        setNewCat({ slug: "", names: {} });
        setEditId(null);
        alert(isEdit ? "Rukn muvaffaqiyatli tahrirlandi!" : "Rukn muvaffaqiyatli qo'shildi!");
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setNewCat({ slug: cat.slug, names: { ...cat.names } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>📁 Ruknlar (Categories)</h2>
      
      <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>{editId ? "Ruknni tahrirlash" : "Yangi rukn qo'shish"}</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label className="adm-form-label">Rukn Slug (URL uchun, masalan: jamiyat)</label>
            <input required type="text" value={newCat.slug} onChange={e => setNewCat({...newCat, slug: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
            {languages.map(l => (
              <div key={l.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label className="adm-form-label">Nomi ({l.name})</label>
                <input 
                  required 
                  type="text" 
                  value={newCat.names[l.id] || ""} 
                  onChange={e => setNewCat({ ...newCat, names: { ...newCat.names, [l.id]: e.target.value } })} 
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }} 
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", alignSelf: "flex-start" }}>
            <button type="submit" style={{ padding: "10px 24px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>{editId ? "Saqlash" : "Qo'shish"}</button>
            {editId && (
              <button type="button" onClick={() => {setEditId(null); setNewCat({ slug: "", names: {} })}} style={{ padding: "10px 24px", background: "var(--fill)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>Bekor qilish</button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--fill)", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "16px 24px" }}>Slug</th>
              {languages.map(l => (
                <th key={l.id} style={{ padding: "16px 24px" }}>{l.shortName}</th>
              ))}
              <th style={{ padding: "16px 24px", textAlign: "right" }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "16px 24px", fontWeight: "700" }}>{c.slug}</td>
                {languages.map(l => (
                  <td key={l.id} style={{ padding: "16px 24px" }}>{c.names && c.names[l.id] ? c.names[l.id] : "-"}</td>
                ))}
                <td style={{ padding: "16px 24px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => handleEdit(c)} style={{ padding: "6px 12px", background: "rgba(37, 99, 235, 0.1)", color: "#2563eb", border: "none", borderRadius: "4px", cursor: "pointer" }}>Tahrirlash</button>
                  <button onClick={() => handleDelete(c.id)} style={{ padding: "6px 12px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", borderRadius: "4px", cursor: "pointer" }}>O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminComments() {
  const [comments, setComments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/comments', {
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      const data = await res.json();
      if (res.ok) setComments(data.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Rostdan ham ushbu izohni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      if (res.ok) fetchComments();
    } catch (err) {
    }
  };

  return (
    <div style={{ background: "var(--fill)", borderRadius: "12px", border: "1px solid var(--line)" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--ink)" }}>Изоҳлар назорати</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "4px" }}>Ўқувчилар томонидан қолдирилган барча изоҳлар</p>
        </div>
        <button onClick={fetchComments} style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>
          🔄 Янгилаш
        </button>
      </div>
      <div style={{ padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>Yuklanmoqda...</div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)", border: "1px solid var(--line)", borderRadius: "8px" }}>Ҳозирча изоҳлар йўқ.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {comments.map(c => (
              <div key={c.id} style={{ border: "1px solid var(--line)", borderRadius: "8px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <strong style={{ color: "var(--ink)" }}>{c.name}</strong>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p style={{ color: "var(--ink)", marginBottom: "12px" }}>{c.text}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleDelete(c.id)} style={{ padding: "6px 12px", background: "rgba(220, 38, 38, 0.1)", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>O'chirish</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function AdminTags() {
  const [tags, setTags] = React.useState([]);
  const [newTag, setNewTag] = React.useState({ name: "" });
  const [editId, setEditId] = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/tags')
      .then(res => res.json())
      .then(data => {
        if(data && data.data) setTags(data.data);
      })
      .catch(console.error);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTag.name.trim()) return;
    try {
      const isEdit = !!editId;
      const url = isEdit ? `/api/tags/${editId}` : "/api/tags";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` },
        body: JSON.stringify(newTag)
      });
      if (res.ok) {
        const data = await res.json();
        if (isEdit) {
          setTags(tags.map(t => t.id === editId ? data.data : t));
        } else {
          setTags([...tags, data.data]);
        }
        setNewTag({ name: "" });
        setEditId(null);
        setShowForm(false);
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleEdit = (tag) => {
    setEditId(tag.id);
    setNewTag({ name: tag.name });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      if (res.ok) {
        setTags(tags.filter(t => t.id !== id));
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div className="admin-categories">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px" }}>Теглар</h2>
          <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "14px" }}>Мақолаларга тег бириктириш</p>
        </div>
        <button className="adm-btn primary" onClick={() => { setShowForm(!showForm); if(showForm){ setEditId(null); setNewTag({name:""}); } }}>
          {showForm ? "Yopish" : "+ Янги тег"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #eee" }}>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label className="adm-label">Тег номи</label>
              <input 
                className="adm-input" 
                placeholder="Masalan: Sport"
                value={newTag.name}
                onChange={e => setNewTag({ ...newTag, name: e.target.value })}
                required
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button type="submit" className="adm-btn primary">Saqlash</button>
            </div>
          </form>
        </div>
      )}

      {tags.length === 0 && !showForm ? (
        <div style={{ background: "white", padding: "60px 20px", borderRadius: "12px", border: "1px solid #eee", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>🏷️</div>
          <p style={{ color: "var(--muted)", marginBottom: "20px" }}>Теглар ҳали қўшилмаган</p>
          <button className="adm-btn primary" onClick={() => setShowForm(true)}>Биринчи тегни қўшиш</button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nomi</th>
                <th style={{ width: "100px", textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {tags.map(tag => (
                <tr key={tag.id}>
                  <td>{tag.name}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button className="adm-btn outline" onClick={() => handleEdit(tag)}>✎</button>
                      <button className="adm-btn outline" style={{ color: "var(--danger)", borderColor: "var(--danger)" }} onClick={() => handleDelete(tag.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminPages({ staticPages, setStaticPages }) {
  const [editId, setEditId] = React.useState(null);
  const [form, setForm] = React.useState({ slug: "", title: { uz: "", uzk: "", en: "" }, body: { uz: "", uzk: "", en: "" } });
  
  // Tabs for language selection inside the editor
  const [activeLang, setActiveLang] = React.useState("uzk");

  React.useEffect(() => {
    if (staticPages.length > 0 && !editId && !form.slug) {
      handleSelect(staticPages[0]);
    }
  }, [staticPages]);

  const handleSelect = (page) => {
    setEditId(page.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setForm({
      slug: page.slug,
      title: page.title || { uz: "", uzk: "", en: "" },
      body: page.body || { uz: "", uzk: "", en: "" }
    });
  };

  const handleNew = () => {
    setEditId(null);
    setForm({ slug: "", title: { uz: "", uzk: "", en: "" }, body: { uz: "", uzk: "", en: "" } });
  };

  const handleSave = async () => {
    if (!form.slug || (!form.title.uzk && !form.title.uz)) return alert("Slug va sarlavha kiritilishi shart");
    
    const isEdit = !!editId;
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/pages/${editId}` : `/api/pages`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setStaticPages(staticPages.map(p => p.id === editId ? data.data : p));
        } else {
          setStaticPages([...staticPages, data.data]);
          setEditId(data.data.id);
        }
        alert("Saqlandi!");
      } else {
        alert(data.message || "Xatolik");
      }
    } catch (err) {
      alert("Tarmoq xatosi");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try {
      const res = await fetch(`/api/pages/${id}`, { 
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      const data = await res.json();
      if (data.success) {
        const newPages = staticPages.filter(p => p.id !== id);
        setStaticPages(newPages);
        if (editId === id) {
          if (newPages.length > 0) handleSelect(newPages[0]);
          else handleNew();
        }
      }
    } catch (err) {
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "24px", margin: "0 0 4px 0", color: "var(--brand)" }}>Sahifalar</h2>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>Sayt sahifalarini tahrirlash</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}>
          💾 Saqlash
        </button>
      </div>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        {/* Left Sidebar */}
        <div style={{ width: "300px", flexShrink: 0, background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "16px", margin: 0, paddingBottom: "12px", borderBottom: "1px solid var(--line)", color: "var(--ink)" }}>Sahifalar</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {staticPages.map(p => {
              const isActive = editId === p.id;
              return (
                <div 
                  key={p.id} 
                  onClick={() => handleSelect(p)}
                  style={{ 
                    padding: "12px 16px", 
                    borderRadius: "8px", 
                    cursor: "pointer", 
                    background: isActive ? "var(--brand)" : "transparent",
                    color: isActive ? "#fff" : "var(--ink)",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>{p.title.uzk || p.title.uz || p.title.en || "Nomsiz"}</div>
                  <div style={{ fontSize: "12px", opacity: isActive ? 0.8 : 0.5 }}>/{p.slug}</div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={handleNew}
            style={{ 
              marginTop: "8px", padding: "12px", borderRadius: "8px", border: "1px dashed var(--line)", 
              background: "transparent", color: "var(--ink)", fontWeight: "600", cursor: "pointer" 
            }}
          >
            + Yangi sahifa qo'shish
          </button>
        </div>

        {/* Right Content */}
        <div style={{ flex: 1, background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
              📄 {form.title.uzk || form.title.uz || "Yangi sahifa"}
            </h3>
            {editId && (
              <button 
                onClick={() => handleDelete(editId)}
                style={{ background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
              >
                O'chirish
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>URL Slug (masalan: about, contact)</label>
              <input className="form-input" style={{ width: "100%", maxWidth: "400px" }} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
            </div>

            {/* Language Tabs for Title and Body */}
            <div>
              <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--line)", paddingBottom: "12px", marginBottom: "16px" }}>
                <button 
                  onClick={() => setActiveLang("uzk")}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: activeLang === "uzk" ? "var(--brand)" : "var(--fill)", color: activeLang === "uzk" ? "#fff" : "var(--ink)", fontWeight: "600", cursor: "pointer" }}
                >
                  Kirillcha
                </button>
                <button 
                  onClick={() => setActiveLang("uz")}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: activeLang === "uz" ? "var(--brand)" : "var(--fill)", color: activeLang === "uz" ? "#fff" : "var(--ink)", fontWeight: "600", cursor: "pointer" }}
                >
                  Lotincha
                </button>
                <button 
                  onClick={() => setActiveLang("en")}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: activeLang === "en" ? "var(--brand)" : "var(--fill)", color: activeLang === "en" ? "#fff" : "var(--ink)", fontWeight: "600", cursor: "pointer" }}
                >
                  Inglizcha
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "600" }}>
                    Sarlavha ({activeLang === 'uzk' ? 'Kirill' : activeLang === 'uz' ? 'Lotin' : 'Ingliz'})
                  </label>
                  <input 
                    className="form-input" 
                    style={{ width: "100%" }} 
                    value={form.title[activeLang] || ""} 
                    onChange={e => setForm({ ...form, title: { ...form.title, [activeLang]: e.target.value } })} 
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label className="adm-form-label">Sahifa kontentini yozing...</label>
                  <RichEditor 
                    value={form.body[activeLang] || ""} 
                    onChange={html => setForm({ ...form, body: { ...form.body, [activeLang]: html } })} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSettings({ setSiteConfig, isUz }) {
  const [activeTab, setActiveTab] = React.useState("general");
  const [settings, setSettings] = React.useState({
    siteName: "",
    tagline: "",
    mainColor: "#1f2937",
    logoUrl: "",
    contact: {
      phone: "",
      email: "",
      address: ""
    },
    socialLinks: {
      telegram: "",
      facebook: "",
      instagram: "",
      youtube: ""
    }
  });
  const [loading, setLoading] = React.useState(true);
  const importFileRef = React.useRef(null);
  const [showMediaModal, setShowMediaModal] = React.useState(false);
  const [activeMediaField, setActiveMediaField] = React.useState(null);

  React.useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings", {
        headers: {
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        }
      });
      const data = await res.json();
      if (data.data) {
        // Merge with defaults
        setSettings(prev => ({
          ...prev,
          ...data.data,
          contact: { ...prev.contact, ...(data.data.contact || {}) },
          socialLinks: { ...prev.socialLinks, ...(data.data.socialLinks || {}) }
        }));
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        if (setSiteConfig) {
          setSiteConfig(prev => ({ ...prev, ...settings }));
        }
        alert("Sozlamalar saqlandi!");
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  }

  async function exportData() {
    try {
      const res = await fetch("/api/admin/backup/export", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      const data = await res.json();
      if (data.data && data.data.content) {
        const blob = new Blob([JSON.stringify(data.data.content, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = data.data.filename;
        a.click();
      }
    } catch (err) {
      alert("Zaxiralashda xatolik");
    }
  }

  async function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const res = await fetch("/api/admin/backup/import", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
          },
          body: JSON.stringify(json)
        });
        if (res.ok) alert("Ma'lumotlar tiklandi!");
      } catch (err) {
        alert("Faylni o'qishda xatolik");
      }
    };
    reader.readAsText(file);
  }

  async function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
          },
          body: JSON.stringify({ dataUrl: reader.result }),
        });
        const data = await res.json();
        if (data.url) {
          setSettings({ ...settings, logoUrl: data.url });
        }
      } catch(err) {
      }
    };
    reader.readAsDataURL(file);
  }

  const tabs = [
    { id: "general", label: "⚙️ Умумий ва Дизайн" },
    { id: "integration", label: "🤖 Интеграция" },
    { id: "seo", label: "🔍 SEO & Медиа" },
    { id: "system", label: "🛡 Хавфсизлик & Тизим" },
  ];

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
      <div style={{ padding: "16px 32px", background: "var(--surface)", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", fontWeight: "600", color: "var(--muted)" }}>
        Sozlamalar yuklanmoqda...
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", animation: "fadeIn 0.3s ease-out" }}>
      
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--ink)", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Созламалар</h2>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "15px" }}>Сайтнинг глобал параметрлари ва хавфсизлик бошқаруви</p>
        </div>
        <button onClick={saveSettings} style={{ padding: "12px 32px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(0, 51, 160, 0.3)", transition: "all 0.2s", transform: "translateY(0)" }}
          onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
        >
          💾 Сақлаш
        </button>
      </div>

      {/* Modern Tabs */}
      <div style={{ display: "flex", gap: "8px", background: "var(--fill)", padding: "6px", borderRadius: "12px", width: "max-content", border: "1px solid var(--line)" }}>
        {tabs.map(t => (
          <button 
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ 
              background: activeTab === t.id ? "var(--surface)" : "transparent", 
              border: "none", 
              borderRadius: "8px",
              padding: "10px 20px",
              color: activeTab === t.id ? "var(--ink)" : "var(--muted)",
              fontWeight: activeTab === t.id ? "700" : "600",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: activeTab === t.id ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s ease"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content Cards */}
      <div style={{ background: "var(--surface)", padding: "40px", borderRadius: "16px", boxShadow: "0 8px 30px rgba(0,0,0,0.04)", border: "1px solid var(--line)" }}>
        
        {activeTab === "general" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            
            {/* Branding & Design Section */}
            <div>
              <h4 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "800", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>Бренд ва Дизайн</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "32px", background: "var(--fill)", padding: "32px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                
                {/* Logo Upload */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Логотип</label>
                  <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                    <div style={{ width: "120px", height: "120px", borderRadius: "12px", border: "2px dashed var(--line)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)", overflow: "hidden", position: "relative" }}>
                      {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: "12px" }} />
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: "12px", textAlign: "center", padding: "16px" }}>Логотип йўқ</span>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <label style={{ flex: 1, padding: "10px 10px", background: "var(--ink)", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                          Юклаш
                          <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
                        </label>
                        <button type="button" onClick={() => { setActiveMediaField('logoUrl'); setShowMediaModal(true); }} style={{ flex: 1, padding: "10px 10px", background: "rgba(59,130,246,0.1)", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#3b82f6", cursor: "pointer", textAlign: "center", border: "none", transition: "all 0.2s" }}>
                          Кутубхона
                        </button>
                      </div>
                      <button type="button" onClick={() => setSettings({...settings, logoUrl: ""})} style={{ padding: "10px 20px", background: "transparent", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#ef4444", cursor: "pointer", transition: "all 0.2s" }}>
                        Ўчириш
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Color */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Асосий ранг</label>
                  <div style={{ display: "flex", gap: "20px", alignItems: "center", background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", border: "3px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexShrink: 0, position: "relative" }}>
                      <input 
                        type="color" 
                        value={settings.mainColor || "#1f2937"}
                        onChange={(e) => {
                          setSettings({...settings, mainColor: e.target.value});
                          document.documentElement.style.setProperty('--brand', e.target.value);
                          document.documentElement.style.setProperty('--brand-dark', e.target.value);
                        }}
                        style={{ position: "absolute", top: "-10px", left: "-10px", width: "100px", height: "100px", padding: 0, border: "none", cursor: "pointer", outline: "none" }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontWeight: "800", color: "var(--ink)", fontSize: "18px", fontFamily: "monospace" }}>{settings.mainColor?.toUpperCase()}</span>
                      <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.4" }}>Сайтнинг асосий элементлари, тугмалар ва таъкидлар учун ишлатилади.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* General Info */}
            <div>
              <h4 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "800", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>Умумий Маълумотлар</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Сайт номи</label>
                  <input type="text" value={settings.siteName || ""} onChange={e => setSettings({...settings, siteName: e.target.value})} placeholder="Vatanuz.uz" style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"}/>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Сайт шиори (Tagline)</label>
                  <input type="text" value={settings.tagline || ""} onChange={e => setSettings({...settings, tagline: e.target.value})} placeholder="Eng so'nggi yangiliklar" style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"}/>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "800", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>Алоқа Маълумотлари</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Телефон рақам</label>
                  <input type="text" value={settings.contact?.phone || ""} onChange={e => setSettings({...settings, contact: {...settings.contact, phone: e.target.value}})} placeholder="+998 90 123 45 67" style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"}/>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Электрон почта</label>
                  <input type="email" value={settings.contact?.email || ""} onChange={e => setSettings({...settings, contact: {...settings.contact, email: e.target.value}})} placeholder="vatankont@gmail.com" style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"}/>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", gridColumn: "span 2" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Манзил</label>
                  <input type="text" value={settings.contact?.address || ""} onChange={e => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})} placeholder="Toshkent shahri, Yunusobod tumani..." style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"}/>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "800", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>Ижтимоий Тармоқлар</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Telegram</label>
                  <input type="text" value={settings.socialLinks?.telegram || ""} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, telegram: e.target.value}})} placeholder="https://t.me/..." style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"}/>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Facebook</label>
                  <input type="text" value={settings.socialLinks?.facebook || ""} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, facebook: e.target.value}})} placeholder="https://facebook.com/..." style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"}/>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Instagram</label>
                  <input type="text" value={settings.socialLinks?.instagram || ""} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, instagram: e.target.value}})} placeholder="https://instagram.com/..." style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"}/>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>YouTube</label>
                  <input type="text" value={settings.socialLinks?.youtube || ""} onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, youtube: e.target.value}})} placeholder="https://youtube.com/..." style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"}/>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === "integration" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeIn 0.3s ease-out" }}>
            
            <div style={{ background: "#f0f7ff", padding: "24px", borderRadius: "12px", border: "1px solid #dcebfa" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "700", color: "#1e3a8a", display: "flex", alignItems: "center", gap: "8px" }}>
                ✈️ Телеграм Бот Хабарномалари
              </h4>
              <p style={{ margin: 0, color: "#2563eb", fontSize: "14.5px" }}>Сайтда янги обуначи ёки муаллиф қўшилганда шахсий Телеграмингизга SMS боришини таъминлайди.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>Bot Token</label>
                <input 
                  type="password" 
                  value={settings.telegramBot?.token || ""} 
                  onChange={e => setSettings({...settings, telegramBot: {...(settings.telegramBot || {}), token: e.target.value}})} 
                  placeholder="1234567890:AAH_..."
                  style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} 
                  onFocus={(e)=>e.target.style.borderColor="var(--brand)"} 
                  onBlur={(e)=>e.target.style.borderColor="var(--line)"}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>Chat ID (Сизнинг ID'ингиз)</label>
                <input 
                  type="text" 
                  value={settings.telegramBot?.chatId || ""} 
                  onChange={e => setSettings({...settings, telegramBot: {...(settings.telegramBot || {}), chatId: e.target.value}})} 
                  placeholder="masalan: 12345678"
                  style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} 
                  onFocus={(e)=>e.target.style.borderColor="var(--brand)"} 
                  onBlur={(e)=>e.target.style.borderColor="var(--line)"}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button onClick={saveSettings} style={{ padding: "12px 32px", background: "#1e3a8a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(30, 58, 138, 0.2)" }}
                onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
              >
                Сақлаш
              </button>
            </div>

          </div>
        )}

        {activeTab === "seo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", animation: "fadeIn 0.3s ease-out" }}>
            
            {/* Analytics Section */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>Google Analytics ID</label>
                <input 
                  type="text" 
                  value={settings.seo?.googleAnalyticsId || ""} 
                  onChange={e => setSettings({...settings, seo: {...(settings.seo || {}), googleAnalyticsId: e.target.value}})} 
                  placeholder="G-XXXXXXX"
                  style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} 
                  onFocus={(e)=>e.target.style.borderColor="var(--brand)"} 
                  onBlur={(e)=>e.target.style.borderColor="var(--line)"}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>Yandex Metrika ID</label>
                <input 
                  type="text" 
                  value={settings.seo?.yandexMetrikaId || ""} 
                  onChange={e => setSettings({...settings, seo: {...(settings.seo || {}), yandexMetrikaId: e.target.value}})} 
                  placeholder="XXXXXXX"
                  style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none" }} 
                  onFocus={(e)=>e.target.style.borderColor="var(--brand)"} 
                  onBlur={(e)=>e.target.style.borderColor="var(--line)"}
                />
              </div>
            </div>

            {/* Global Meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>Глобал Калит Сўзлар (Keywords)</label>
                <textarea 
                  value={settings.seo?.globalKeywords || ""} 
                  onChange={e => setSettings({...settings, seo: {...(settings.seo || {}), globalKeywords: e.target.value}})} 
                  placeholder="журнал, ватан, илм, фан, маданият, тарих"
                  style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none", minHeight: "80px", resize: "vertical" }} 
                  onFocus={(e)=>e.target.style.borderColor="var(--brand)"} 
                  onBlur={(e)=>e.target.style.borderColor="var(--line)"}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>Глобал Таъриф (Meta Description)</label>
                <textarea 
                  value={settings.seo?.globalDescription || ""} 
                  onChange={e => setSettings({...settings, seo: {...(settings.seo || {}), globalDescription: e.target.value}})} 
                  placeholder="Маънавий-маърифий, илмий-оммабоп журнал."
                  style={{ padding: "14px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "15px", transition: "all 0.2s", outline: "none", minHeight: "80px", resize: "vertical" }} 
                  onFocus={(e)=>e.target.style.borderColor="var(--brand)"} 
                  onBlur={(e)=>e.target.style.borderColor="var(--line)"}
                />
              </div>
            </div>

            {/* Media Settings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
              <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                🖼 Медиа Созламалари
              </h4>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontSize: "15px", color: "var(--ink)", fontWeight: "500", marginTop: "8px" }}>
                <input 
                  type="checkbox" 
                  checked={settings.media?.watermarkEnabled || false} 
                  onChange={e => setSettings({...settings, media: {...(settings.media || {}), watermarkEnabled: e.target.checked}})} 
                  style={{ width: "20px", height: "20px", accentColor: "var(--brand)", cursor: "pointer" }}
                />
                Расмларга сув белгиси (Watermark) қўшиш
              </label>
              {settings.media?.watermarkEnabled && (
                <div style={{ padding: "16px", background: "var(--fill)", borderRadius: "8px", border: "1px solid var(--line)" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>Эслатма: Сув белгиси қўшиш функцияси ёқилган бўлса, янги юкланадиган барча расмларга автоматик тарзда сайт логотипи (ёки номи) туширилади.</p>
                </div>
              )}
            </div>

            {/* Extra Features requested: Default OG Image Upload */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700", color: "var(--ink)", borderBottom: "1px solid var(--line)", paddingBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                🌐 Асосий Ижтимоий Тармоқ Расми (Default OG Image)
              </h4>
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <div style={{ width: "160px", height: "90px", borderRadius: "8px", border: "2px dashed var(--line)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)", overflow: "hidden" }}>
                  {settings.seo?.defaultOgImage ? (
                    <img src={settings.seo.defaultOgImage} alt="OG Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: "12px", textAlign: "center", padding: "8px" }}>Расм йўқ</span>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>Сайт ҳаволаси Telegram ёки Facebook да улашилганда чиқадиган асосий расм.</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <label style={{ padding: "10px 20px", background: "var(--ink)", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.2s", width: "max-content" }}>
                      Расм юклаш
                      <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async (event) => {
                        try {
                          const res = await fetch("/api/admin/upload", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
                            },
                            body: JSON.stringify({ dataUrl: reader.result }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            setSettings({...settings, seo: {...(settings.seo || {}), defaultOgImage: data.url}});
                          }
                        } catch(err) {
                        }
                      };
                      reader.readAsDataURL(file);
                    }} style={{ display: "none" }} />
                  </label>
                  <button type="button" onClick={() => { setActiveMediaField('defaultOgImage'); setShowMediaModal(true); }} style={{ padding: "10px 20px", background: "rgba(59,130,246,0.1)", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#3b82f6", cursor: "pointer", textAlign: "center", border: "none", transition: "all 0.2s" }}>
                    Кутубхона
                  </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button onClick={saveSettings} style={{ padding: "12px 32px", background: "#1e3a8a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(30, 58, 138, 0.2)" }}
                onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
              >
                Сақлаш
              </button>
            </div>

          </div>
        )}

        {activeTab === "system" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {/* Cache Control */}
            <div style={{ background: "var(--fill)", padding: "32px", borderRadius: "16px", border: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "120px", opacity: 0.03, pointerEvents: "none" }}>🧹</div>
              <div>
                <h4 style={{ fontSize: "20px", fontWeight: "800", color: "var(--ink)", margin: "0 0 8px 0" }}>Sayt Keshini Tozalash</h4>
                <p style={{ fontSize: "15px", color: "var(--muted)", margin: 0, lineHeight: "1.5" }}>Brauzerda va tizimda qolib ketgan eskirgan ma'lumotlarni (keshni) tozalaydi. Yangilanishlar darhol ko'rinishi uchun buni ishlatishingiz mumkin.</p>
              </div>
              <div>
                <button type="button" onClick={async () => {
                  if (window.confirm("Barcha brauzer keshini tozalashni xohlaysizmi? Sayt qayta yuklanadi.")) {
                    try {
                      if ('serviceWorker' in navigator) {
                        const regs = await navigator.serviceWorker.getRegistrations();
                        for (let r of regs) { await r.unregister(); }
                      }
                      if ('caches' in window) {
                        const names = await caches.keys();
                        for (let name of names) { await caches.delete(name); }
                      }
                      const keys = Object.keys(localStorage);
                      keys.forEach(k => {
                        if(k !== 'yk_session' && k !== 'adminToken') localStorage.removeItem(k);
                      });
                      alert("Kesh muvaffaqiyatli tozalandi!");
                      window.location.reload(true);
                    } catch (err) {
                      alert("Xatolik: " + err.message);
                    }
                  }
                }} style={{ padding: "12px 24px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }} onMouseOver={(e)=>e.target.style.opacity=0.9} onMouseOut={(e)=>e.target.style.opacity=1}>
                  <span style={{ fontSize: "18px" }}>🧹</span> Keshni tozalash va yangilash
                </button>
              </div>
            </div>

            {/* Backups Controls */}
            <div style={{ background: "var(--fill)", padding: "32px", borderRadius: "16px", border: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "120px", opacity: 0.03, pointerEvents: "none" }}>💾</div>
              <div>
                <h4 style={{ fontSize: "20px", fontWeight: "800", color: "var(--ink)", margin: "0 0 8px 0" }}>Маълумотлар захираси</h4>
                <p style={{ fontSize: "15px", color: "var(--muted)", margin: 0, lineHeight: "1.5" }}>Барча мақолалар, саҳифалар ва созламаларни хавфсиз тарзда JSON форматида сақлаб олинг ёки қайта тикланг.</p>
              </div>
              <div style={{ display: "flex", gap: "16px" }}>
                <button type="button" onClick={exportData} style={{ padding: "12px 24px", background: "var(--ink)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }} onMouseOver={(e)=>e.target.style.opacity=0.9} onMouseOut={(e)=>e.target.style.opacity=1}>
                  <span style={{ fontSize: "18px" }}>📤</span> Export (Юклаб олиш)
                </button>
                <button type="button" onClick={() => importFileRef.current.click()} style={{ padding: "12px 24px", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }} onMouseOver={(e)=>e.target.style.background="var(--line)"} onMouseOut={(e)=>e.target.style.background="transparent"}>
                  <span style={{ fontSize: "18px" }}>📥</span> Import (Тиклаш)
                </button>
                <input type="file" ref={importFileRef} onChange={importData} accept=".json" style={{ display: "none" }} />
              </div>
            </div>

            {/* SMTP Configurations */}
            <div style={{ background: "var(--fill)", padding: "32px", borderRadius: "16px", border: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "120px", opacity: 0.03, pointerEvents: "none" }}>📧</div>
              <div>
                <h4 style={{ fontSize: "20px", fontWeight: "800", color: "var(--ink)", margin: "0 0 8px 0" }}>SMTP Созламалари</h4>
                <p style={{ fontSize: "15px", color: "var(--muted)", margin: 0, lineHeight: "1.5" }}>Тизимда автоматик хабарномаларни юбориш учун почта сервери созламаларини бошқаринг.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                <input type="text" value={settings.smtp?.host || ''} onChange={e => setSettings({...settings, smtp: {...(settings.smtp||{}), host: e.target.value}})} placeholder="smtp.mailtrap.io" style={{ padding: "14px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: "15px" }} />
                <input type="text" value={settings.smtp?.port || ''} onChange={e => setSettings({...settings, smtp: {...(settings.smtp||{}), port: e.target.value}})} placeholder="Port: 2525" style={{ padding: "14px 16px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: "15px" }} />
              </div>
            </div>\n\n            {/* System Health Check and Logs Diagnostics */}\n            <SystemHealthPanel isUz={isUz} />
          </div>
        )}
      </div>
      {showMediaModal && (
        <MediaSelectModal
          isUz={isUz}
          onClose={() => setShowMediaModal(false)}
          onSelect={(url) => {
            if (activeMediaField === 'logoUrl') {
              setSettings({ ...settings, logoUrl: url });
            } else if (activeMediaField === 'defaultOgImage') {
              setSettings({ ...settings, seo: { ...(settings.seo || {}), defaultOgImage: url } });
            }
            setShowMediaModal(false);
          }}
        />
      )}
    </div>
  );
}


function SystemHealthPanel({ isUz }) {
  const [health, setHealth] = React.useState(null);
  const [logType, setLogType] = React.useState('combined');
  const [serverLogs, setServerLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [logsLoading, setLogsLoading] = React.useState(false);
  const [repairing, setRepairing] = React.useState(null);

  const token = document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  const fetchHealth = () => {
    setLoading(true);
    fetch('/api/admin/health', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        setHealth(data.health);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const fetchServerLogs = () => {
    setLogsLoading(true);
    fetch(`/api/admin/dashboard/logs?type=${logType}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      if (data.logs) {
        setServerLogs(data.logs);
      }
      setLogsLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLogsLoading(false);
    });
  };

  const handleRepair = (filename) => {
    if (!confirm(isUz ? `${filename} faylini tiklamoqchimisiz? Agar zaxira bo'lmasa ma'lumotlar tozalanishi mumkin.` : `Are you sure you want to repair ${filename}?`)) return;
    setRepairing(filename);
    fetch('/api/admin/health/repair', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ filename })
    })
    .then(r => r.json())
    .then(data => {
      alert(data.message);
      fetchHealth();
      setRepairing(null);
    })
    .catch(err => {
      alert(err.message);
      setRepairing(null);
    });
  };

  React.useEffect(() => {
    fetchHealth();
  }, []);

  React.useEffect(() => {
    fetchServerLogs();
  }, [logType]);

  if (loading) {
    return <div style={{ color: 'var(--muted)', padding: '20px', textAlign: 'center' }}>{isUz ? 'Tizim holati yuklanmoqda...' : 'Loading system health...'}</div>;
  }

  const isHealthy = health?.status === 'HEALTHY';

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginTop: "20px" }}>
      {/* Health Badge */}
      <div style={{ background: "var(--fill)", padding: "32px", borderRadius: "16px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h4 style={{ fontSize: "20px", fontWeight: "800", color: "var(--ink)", margin: "0 0 8px 0" }}>
            {isUz ? "Tizim salomatligi" : "System Health"}
          </h4>
          <p style={{ fontSize: "15px", color: "var(--muted)", margin: 0 }}>
            {isUz ? "Barcha ma'lumotlar bazasi va server komponentlari holati." : "Status of databases and server files."}
          </p>
        </div>
        <div style={{ 
          background: isHealthy ? "#dcfce7" : "#fee2e2", 
          color: isHealthy ? "#16a34a" : "#dc2626", 
          padding: "10px 20px", 
          borderRadius: "9999px", 
          fontWeight: "800", 
          fontSize: "15px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: `1px solid ${isHealthy ? '#bbf7d0' : '#fecaca'}`
        }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: isHealthy ? "#16a34a" : "#dc2626", display: "inline-block", animation: "pulse 1.5s infinite" }} />
          {health?.status}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>

      {/* OS Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "600", marginBottom: "4px" }}>{isUz ? "Operatsion Tizim" : "OS Platform"}</div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>{health?.os.platform} ({health?.os.release})</div>
        </div>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "600", marginBottom: "4px" }}>{isUz ? "Bo'sh Tezkor Xotira (RAM)" : "Free RAM"}</div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>{health?.os.freeMemoryGB} GB / {health?.os.totalMemoryGB} GB</div>
        </div>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "600", marginBottom: "4px" }}>{isUz ? "Protsessor Yadrolari" : "CPU Cores"}</div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>{health?.os.cpuCount} Cores</div>
        </div>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "600", marginBottom: "4px" }}>{isUz ? "Server Uptime" : "Uptime"}</div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>{health?.os.uptimeHours} {isUz ? "soat" : "hours"}</div>
        </div>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "600", marginBottom: "4px" }}>{isUz ? "Doimiy Xotira (Disk)" : "Disk Space"}</div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>{health?.os ? (parseFloat(health.os.diskTotalGB) - parseFloat(health.os.diskFreeGB)).toFixed(2) : 0} GB / {health?.os?.diskTotalGB} GB (Band)</div>
        </div>
      </div>

      {/* Database Files Status */}
      <div style={{ background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--line)", overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--line)", background: "var(--fill)", fontWeight: "700", color: "var(--ink)" }}>
          📂 {isUz ? "Baza Fayllari Statusi" : "Database Files"}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--fill)" }}>
                <th style={{ padding: "12px 20px", fontWeight: "600", color: "var(--muted)", fontSize: "13px" }}>{isUz ? "Fayl nomi" : "Filename"}</th>
                <th style={{ padding: "12px 20px", fontWeight: "600", color: "var(--muted)", fontSize: "13px" }}>{isUz ? "Mavjudligi" : "Exists"}</th>
                <th style={{ padding: "12px 20px", fontWeight: "600", color: "var(--muted)", fontSize: "13px" }}>{isUz ? "O'lchami" : "Size"}</th>
                <th style={{ padding: "12px 20px", fontWeight: "600", color: "var(--muted)", fontSize: "13px" }}>{isUz ? "JSON Format" : "JSON Validity"}</th>
                <th style={{ padding: "12px 20px", fontWeight: "600", color: "var(--muted)", fontSize: "13px", textAlign: "right" }}>{isUz ? "Amallar" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {health?.storage.files.map(f => {
                const isCorrupt = !f.isValidJson || !f.exists;
                return (
                  <tr key={f.name} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "14px 20px", fontWeight: "600", color: "var(--ink)", fontSize: "14px" }}>{f.name}</td>
                    <td style={{ padding: "14px 20px", fontSize: "14px" }}>
                      {f.exists ? <span style={{color:"#16a34a"}}>✅ Hа</span> : <span style={{color:"#dc2626"}}>❌ Йўқ</span>}
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--muted)", fontSize: "14px" }}>{(f.sizeBytes / 1024).toFixed(2)} KB</td>
                    <td style={{ padding: "14px 20px", fontSize: "14px" }}>
                      {f.exists ? (
                        f.isValidJson ? <span style={{color:"#16a34a"}}>✅ Соғлом</span> : <span style={{color:"#dc2626", fontWeight:"600"}}>⚠️ Бузилган ({f.error})</span>
                      ) : <span style={{color:"#dc2626"}}>—</span>}
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      {isCorrupt ? (
                        <button 
                          onClick={() => handleRepair(f.name)}
                          disabled={repairing === f.name}
                          style={{
                            padding: "6px 12px",
                            background: "var(--brand)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "700",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          {repairing === f.name ? (isUz ? 'Tiklanmoqda...' : 'Repairing...') : (isUz ? '♻️ Tuzatish' : '♻️ Repair')}
                        </button>
                      ) : (
                        <span style={{color:"var(--muted)", fontSize:"12px"}}>{isUz ? 'Муаммо йўқ' : 'OK'}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Server Log Viewer */}
      <div style={{ background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--line)", overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--line)", background: "var(--fill)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: "700", color: "var(--ink)" }}>🛠️ {isUz ? "Server File Loglari" : "Server File Logs"}</div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <select 
              value={logType} 
              onChange={e => setLogType(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", fontSize: "13px", fontWeight: "600" }}
            >
              <option value="combined">{isUz ? "Barcha loglar (combined)" : "Combined Logs"}</option>
              <option value="error">{isUz ? "Faqat xatolar (error)" : "Error Logs"}</option>
            </select>
            <button 
              onClick={fetchServerLogs} 
              disabled={logsLoading}
              style={{ padding: "6px 12px", background: "var(--ink)", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
            >
              {logsLoading ? '...' : (isUz ? '🔄 Янгилаш' : '🔄 Refresh')}
            </button>
          </div>
        </div>
        <div style={{ 
          padding: "20px", 
          background: "#1e1e1e", 
          color: "#d4d4d4", 
          fontFamily: "Courier New, monospace", 
          fontSize: "12px", 
          maxHeight: "300px", 
          overflowY: "auto",
          whiteSpace: "pre-wrap"
        }}>
          {serverLogs.length > 0 ? serverLogs.map((log, index) => (
            <div key={index} style={{ marginBottom: "8px", borderBottom: "1px solid #2d2d2d", paddingBottom: "4px", color: log.includes('"level":"error"') || log.toLowerCase().includes('error') ? '#ff8080' : '#d4d4d4' }}>{log}</div>
          )) : (isUz ? "Loglar bo'sh" : "No logs available.")}
        </div>
      </div>
    </div>
  );
}
function AdminLogs({ isUz }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/admin/logs', {
      headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
    })
    .then(r => r.json())
    .then(data => {
      if(data.logs) setLogs(data.logs);
    })
    .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "40px 32px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "900", color: "var(--ink)", marginBottom: "32px", letterSpacing: "-0.5px" }}>
        📋 {isUz ? "Tizim tarixi" : "System Logs"}
      </h2>
      <div style={{ background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--line)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--fill)", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "16px 20px", fontWeight: "700", color: "var(--ink)" }}>{isUz ? "Harakat" : "Action"}</th>
              <th style={{ padding: "16px 20px", fontWeight: "700", color: "var(--ink)" }}>{isUz ? "Foydalanuvchi" : "User"}</th>
              <th style={{ padding: "16px 20px", fontWeight: "700", color: "var(--ink)" }}>{isUz ? "Izoh" : "Details"}</th>
              <th style={{ padding: "16px 20px", fontWeight: "700", color: "var(--ink)" }}>{isUz ? "Sana" : "Date"}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} style={{ borderBottom: "1px solid var(--line)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = 'var(--fill)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: "16px 20px", color: "var(--brand)", fontWeight: "600" }}>{l.action}</td>
                <td style={{ padding: "16px 20px", color: "var(--ink)", fontWeight: "600" }}>{l.userId}</td>
                <td style={{ padding: "16px 20px", color: "var(--muted)" }}>{l.description}</td>
                <td style={{ padding: "16px 20px", color: "var(--muted)" }}>{new Date(l.createdAt).toLocaleString(isUz ? 'uz-UZ' : 'en-US')}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>{isUz ? "Tarix bo'sh" : "No logs found"}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminUsers({ isUz }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'Writer' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
    })
    .then(r => r.json())
    .then(data => {
      if(data.users) setUsers(data.users);
      if(data.error) alert(data.error);
    })
    .catch(console.error);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return alert("Barcha maydonlarni to'ldiring");
    const res = await fetch('/api/admin/users', {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` 
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok && data.users) {
      setUsers(data.users);
      setForm({ username: '', password: '', role: 'Writer' });
      alert("Foydalanuvchi muvaffaqiyatli qo'shildi!");
    } else {
      alert(data.error || "Xatolik yuz berdi");
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Haqiqatan o'chirmoqchimisiz?")) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
    });
    const data = await res.json();
    if (res.ok && data.users) {
      setUsers(data.users);
    } else {
      alert(data.error || "Xatolik yuz berdi");
    }
  };

  return (
    <div style={{ padding: "40px 32px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "900", color: "var(--ink)", marginBottom: "32px", letterSpacing: "-0.5px" }}>
        👥 {isUz ? "Foydalanuvchilar va Rollar" : "Users & Roles"}
      </h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
        {/* Add User Form */}
        <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "16px", border: "1px solid var(--line)", alignSelf: "start" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--ink)", marginBottom: "20px" }}>Qo'shish</h3>
          <form onSubmit={handleAddUser} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input 
              type="text" placeholder="Foydalanuvchi nomi" 
              value={form.username} onChange={e => setForm({...form, username: e.target.value})}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }}
            />
            <input 
              type="text" placeholder="Parol" 
              value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }}
            />
            <select 
              value={form.role} onChange={e => setForm({...form, role: e.target.value})}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }}
            >
              <option value="Writer">Writer (Yozuvchi)</option>
              <option value="Editor">Editor (Muharrir)</option>
              <option value="Super Admin">Super Admin</option>
            </select>
            <button type="submit" style={{ padding: "12px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
              Qo'shish
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div style={{ background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--line)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--fill)", borderBottom: "1px solid var(--line)" }}>
                <th style={{ padding: "16px 20px", fontWeight: "700", color: "var(--ink)" }}>Foydalanuvchi</th>
                <th style={{ padding: "16px 20px", fontWeight: "700", color: "var(--ink)" }}>Rol</th>
                <th style={{ padding: "16px 20px", fontWeight: "700", color: "var(--ink)", width: "80px" }}>Harakat</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--line)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = 'var(--fill)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: "16px 20px", color: "var(--ink)", fontWeight: "600" }}>{u.username}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ padding: "4px 8px", background: u.role === 'Super Admin' ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)", color: u.role === 'Super Admin' ? "#ef4444" : "#3b82f6", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <button onClick={() => handleDelete(u.id)} style={{ background: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontWeight: "bold" }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MediaSelectModal({ isUz, onClose, onSelect }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 100000, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "var(--bg)", width: "90%", maxWidth: "1200px", height: "90%", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "24px", background: "rgba(0,0,0,0.1)", border: "none", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>✕</button>
        <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
          <AdminMedia isUz={isUz} onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}

function AdminMedia({ isUz, onSelect }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = () => {
    fetch('/api/admin/media', {
      headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
    })
    .then(r => r.json())
    .then(data => {
      if(data.media) setMedia(data.media);
    })
    .catch(console.error);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` 
          },
          body: JSON.stringify({ dataUrl: ev.target.result })
        });
        if (res.ok) {
          fetchMedia();
        }
      } catch (err) {
        alert("Rasm yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (filename) => {
    if(!confirm("Haqiqatan o'chirmoqchimisiz?")) return;
    const res = await fetch(`/api/admin/media/${filename}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
    });
    if (res.ok) fetchMedia();
  };

  const copyToClipboard = (url) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try { document.execCommand('copy'); } catch(e) {}
      textArea.remove();
    }
    alert("URL nusxalandi: " + url);
  };

  return (
    <div style={{ padding: "40px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "900", color: "var(--ink)", letterSpacing: "-0.5px" }}>
          🖼️ {isUz ? "Media Kutubxona" : "Media Library"}
        </h2>
        <div>
          <label style={{ padding: "12px 24px", background: "var(--brand)", color: "#fff", borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "inline-block" }}>
            {loading ? "Yuklanmoqda..." : "Upload Media"}
            <input type="file" accept="image/*,video/*,.pdf" onChange={handleUpload} style={{ display: "none" }} disabled={loading} />
          </label>
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px" }}>
        {media.map((item, idx) => (
          <div key={idx} onClick={() => onSelect && onSelect(item.url)} style={{ background: "var(--surface)", borderRadius: "12px", border: onSelect ? "2px solid transparent" : "1px solid var(--line)", overflow: "hidden", display: "flex", flexDirection: "column", cursor: onSelect ? "pointer" : "default" }}>
            <div style={{ height: "160px", background: "var(--fill)", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {item.type === 'image' ? (
                <img src={item.url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ fontSize: "40px" }}>
                  {item.type === 'video' ? '🎥' : '📄'}
                </div>
              )}
            </div>
            <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--ink)", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", direction: "rtl" }}>
                {item.name}
              </span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>{(item.size / 1024).toFixed(1)} KB</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.url); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "14px" }} title="Nusxalash">🔗</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.name); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "14px", color: "#ef4444" }} title="O'chirish">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {media.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
          {isUz ? "Media mavjud emas." : "No media found."}
        </div>
      )}
    </div>
  );
}


function AdminSecurity({ isUz }) {
  const [status, setStatus] = useState(null);
  const [settings, setSettings] = useState(null);
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pinData, setPinData] = useState({ currentPin: '', newPin: '' });

  useEffect(() => {
    fetch('/api/security/status', {
      headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
    }).then(r => r.json()).then(setStatus);
    
    fetch('/api/admin/settings', {
      headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
    }).then(r => r.json()).then(data => setSettings(data.data));
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return alert(isUz ? "Yangi parol tasdig'i bilan mos emas!" : "Passwords do not match!");
    }
    const res = await fetch('/api/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
      body: JSON.stringify({ currentPassword: passData.currentPassword, newPassword: passData.newPassword })
    });
    const data = await res.json();
    if (res.ok) {
      alert(isUz ? "Parol yangilandi!" : "Password updated!");
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      alert(data.message || "Xatolik yuz berdi");
    }
  };

  const handlePinUpdate = async (e) => {
    e.preventDefault();
    if (pinData.newPin.length !== 4) return alert(isUz ? "PIN-kod 4 xonali bo'lishi kerak!" : "PIN must be 4 digits");
    const res = await fetch('/api/security/pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
      },
      body: JSON.stringify({ currentPin: pinData.currentPin, newPin: pinData.newPin })
    });
    const data = await res.json();
    if (res.ok) {
      alert(isUz ? "PIN-kod yangilandi!" : "PIN updated!");
      setPinData({ currentPin: '', newPin: '' });
      fetch('/api/security/status', {
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      }).then(r => r.json()).then(setStatus);
    } else {
      alert(data.message || "Xatolik yuz berdi");
    }
  };
  
  const toggleMaintenance = async () => {
    if (!settings) return;
    const newSettings = { ...settings, maintenanceMode: !settings.maintenanceMode };
    setSettings(newSettings);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
    }
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
          📱 Aktiv Sessiyalar va Holat
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
          <div>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 4px" }}>Oxirgi marta kirilgan vaqt:</p>
            <p style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>{status?.lastLoginAt ? new Date(status.lastLoginAt).toLocaleString('uz-UZ') : "Yuklanmoqda..."}</p>
          </div>
          <div>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 4px" }}>Akkaunt yaratilgan vaqt:</p>
            <p style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>{status?.createdAt ? new Date(status.createdAt).toLocaleString('uz-UZ') : "Yuklanmoqda..."}</p>
          </div>
        </div>
        <p style={{ fontSize: "12px", color: "#e71d1d", margin: 0, fontWeight: "500" }}>
          Agar akkauntingizga begonalar kirganidan gumon qilsangiz, zudlik bilan pastdagi forma orqali parolingizni yangilang!
        </p>
      </div>

      <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "var(--ink)", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
          Parolni o'zgartirish
        </h3>
        <form onSubmit={handlePasswordUpdate}>
          <div className="admin-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--ink)", marginBottom: "8px" }}>Joriy parol</label>
            <input type="password" value={passData.currentPassword} onChange={e => setPassData({...passData, currentPassword: e.target.value})} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          </div>
          <div className="admin-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--ink)", marginBottom: "8px" }}>Yangi parol</label>
            <input type="password" value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          </div>
          <div className="admin-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--ink)", marginBottom: "8px" }}>Yangi parolni tasdiqlang</label>
            <input type="password" value={passData.confirmPassword} onChange={e => setPassData({...passData, confirmPassword: e.target.value})} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          </div>
          <button type="submit" style={{ background: "#1e3a8a", color: "#fff", padding: "10px 20px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer" }}>Parolni yangilash</button>
        </form>
      </div>

      <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "var(--ink)", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
          2-bosqichli PIN-kodni o'zgartirish
        </h3>
        <form onSubmit={handlePinUpdate}>
          {status?.hasPin && (
            <div className="admin-field" style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "var(--ink)", marginBottom: "8px" }}>Joriy PIN-kod</label>
              <input type="password" maxLength={4} value={pinData.currentPin} onChange={e => setPinData({...pinData, currentPin: e.target.value})} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
            </div>
          )}
          <div className="admin-field" style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--ink)", marginBottom: "8px" }}>Yangi 4 xonali PIN-kod</label>
            <input type="password" maxLength={4} value={pinData.newPin} onChange={e => setPinData({...pinData, newPin: e.target.value})} required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
          </div>
          <button type="submit" style={{ background: "#1e3a8a", color: "#fff", padding: "10px 20px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer" }}>PIN-kodni yangilash</button>
        </form>
      </div>

      <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "var(--ink)", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>Tizim holati</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#fef3c7", borderRadius: "8px", border: "1px solid #fde68a" }}>
          <div>
            <h4 style={{ margin: "0 0 4px", fontSize: "14px", color: "#92400e" }}>Ta'mirlash rejimi (Maintenance Mode)</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#b45309" }}>Yoqilgan holatda faqat adminlar saytga kira oladi.</p>
          </div>
          <button 
            type="button" 
            style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "600", background: settings?.maintenanceMode ? "#fee2e2" : "#e0e7ff", color: settings?.maintenanceMode ? "#ef4444" : "#4f46e5" }}
            onClick={toggleMaintenance}
          >
            {settings?.maintenanceMode ? '🟢 Yoqilgan' : '⚪ O\'chirilgan'}
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "var(--ink)" }}>Ma'lumotlar zaxirasi</h3>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 16px" }}>Barcha maqolalar, sahifalar va sozlamalarni xavfsiz tarzda JSON formatida saqlab oling yoki qayta tiklang.</p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button type="button" style={{ background: "#1e293b", color: "#fff", padding: "10px 20px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px" }} onClick={async () => {
            const res = await fetch("/api/admin/backup/export", { method: 'POST', headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` } });
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data.data.content, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `vatanuz-backup-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
          }}>
            <span style={{ fontSize: "16px" }}>📥</span> Export (Yuklab olish)
          </button>

          <label style={{ background: "#fff", color: "#1e293b", padding: "10px 20px", borderRadius: "6px", border: "1px solid #e2e8f0", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            <input type="file" accept=".json" style={{ display: "none" }} onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              try {
                const text = await file.text();
                const parsed = JSON.parse(text);
                const res = await fetch("/api/admin/backup/import", {
                  method: "POST",
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` 
                  },
                  body: JSON.stringify(parsed)
                });
                const responseData = await res.json();
                if (res.ok) alert(isUz ? "Zaxira muvaffaqiyatli tiklandi!" : "Backup restored successfully!");
                else alert(responseData.message || "Xatolik yuz berdi");
              } catch (err) {
                alert("Faylni o'qishda xatolik: " + err.message);
              }
              e.target.value = null;
            }} />
            <span style={{ fontSize: "16px", color: "#3b82f6" }}>📤</span> Import (Tiklash)
          </label>
        </div>
      </div>
    </div>
  );
}


function AdminSeoAudit({ allStories }) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const stories = React.useMemo(() => {
    return Object.values(allStories).flat();
  }, [allStories]);

  const stats = React.useMemo(() => {
    let total = stories.length;
    let missingImages = 0;
    let shortTitles = 0;
    let shortExcerpts = 0;
    let shortBody = 0;

    // To avoid NaN sorting issues with string dates like "Bugun", we simply take the top 10 or reverse if needed.
    // In this mock, new items might be at the end or beginning. Assuming they are at the beginning:
    const latestStories = [...stories].slice(0, 10);

    const evaluatedStories = latestStories.map(s => {
      const hasImg = !!s.image;
      const hasGoodTitle = s.title && s.title.length >= 10;
      const hasGoodExcerpt = s.summary && s.summary.length >= 10;
      const bodyLen = s.body ? s.body.trim().replace(/<[^>]+>/g, '').length : 0;
      const hasGoodBody = bodyLen > 100;
      
      const score = [hasImg, hasGoodTitle, hasGoodExcerpt, hasGoodBody].filter(Boolean).length;
      return {
        ...s,
        hasImg, hasGoodTitle, hasGoodExcerpt, hasGoodBody,
        status: score >= 3 ? "A'LO" : "YAXSHILASH KERAK"
      };
    });

    stories.forEach(s => {
      if (!s.image) missingImages++;
      if (!s.title || s.title.length < 10) shortTitles++;
      if (!s.summary || s.summary.length < 10) shortExcerpts++;
      const bLen = s.body ? s.body.trim().replace(/<[^>]+>/g, '').length : 0;
      if (bLen < 100) shortBody++;
    });

    const perfectScore = total * 4;
    const currentScore = perfectScore - (missingImages + shortTitles + shortExcerpts + shortBody);
    const healthPercent = total > 0 ? Math.round((currentScore / perfectScore) * 100) : 0;

    return { total, missingImages, shortTitles, shortExcerpts, shortBody, healthPercent, evaluatedStories };
  }, [stories]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getHealthColor = (p) => p > 80 ? "#10b981" : p > 50 ? "#f97316" : "#ef4444";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)", margin: 0 }}>SEO Audit & Tahlil</h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: "4px 0 0 0" }}>Qidiruv tizimlari uchun optimallashtirish holati</p>
        </div>
        <button 
          onClick={handleRefresh}
          style={{ padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s", opacity: isRefreshing ? 0.7 : 1 }}
        >
          {isRefreshing ? "⏳ Yangilanmoqda..." : "🔍 Auditni yangilash"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
        <div style={{ background: "var(--surface)", padding: "32px", borderRadius: "16px", border: "1px solid var(--line)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: `conic-gradient(${getHealthColor(stats.healthPercent)} ${stats.healthPercent}%, #f1f5f9 0)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "28px", fontWeight: "900", color: "var(--ink)" }}>{stats.healthPercent}%</span>
            </div>
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>SEO Salomatlik</h3>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0 0" }}>O'rta daraja • Jami: {stats.total} ta maqola</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", color: "var(--ink)" }}>Sarlavhalar to'liq</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: stats.shortTitles > 0 ? "#f97316" : "#10b981", textTransform: "uppercase" }}>{stats.shortTitles > 0 ? `${stats.shortTitles} TA MUAMMO` : "A'LO"}</span>
          </div>
          <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", color: "var(--ink)" }}>Qisqacha mazmun</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: stats.shortExcerpts > 0 ? "#f97316" : "#10b981", textTransform: "uppercase" }}>{stats.shortExcerpts > 0 ? `${stats.shortExcerpts} TA YO'Q` : "A'LO"}</span>
          </div>
          <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", color: "var(--ink)" }}>Asosiy rasmlar</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: stats.missingImages > 0 ? "#ef4444" : "#10b981", textTransform: "uppercase" }}>{stats.missingImages > 0 ? `${stats.missingImages} TA YO'Q` : "A'LO"}</span>
          </div>
          <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", color: "var(--ink)" }}>Maqola matni</span>
            <span style={{ fontSize: "12px", fontWeight: "800", color: stats.shortBody > 0 ? "#f97316" : "#10b981", textTransform: "uppercase" }}>{stats.shortBody > 0 ? `${stats.shortBody} TA QISQA` : "YAXSHI"}</span>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "16px", border: "1px solid var(--line)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--ink)", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#f97316" }}>ℹ️</span> SEO Muammolar ({(stats.shortTitles>0?1:0) + (stats.shortExcerpts>0?1:0) + (stats.missingImages>0?1:0) + (stats.shortBody>0?1:0)})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {stats.shortTitles > 0 && (
            <div style={{ padding: "16px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#ef4444" }}>⚠️</span>
                <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500" }}>{stats.shortTitles} ta maqolada sarlavha qisqa ({"<"}10 belgi)</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444" }}>Yuqori</span>
            </div>
          )}
          {stats.shortExcerpts > 0 && (
            <div style={{ padding: "16px", background: "rgba(249, 115, 22, 0.05)", borderRadius: "8px", border: "1px solid rgba(249, 115, 22, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#f97316" }}>❕</span>
                <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500" }}>{stats.shortExcerpts} ta maqolada qisqacha mazmun yo'q yoki qisqa</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#f97316" }}>O'rta</span>
            </div>
          )}
          {stats.missingImages > 0 && (
            <div style={{ padding: "16px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#ef4444" }}>⚠️</span>
                <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500" }}>{stats.missingImages} ta maqolada asosiy rasm yuklanmagan</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#ef4444" }}>Yuqori</span>
            </div>
          )}
          {stats.shortBody > 0 && (
            <div style={{ padding: "16px", background: "rgba(249, 115, 22, 0.05)", borderRadius: "8px", border: "1px solid rgba(249, 115, 22, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#f97316" }}>❕</span>
                <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500" }}>{stats.shortBody} ta maqola matni juda qisqa</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#f97316" }}>O'rta</span>
            </div>
          )}
          {stats.shortTitles === 0 && stats.shortExcerpts === 0 && stats.missingImages === 0 && stats.shortBody === 0 && (
            <div style={{ padding: "16px", background: "rgba(16, 185, 129, 0.05)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#10b981" }}>✅</span>
                <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500" }}>Hech qanday SEO muammosi topilmadi! Barchasi a'lo darajada.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--line)", overflow: "hidden" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--ink)", margin: 0 }}>📄 Maqolalar SEO holati (oxirgi 10 ta)</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px", minWidth: "700px" }}>
            <thead>
              <tr style={{ background: "var(--fill)", color: "var(--muted)", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px" }}>
                <th style={{ padding: "16px 24px", fontWeight: "800", borderBottom: "1px solid var(--line)" }}>Sarlavha</th>
                <th style={{ padding: "16px 24px", fontWeight: "800", borderBottom: "1px solid var(--line)" }}>Kategoriya</th>
                <th style={{ padding: "16px 24px", fontWeight: "800", borderBottom: "1px solid var(--line)" }}>Excerpt</th>
                <th style={{ padding: "16px 24px", fontWeight: "800", borderBottom: "1px solid var(--line)" }}>Rasm</th>
                <th style={{ padding: "16px 24px", fontWeight: "800", borderBottom: "1px solid var(--line)" }}>Holat</th>
              </tr>
            </thead>
            <tbody>
              {stats.evaluatedStories.map((s, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "16px 24px", fontWeight: "700", color: "var(--ink)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title || "Sarlavhasiz"}</td>
                  <td style={{ padding: "16px 24px", color: "var(--muted)" }}>{s.category || "-"}</td>
                  <td style={{ padding: "16px 24px", color: s.hasGoodExcerpt ? "#10b981" : "#ef4444", fontWeight: "700" }}>{s.hasGoodExcerpt ? "✓ Bor" : "✗ Yo'q"}</td>
                  <td style={{ padding: "16px 24px", color: s.hasImg ? "#10b981" : "#ef4444", fontWeight: "700" }}>{s.hasImg ? "✓ Bor" : "✗ Yo'q"}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", padding: "4px 8px", borderRadius: "4px", background: s.status === "A'LO" ? "rgba(16, 185, 129, 0.1)" : "rgba(249, 115, 22, 0.1)", color: s.status === "A'LO" ? "#10b981" : "#f97316" }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.evaluatedStories.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>Maqolalar topilmadi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminTrash({ isUz, onRestore, onHardDelete }) {
  const [deletedStories, setDeletedStories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/admin/deleted', { headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` } })
      .then(res => res.json())
      .then(data => {
        const uz = (data.stories?.uz || []).map(s => ({...s, lang: 'uz'}));
        const uzk = (data.stories?.uzk || []).map(s => ({...s, lang: 'uzk'}));
        const en = (data.stories?.en || []).map(s => ({...s, lang: 'en'}));
        setDeletedStories([...uz, ...uzk, ...en]);
        setLoading(false);
      });
  }, []);

  const handleRestore = async (id, lang) => {
    await fetch(`/api/admin/${lang}/${id}/restore`, { method: 'POST', headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` } });
    setDeletedStories(deletedStories.filter(s => s.id !== id));
    if (onRestore) onRestore();
  };

  const handleHardDelete = async (id, lang) => {
    if (!confirm(isUz ? "Rostdan ham butunlay o'chirasizmi?" : "Are you sure?")) return;
    await fetch(`/api/admin/${lang}/${id}/hard`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` } });
    setDeletedStories(deletedStories.filter(s => s.id !== id));
    if (onHardDelete) onHardDelete();
  };

  return (
    <div style={{ padding: "24px", background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--ink)", marginBottom: "20px" }}>🗑️ {isUz ? "Savat (O'chirilgan maqolalar)" : "Trash"}</h2>
      {loading ? <p>Yuklanmoqda...</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--line)" }}>
              <th style={{ padding: "12px" }}>Sarlavha</th>
              <th style={{ padding: "12px" }}>O'chirilgan vaqt</th>
              <th style={{ padding: "12px" }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {deletedStories.length === 0 ? (
              <tr><td colSpan="3" style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>Savat bo'sh.</td></tr>
            ) : deletedStories.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "12px" }}>{s.title}</td>
                <td style={{ padding: "12px" }}>{new Date(s.deletedAt).toLocaleString()}</td>
                <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                  <button onClick={() => handleRestore(s.id, s.lang)} style={{ padding: "6px 12px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Tiklash</button>
                  <button onClick={() => handleHardDelete(s.id, s.lang)} style={{ padding: "6px 12px", background: "rgba(0, 51, 160, 0.1)", color: "var(--brand)", border: "none", borderRadius: "6px", cursor: "pointer" }}>Butunlay o'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminKPI({ isUz }) {
  const [kpiData, setKpiData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/admin/authors/kpi', { headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` } })
      .then(res => res.json())
      .then(data => {
        setKpiData(data.kpi || []);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "24px", background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--ink)", marginBottom: "20px" }}>📊 {isUz ? "Mualliflar KPI (Reyting)" : "Authors KPI"}</h2>
      {loading ? <p>Yuklanmoqda...</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--line)" }}>
              <th style={{ padding: "12px" }}>#</th>
              <th style={{ padding: "12px" }}>Muallif</th>
              <th style={{ padding: "12px" }}>Maqolalar soni</th>
              <th style={{ padding: "12px" }}>Jami ko'rishlar</th>
            </tr>
          </thead>
          <tbody>
            {kpiData.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>Ma'lumot topilmadi.</td></tr>
            ) : kpiData.map((kpi, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "12px" }}>{idx + 1}</td>
                <td style={{ padding: "12px", fontWeight: "700" }}>{kpi.author}</td>
                <td style={{ padding: "12px" }}>{kpi.count}</td>
                <td style={{ padding: "12px", color: "var(--brand)", fontWeight: "700" }}>{kpi.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminAds({ ads, setAds }) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [formData, setFormData] = React.useState({ title: "", link: "", position: "inline", image: "" });
  const [showMediaModal, setShowMediaModal] = React.useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    if (!formData.image && !formData.title) return alert("Rasm yoki sarlavha kiritilishi shart!");
    
    try {
      const res = await fetch("/api/admin/ads", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setAds(prev => [...prev, data.ad]);
        setFormData({ title: "", link: "", position: "inline", image: "" });
        alert("Reklama qo'shildi!");
      } else {
        alert("Xatolik: " + res.statusText);
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Rostdan ham o'chirasizmi?")) return;
    try {
      const res = await fetch(`/api/admin/ads/${id}`, { 
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        }
      });
      if (res.ok) {
        setAds(prev => prev.filter(a => a.id !== id));
      } else {
        alert("Xatolik: " + res.statusText);
      }
    } catch (err) {}
  }

  async function toggleActive(ad) {
    try {
      const res = await fetch(`/api/admin/ads/${ad.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify({ active: !ad.active })
      });
      if (res.ok) {
        const data = await res.json();
        setAds(prev => prev.map(a => a.id === ad.id ? data.ad : a));
      } else {
        alert("Xatolik: " + res.statusText);
      }
    } catch(err) {}
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if(!file) return;
    setIsUploading(true);
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
          },
          body: JSON.stringify({ dataUrl: ev.target.result })
        });
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({ ...prev, image: data.url }));
        }
      } catch(err) {
        alert("Rasm yuklashda xatolik yuz berdi");
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="admin-section" style={{animation: "fadeIn 0.3s ease"}}>
      <h2 style={{color: "var(--brand)", marginBottom: 16}}>Reklamalar (Banners)</h2>
      
      <div style={{ background: "var(--surface)", padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <h3 style={{ marginBottom: 16, color: "var(--ink)" }}>Yangi reklama qo'shish</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{display:"block", marginBottom:6, fontSize:13, fontWeight:"600", color: "var(--muted)"}}>Sarlavha (Ixtiyoriy)</label>
              <input value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="Reklama nomi" style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "14px", outline: "none", transition: "all 0.2s", boxSizing: "border-box" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{display:"block", marginBottom:6, fontSize:13, fontWeight:"600", color: "var(--muted)"}}>Link (Havola)</label>
              <input type="url" value={formData.link} onChange={e=>setFormData({...formData, link: e.target.value})} placeholder="https://..." style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "14px", outline: "none", transition: "all 0.2s", boxSizing: "border-box" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{display:"block", marginBottom:6, fontSize:13, fontWeight:"600", color: "var(--muted)"}}>Joylashuvi</label>
              <select value={formData.position} onChange={e=>setFormData({...formData, position: e.target.value})} style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--fill)", color: "var(--ink)", fontSize: "14px", outline: "none", transition: "all 0.2s", boxSizing: "border-box", cursor: "pointer" }} onFocus={(e)=>e.target.style.borderColor="var(--brand)"} onBlur={(e)=>e.target.style.borderColor="var(--line)"}>
                <option value="super_top">Eng tepa (Sayt boshida)</option>
                <option value="top">Tepa (Header tagida)</option>
                <option value="bottom">Past (Footer tepasida)</option>
                <option value="inline">Maqolalar orasida</option>
                <option value="article_inline">Maqola ichida (Matndan oldin)</option>
                <option value="sidebar">Yon tomonda (Sidebar)</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{display:"block", marginBottom:6, fontSize:13, fontWeight:"600", color: "var(--muted)"}}>Rasm yuklash</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "16px", border: "1.5px dashed var(--line)", borderRadius: "8px", background: "var(--fill)" }}>
              <input type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} style={{ cursor: "pointer" }} />
              <button type="button" onClick={() => setShowMediaModal(true)} style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Yoki Kutubxonadan Tanlash</button>
              {isUploading && <span style={{ color: "var(--brand)", fontSize: 14, fontWeight: "600" }}>Yuklanmoqda...</span>}
            </div>
            {formData.image && (
  <div style={{ position: "relative", display: "inline-block", marginTop: 12 }}>
    <img src={formData.image} alt="Preview" style={{ height: 80, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "block" }} />
    <button type="button" onClick={() => setFormData({...formData, image: ""})} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
  </div>
)}
          </div>
          <button type="submit" style={{ alignSelf: "flex-start", padding: "12px 24px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "15px", transition: "opacity 0.2s" }} onMouseOver={e=>e.target.style.opacity=0.9} onMouseOut={e=>e.target.style.opacity=1}>Qo'shish</button>
        </form>
      </div>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {ads.map(ad => (
          <div key={ad.id} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            {ad.image ? (
              <img src={ad.image} alt="Ad" style={{ width: "100%", height: 160, objectFit: "cover", background: "#f0f0f0", borderBottom: "1px solid var(--line)" }} />
            ) : (
              <div style={{ width: "100%", height: 160, background: "var(--fill)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", borderBottom: "1px solid var(--line)", fontWeight: "500" }}>Rasm yo'q</div>
            )}
            <div style={{ padding: 16, flex: 1 }}>
              <h4 style={{ margin: "0 0 8px 0", color: "var(--ink)", fontSize: 16 }}>{ad.title || "Sarlavhasiz"}</h4>
              <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 12px 0" }}><strong>Joylashuv:</strong> <span style={{ background: "var(--fill)", padding: "2px 8px", borderRadius: 4, border: "1px solid var(--line)" }}>{ad.position}</span></p>
              {ad.link && <a href={ad.link} target="_blank" style={{ fontSize: 14, color: "var(--brand)", wordBreak: "break-all", textDecoration: "none", fontWeight: "500" }}>{ad.link}</a>}
            </div>
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--fill)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: "600", color: ad.active ? "var(--brand)" : "var(--muted)" }}>
                <input type="checkbox" checked={ad.active} onChange={() => toggleActive(ad)} style={{ width: 16, height: 16, cursor: "pointer" }} /> {ad.active ? "Faol (Ko'rinadi)" : "Faol emas"}
              </label>
              <button onClick={() => handleDelete(ad.id)} style={{ background: "transparent", border: "none", color: "var(--brand)", cursor: "pointer", fontSize: 20, padding: 4, borderRadius: 4, transition: "background 0.2s" }} onMouseOver={e=>e.target.style.background="rgba(195,25,50,0.1)"} onMouseOut={e=>e.target.style.background="transparent"} title="O'chirish">🗑</button>
            </div>
          </div>
        ))}
        {ads.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", background: "var(--surface)", borderRadius: 12, border: "1px dashed var(--line)", color: "var(--muted)" }}><p style={{ margin: 0, fontSize: 16 }}>Hozircha reklamalar yo'q. Yangi reklama qo'shishingiz mumkin.</p></div>}
      </div>
      {showMediaModal && (
        <MediaSelectModal isUz={true} onClose={() => setShowMediaModal(false)} onSelect={(url) => {
          setFormData(prev => ({ ...prev, image: url }));
          setShowMediaModal(false);
        }} />
      )}
    </div>
  );
}


function AdminSpecial({ setSiteConfig }) {
  const [settings, setSettings] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [showMediaModal, setShowMediaModal] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/admin/settings', {
      headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
    }).then(r => r.json()).then(data => {
      if (data && data.data) setSettings(data.data || {});
      setLoaded(true);
    });
  }, []);

  const special = (settings && settings.specialProject) ? settings.specialProject : {};

  const handleUpdate = (field, val) => {
    setSettings(prev => {
      const p = prev || {};
      return {
        ...p,
        specialProject: { ...(p.specialProject || {}), [field]: val }
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(settings)
      });
      if (setSiteConfig) {
        setSiteConfig(prev => ({ ...prev, specialProject: settings.specialProject }));
      }
      alert("Maxsus loyiha sozlamalari saqlandi!");
    } catch(err) {
      alert("Xatolik: " + err.message);
    }
    setSaving(false);
  };

  const handleToggleActive = async (e) => {
    const val = e.target.checked;
    handleUpdate('isActive', val);
    
    const updatedSettings = {
      ...settings,
      specialProject: { ...(settings.specialProject || {}), isActive: val }
    };
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
        },
        body: JSON.stringify(updatedSettings)
      });
      if (setSiteConfig) {
        setSiteConfig(prev => ({ ...prev, specialProject: updatedSettings.specialProject }));
      }
    } catch(err) {
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if(data.url) handleUpdate("image", data.url);
    } catch(err) {
    }
  };

  if (!loaded) return <div style={{padding: 40, textAlign: 'center', color: 'var(--muted)'}}>Yuklanmoqda...</div>;

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', background: 'var(--surface, #fff)', color: 'var(--ink, #1e293b)', fontSize: '14px', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: '6px', color: 'var(--ink, #334155)', fontWeight: '600', fontSize: '13px' };

  return (
    <div style={{maxWidth: 700, margin: '0 auto'}}>
      <div style={{marginBottom: '24px'}}>
        <h2 style={{fontSize: '22px', fontWeight: 'bold', color: 'var(--ink)', margin: 0}}>⭐ Maxsus Loyiha</h2>
        <p style={{color: 'var(--muted)', marginTop: 4, fontSize: '14px'}}>Bosh sahifadagi maxsus blokni tahrirlash</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '10px', background: 'var(--surface-alt, #f8fafc)', border: '1px solid var(--border, #e2e8f0)'}}>
          <div>
            <div style={{fontWeight: '600', color: 'var(--ink)', fontSize: '15px'}}>Loyihani ko'rsatish</div>
            <div style={{fontSize: '13px', color: 'var(--muted)', marginTop: '4px'}}>Bosh sahifada maxsus loyihani yoqish yoki o'chirish</div>
          </div>
          <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer', background: special.isActive !== false ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)', padding: '8px 16px', borderRadius: '30px'}}>
            <input type="checkbox" checked={special.isActive !== false} onChange={handleToggleActive} style={{width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981'}} />
            <span style={{marginLeft: '10px', fontWeight: '700', fontSize: '14px', color: special.isActive !== false ? '#10b981' : '#64748b'}}>{special.isActive !== false ? "Yoqilgan" : "O'chirilgan"}</span>
          </label>
        </div>

        <div style={{background: 'var(--surface-alt, #f8fafc)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border, #e2e8f0)', marginBottom: 8}}>
          <label style={{...labelStyle, fontSize: '15px', marginBottom: '12px'}}>🎨 Dizayn tanlang (8 xil variant)</label>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px'}}>
            {[
              { id: "classic", name: "Klassik", bg: "linear-gradient(135deg, #0a0f1e, #1a0a2e)", color: "#fff", accent: "#e11d48", icon: "🌙" },
              { id: "gradient", name: "Gradient", bg: "linear-gradient(135deg, #1e3a5f, #2d1b4e)", color: "#fff", accent: "#6366f1", icon: "🔮" },
              { id: "light", name: "Yorug'", bg: "linear-gradient(135deg, #f8fafc, #e2e8f0)", color: "#0f172a", accent: "#c31932", icon: "☀️" },
              { id: "magazine", name: "Jurnal", bg: "linear-gradient(135deg, #18181b, #27272a)", color: "#fbbf24", accent: "#fbbf24", icon: "📰" },
              { id: "cyberpunk", name: "Cyberpunk", bg: "linear-gradient(135deg, #09090b, #18181b)", color: "#22d3ee", accent: "#ec4899", icon: "🤖" },
              { id: "elegant", name: "Elegant", bg: "linear-gradient(135deg, #0f172a, #1e293b)", color: "#e2e8f0", accent: "#d4af37", icon: "✨" },
              { id: "matrix", name: "Matrix", bg: "linear-gradient(135deg, #000000, #0a1f0a)", color: "#4ade80", accent: "#22c55e", icon: "💻" },
              { id: "eco", name: "Eco yashil", bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", color: "#064e3b", accent: "#10b981", icon: "🌿" }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => handleUpdate("design", d.id)}
                style={{
                  background: d.bg,
                  border: (special.design || "classic") === d.id ? "3px solid var(--brand, #c31932)" : "2px solid var(--border, #e2e8f0)",
                  borderRadius: '10px',
                  padding: '14px 10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 200ms',
                  transform: (special.design || "classic") === d.id ? "scale(1.03)" : "scale(1)",
                  boxShadow: (special.design || "classic") === d.id ? "0 4px 20px rgba(0,0,0,0.2)" : "none"
                }}
              >
                <div style={{fontSize: '20px', marginBottom: 4}}>
                  {d.icon}
                </div>
                <div style={{fontSize: '11px', fontWeight: '700', color: d.color, letterSpacing: '0.02em'}}>{d.name}</div>
                <div style={{width: '100%', height: '3px', borderRadius: 2, background: d.accent, marginTop: 6}} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Kicker (Yorliq)</label>
          <p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '-4px', marginBottom: '6px'}}>Tepada, ikonka yonidagi kichik yozuv (Masalan: "Maxsus loyiha")</p>
          <input style={inputStyle} value={special.kicker || ""} onChange={e => handleUpdate("kicker", e.target.value)} placeholder="Maxsus loyiha" />
        </div>
        <div>
          <label style={labelStyle}>Sarlavha (Title)</label>
          <p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '-4px', marginBottom: '6px'}}>Katta shriftda chiqadigan asosiy sarlavha</p>
          <input style={inputStyle} value={special.title || ""} onChange={e => handleUpdate("title", e.target.value)} placeholder="Ma'lumotga tayangan jurnalistika..." />
        </div>
        <div>
          <label style={labelStyle}>Matn (Description)</label>
          <p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '-4px', marginBottom: '6px'}}>Sarlavha ostidagi izoh va tushuntirish matni</p>
          <textarea style={{...inputStyle, minHeight: '100px', resize: 'vertical'}} value={special.text || ""} onChange={e => handleUpdate("text", e.target.value)} rows={4} placeholder="Vatanuz.uz tahririyati..." />
        </div>
        <div>
          <label style={labelStyle}>Belgi (Badge)</label>
          <p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '-4px', marginBottom: '6px'}}>Rasmning ustida, pastki qismda chiqadigan miltillovchi yozuv</p>
          <input style={inputStyle} value={special.badge || ""} onChange={e => handleUpdate("badge", e.target.value)} placeholder="Jonli tahririyat" />
        </div>
        <div>
          <label style={labelStyle}>Teglar (Features)</label>
          <p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '-4px', marginBottom: '6px'}}>Matn ostidagi qisqa bloklar. Vergul bilan ajrating (Masalan: Tezkor, Ishonchli, Mustaqil)</p>
          <input style={inputStyle} value={special.features || ""} onChange={e => handleUpdate("features", e.target.value)} placeholder="Tezkor yangiliklar, Mustaqil tahlil, Ikki tilda, Ishonchli manba" />
        </div>
        <div>
          <label style={labelStyle}>Asosiy rasm</label>
          <p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '-4px', marginBottom: '6px'}}>O'ng tomonda chiqadigan katta asosiy rasm (Gorizontal rasm tavsiya etiladi)</p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
            <input type="file" onChange={uploadImage} accept="image/*" />
            <button type="button" onClick={() => setShowMediaModal(true)} style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Kutubxonadan Tanlash</button>
          </div>
          {special.image && <img src={special.image} alt="Preview" style={{marginTop: 8, maxWidth: 320, borderRadius: 10, display: 'block', border: '1px solid var(--border, #e2e8f0)'}} />}
        </div>

        <div style={{background: 'var(--surface-alt, #f8fafc)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border, #e2e8f0)'}}>
          <label style={{...labelStyle, fontSize: '15px', marginBottom: '4px'}}>📊 Statistika (4 ta)</label>
          <p style={{fontSize: '12px', color: 'var(--muted)', marginTop: 0, marginBottom: '12px'}}>
            Rasmning o'ng tomonida turadigan 4 ta quti. Birinchi qatorga raqamni (Masalan: 24/7), ikkinchi qatorga yozuvni (Masalan: Monitoring) kiriting.
          </p>
          {[1,2,3,4].map(n => (
            <div key={n} style={{display:'flex', gap:'10px', marginBottom: 10}}>
              <input style={{...inputStyle, flex: 1}} placeholder={n === 1 ? "24/7" : n === 2 ? "7" : n === 3 ? "2" : "100+"} value={special[`stat${n}Num`]||""} onChange={e=>handleUpdate(`stat${n}Num`,e.target.value)} />
              <input style={{...inputStyle, flex: 2}} placeholder={n === 1 ? "Monitoring" : n === 2 ? "Bo'lim" : n === 3 ? "Til" : "Maqola"} value={special[`stat${n}Label`]||""} onChange={e=>handleUpdate(`stat${n}Label`,e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop: 24, display: 'flex', justifyContent: 'flex-end'}}>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{padding: '10px 28px', borderRadius: '8px', background: 'var(--brand, #c31932)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', opacity: saving ? 0.7 : 1}}
        >
          {saving ? "Saqlanmoqda..." : "💾 Saqlash"}
        </button>
      </div>
      {showMediaModal && (
        <MediaSelectModal isUz={true} onClose={() => setShowMediaModal(false)} onSelect={(url) => {
          handleUpdate("image", url);
          setShowMediaModal(false);
        }} />
      )}
    </div>
  );
}

function AdminPanel({ 
  lang, 
  setLang, 
  allStories, 
  stories, 
  setAllStories, 
  refreshPublicStories, 
  siteConfig, 
  setSiteConfig, 
  pinnedHeroId, 
  setPinnedHeroId, 
  pinnedSideIds, 
  setPinnedSideIds, 
  ads, 
  setAds,
  languages,
  categories,
  setLanguages,
  setCategories,
  staticPages,
  setStaticPages,
  videos,
  setVideos,
  photos,
  setPhotos
}) {
  const isUz = lang !== "en";
  
  const userRole = localStorage.getItem('yk_role');
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardLogs, setDashboardLogs] = useState([]);
  const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = window.Recharts || {};

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetch('/api/admin/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.stats) setDashboardStats(data);
      }).catch(console.error);

      fetch('/api/admin/dashboard/logs', {
        headers: { 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.logs) setDashboardLogs(data.logs);
      }).catch(console.error);
    }
  }, [activeTab]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7'];

  const [showMediaModal, setShowMediaModal] = useState(false);
  const [adminTags, setAdminTags] = useState([]);
  useEffect(() => { fetch("/api/tags").then(r=>r.json()).then(d=>{if(d&&d.data) setAdminTags(d.data)}).catch(console.error) }, []);
  const [translations, setTranslations] = useState({ uz: {}, en: {} });
  const [translationsLoading, setTranslationsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/translations')
      .then(res => res.json())
      .then(data => {
        if (data.translations) setTranslations(data.translations);
      });
  }, []);

  const saveTranslations = async () => {
    setTranslationsLoading(true);
    try {
      const res = await fetch('/api/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` },
        body: JSON.stringify({ translations })
      });
      if (res.ok) {
        alert("Tarjimalar saqlandi!");
        window.location.reload();
      }
    } catch(err) {
      alert("Xatolik yuz berdi");
    }
    setTranslationsLoading(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Authentication state
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loginStep, setLoginStep] = useState("password");
  const [loginPin, setLoginPin] = useState("");
  const [loginTempToken, setLoginTempToken] = useState("");
  const [authError, setAuthError] = useState("");
  
  // Articles state
  const [editingStory, setEditingStory] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = (file) => {
    if (!file) return;
    setImageUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl: e.target.result })
        });
        if (res.ok) {
          const data = await res.json();
          setForm(prev => ({ ...prev, image: data.url }));
        }
      } catch (err) {
        alert("Rasm yuklashda xatolik yuz berdi.");
      } finally {
        setImageUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      if (!currentTags.includes(tagInput.trim())) {
        const newTags = [...currentTags, tagInput.trim()].join(", ");
        setForm(prev => ({ ...prev, tags: newTags }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
    const newTags = currentTags.filter(t => t !== tagToRemove).join(", ");
    setForm(prev => ({ ...prev, tags: newTags }));
  };

  const [form, setForm] = useState({
    articleLang: lang === "en" ? "en" : lang === "uz" ? "uz" : "uzk",
    title: "",
    category: isUz ? "Siyosat" : "Politics",
    summary: "",
    body: "",
    image: "",
    author: "Tahririyat",
    status: "draft",
    time: "Bugun",
    read: "",
    isFeatured: false,
    isEditorChoice: false,
    isBreaking: false,
    tags: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    focusKeyword: "",
    videoUrl: ""
  });

  // Backup & Import
  const [backupLogs, setBackupLogs] = useState([]);
  const importFileRef = useRef(null);

  // SEO scoring helper
  const [seoScore, setSeoScore] = useState(0);
  const [seoSuggestions, setSeoSuggestions] = useState([]);

  // Auto-save logic (runs every 5 seconds)
  useEffect(() => {
    if (activeTab !== "editor" || !form.title) return;
    const interval = setInterval(() => {
      localStorage.setItem("yk-cms-draft", JSON.stringify(form));
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab, form]);

  // Load draft if exists
  const loadDraft = () => {
    const draft = localStorage.getItem("yk-cms-draft");
    if (draft) {
      setForm(JSON.parse(draft));
      alert("Qoralama muvaffaqiyatli tiklandi.");
    }
  };

  // SEO Live score calculator
  useEffect(() => {
    let score = 0;
    const suggestions = [];

    if (form.title.length > 10) {
      score += 25;
    } else {
      suggestions.push(isUz ? "Sarlavha juda qisqa (kamida 10 ta belgi bo'lishi kerak)" : "Title is too short");
    }

    if (form.summary.length > 30) {
      score += 25;
    } else {
      suggestions.push(isUz ? "Tavsif (summary) juda qisqa" : "Summary is too short");
    }

    if (form.focusKeyword && form.title.toLowerCase().includes(form.focusKeyword.toLowerCase())) {
      score += 25;
    } else if (form.focusKeyword) {
      suggestions.push(isUz ? "Klit so'zni sarlavhaga kiriting" : "Add a keyword to the title");
    }

    if (form.body.length > 200) {
      score += 25;
    } else {
      suggestions.push(isUz ? "Maqola matni juda qisqa (kamida 200 ta belgi)" : "Article text is too short");
    }

    setSeoScore(score);
    setSeoSuggestions(suggestions);
  }, [form.title, form.summary, form.body, form.focusKeyword]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginStep === "password") {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
          if (data.requiresPin) {
            setLoginStep("pin");
            setLoginTempToken(data.tempToken);
            setAuthError("");
          } else {
            localStorage.setItem('yk_role', data.role);
            setAuthenticated(true);
            setAuthError("");
          }
        } else {
          setAuthError(data.message || (isUz ? "Parol noto'g'ri" : "Incorrect password"));
        }
      } catch (err) {
        setAuthError("Server connection error.");
      }
    } else {
      try {
        const res = await fetch("/api/login/pin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tempToken: loginTempToken, pin: loginPin })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('yk_role', data.role);
          setAuthenticated(true);
          setAuthError("");
        } else {
          setAuthError(data.message || "Xato PIN-kod");
        }
      } catch (err) {
        setAuthError("Server connection error.");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const langKey = form.articleLang || (lang === "en" ? "en" : lang === "uzk" ? "uzk" : "uz");
      let res;
      if (editingStory) {
        res = await fetch(`/api/admin/stories/${langKey}/${editingStory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ story: { ...form, tags: tagInput.trim() ? Array.from(new Set([...(form.tags ? form.tags.split(', ') : []), tagInput.trim()])).join(', ') : form.tags } })
        });
      } else {
        res = await fetch("/api/admin/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: langKey, story: { ...form, tags: tagInput.trim() ? Array.from(new Set([...(form.tags ? form.tags.split(', ') : []), tagInput.trim()])).join(', ') : form.tags } })
        });
      }
      if (res.ok) {
        const data = await res.json();
        if (data.stories) {
          setAllStories(data.stories);
          window.ALL_STORIES = data.stories;
        }
        alert(isUz ? "Maqola muvaffaqiyatli saqlandi!" : "Article saved successfully!");
        setActiveTab("articles");
        setEditingStory(null);
        setForm({
          articleLang: lang === "en" ? "en" : lang === "uz" ? "uz" : "uzk",
          title: "",
          category: isUz ? "Siyosat" : "Politics",
          summary: "",
          body: "",
          image: "",
          author: "Tahririyat",
          status: "published",
          time: "Bugun",
          read: "",
          tags: "",
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
          focusKeyword: "",
          videoUrl: "",
          publishAt: "",
          sendToTelegram: false,
          sendPushNotification: false,
          isFeatured: false,
          isEditorChoice: false,
          isBreaking: false
        });
        localStorage.removeItem("yk-cms-draft");
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || errData.message || (isUz ? "Xatolik yuz berdi" : "Error saving story"));
      }
    } catch (err) {
      alert("Error saving story: " + (err.message || err));
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    let storyLang = story.articleLang;
    if (!storyLang) {
      if (allStories.en && allStories.en.some(s => s.id === story.id)) storyLang = "en";
      else if (allStories.uzk && allStories.uzk.some(s => s.id === story.id)) storyLang = "uzk";
      else storyLang = "uz";
    }

    setForm({
      id: story.id,
      articleLang: storyLang,
      title: story.title || "",
      category: story.category || (isUz ? "Siyosat" : "Politics"),
      summary: story.summary || "",
      body: story.body || "",
      image: story.image || "",
      author: story.author || "Tahririyat",
      status: story.status || "published",
      time: story.time || "Bugun",
      read: story.read || "",
      tags: story.tags || "",
      seoTitle: story.seoTitle || "",
      seoDescription: story.seoDescription || "",
      seoKeywords: story.seoKeywords || "",
      focusKeyword: story.focusKeyword || "",
      videoUrl: story.videoUrl || "",
      views: story.views || 0,
      publishAt: story.publishAt || story.scheduledAt || "",
      sendToTelegram: false,
      sendPushNotification: false,
      isFeatured: Boolean(story.isFeatured),
      isEditorChoice: Boolean(story.isEditorChoice || story.isEditorPick),
      isBreaking: Boolean(story.isBreaking)
    });
    setActiveTab("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (story) => {
    if (!confirm(isUz ? "Maqolani o'chirishni tasdiqlaysizmi?" : "Confirm deletion?")) return;
    try {
      let langKey = story.articleLang;
      if (!langKey) {
        if (allStories.en && allStories.en.some(s => s.id === story.id)) langKey = "en";
        else if (allStories.uzk && allStories.uzk.some(s => s.id === story.id)) langKey = "uzk";
        else langKey = "uz";
      }
      const res = await fetch(`/api/admin/stories/${langKey}/${story.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.stories) {
          setAllStories(data.stories);
          window.ALL_STORIES = data.stories;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || errData.message || "Error deleting story.");
      }
    } catch (err) {
      alert("Error deleting story: " + (err.message || err));
    }
  };

  const exportData = async () => {
    try {
      const res = await fetch("/api/admin/backup/export");
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data.data.content, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vatanuz-backup-${Date.now()}.json`;
        a.click();
      }
    } catch (e) {
      alert("Export failed.");
    }
  };

  const importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        const res = await fetch("/api/admin/backup/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed)
        });
        if (res.ok) {
          alert(isUz ? "Zaxira muvaffaqiyatli yuklandi!" : "Backup restored successfully!");
          window.location.reload();
        } else {
          alert("Import failed.");
        }
      } catch (err) {
        alert("Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  if (!authenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", background: "var(--fill)", padding: "24px" }}>
        <form onSubmit={handleLogin} style={{ background: "var(--surface)", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ textAlign: "center", color: "var(--brand)", fontSize: "24px", fontWeight: "800" }}>🔑 VATANUZ.UZ CMS</h2>
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "14px" }}>
            {loginStep === "password" ? (isUz ? "Tahririyat paneliga kirish uchun parolni kiriting:" : "Enter password to access the panel:") : "4 xonali himoya PIN-kodini kiriting:"}
          </p>
          
          {loginStep === "password" ? (
            <>
              <input 
                type="text" 
                placeholder="Login" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)", outline: "none", fontSize: "16px" }}
              />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)", outline: "none", fontSize: "16px" }}
              />
            </>
          ) : (
            <input 
              type="password" 
              placeholder="••••" 
              maxLength={4}
              value={loginPin}
              onChange={(e) => setLoginPin(e.target.value)}
              style={{ padding: "14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)", outline: "none", fontSize: "16px", textAlign: "center", letterSpacing: "8px" }}
              autoFocus
            />
          )}
          
          {authError && <div style={{ color: "var(--brand)", fontSize: "14px", fontWeight: "600", textAlign: "center" }}>{authError}</div>}
          
          <button type="submit" className="more-news-btn" style={{ padding: "14px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
            {loginStep === "password" ? (isUz ? "Kirish" : "Login") : "Tasdiqlash"}
          </button>
          
          {loginStep === "pin" && (
            <button type="button" onClick={() => { setLoginStep("password"); setLoginPin(""); setAuthError(""); }} style={{ padding: "10px", background: "transparent", color: "var(--muted)", border: "none", cursor: "pointer", fontSize: "14px" }}>
              Ortga qaytish
            </button>
          )}
        </form>
      </div>
    );
  }

  // Flatten stories list
  const langKey = lang === "en" ? "en" : lang === "uzk" ? "uzk" : "uz";
  const storiesList = allStories[langKey] || [];
  
  // Filter lists
  const filteredStories = storiesList.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          story.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || story.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || story.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "85vh", background: "var(--fill)", fontFamily: "inherit" }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ background: "var(--surface)", borderRight: "1px solid var(--line)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "8px", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "800", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", paddingLeft: "12px" }}>📂 CMS Menu</h3>
        
        <button 
          onClick={() => setActiveTab("dashboard")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "dashboard" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "dashboard" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >📊 Dashboard</button>
        
        <button 
          onClick={() => setActiveTab("articles")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "articles" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "articles" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >📝 Maqolalar</button>
        <button 
          onClick={() => setActiveTab("videos")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "videos" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "videos" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >🎥 Videolar</button>
        <button 
          onClick={() => setActiveTab("photos")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "photos" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "photos" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >📸 Fotolar</button>

        <button 
          onClick={() => setActiveTab("kpi")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "kpi" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "kpi" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >📊 Mualliflar KPI</button>

        <button 
          onClick={() => setActiveTab("trash")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "trash" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "trash" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >🗑️ Savat</button>


        <button 
          onClick={() => {
            setEditingStory(null);
            setForm({
              title: "",
              category: isUz ? "Siyosat" : "Politics",
              summary: "",
              body: "",
              image: "",
              author: "Tahririyat",
              status: "draft",
              time: "Bugun",
              read: "",
              tags: "",
              seoTitle: "",
              seoDescription: "",
              seoKeywords: "",
              focusKeyword: "",
              videoUrl: "",
              publishAt: ""
            });
            setActiveTab("editor");
          }} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "editor" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "editor" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >✍️ Yangi Maqola</button>


        <button 
          onClick={() => setActiveTab("categories")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "categories" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "categories" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >📁 Ruknlar</button>

        <button 
          onClick={() => setActiveTab("languages")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "languages" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "languages" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >🌐 Tillar</button>

        <button 
          onClick={() => setActiveTab("tags")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "tags" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "tags" ? "var(--primary)" : "var(--text)", textAlign: "left", fontWeight: activeTab === "tags" ? "600" : "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}
        >🏷️ Теглар</button>
        <button 
          onClick={() => setActiveTab("pages")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "pages" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "pages" ? "var(--primary)" : "var(--text)", textAlign: "left", fontWeight: activeTab === "pages" ? "600" : "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}
        >📄 Sahifalar</button>
        <button 
          onClick={() => setActiveTab("comments")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "comments" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "comments" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >💬 Izohlar</button>

        <button 
          onClick={() => setActiveTab("translations")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "translations" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "translations" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >🌐 Matnlar</button>

        <button 
          onClick={() => setActiveTab("media")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "media" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "media" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >🖼️ Media Kutubxona</button>

        {userRole === 'Super Admin' && (
          <button 
            onClick={() => setActiveTab("ads")} 
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "ads" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "ads" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}
          >💰 Reklamalar</button>
        )}

        <button 
          onClick={() => setActiveTab("seo-audit")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "seo-audit" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "seo-audit" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}
        >📈 SEO Audit</button>

        <button 
          onClick={() => setActiveTab("special")} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "special" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "special" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}
        >⭐ Maxsus loyiha</button>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <button 
            onClick={() => setActiveTab("settings")} 
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "settings" ? "rgba(0, 51, 160, 0.08)" : "transparent", color: activeTab === "settings" ? "var(--brand)" : "var(--ink)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
          >⚙️ Sozlamalar</button>

          <div style={{ paddingLeft: "16px", paddingRight: "4px" }}>
            <button 
              onClick={() => setActiveTab("security")} 
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: activeTab === "security" ? "1.5px solid #111" : "1.5px solid transparent", background: activeTab === "security" ? "#fce7ea" : "transparent", color: activeTab === "security" ? "var(--brand)" : "var(--muted)", fontWeight: "700", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", transition: "all 0.2s", marginBottom: "4px" }}
            >
              <span style={{ color: "#3b82f6" }}>🛡️</span> Xavfsizlik
            </button>
            <button 
              onClick={() => setActiveTab("users")} 
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: activeTab === "users" ? "1.5px solid #111" : "1.5px solid transparent", background: activeTab === "users" ? "#fce7ea" : "transparent", color: activeTab === "users" ? "var(--brand)" : "var(--muted)", fontWeight: "700", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", transition: "all 0.2s", marginBottom: "4px" }}
            >
              <span style={{ color: "#8b5cf6" }}>👥</span> Foydalanuvchilar
            </button>
            <button 
              onClick={() => setActiveTab("logs")} 
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: activeTab === "logs" ? "1.5px solid #111" : "1.5px solid transparent", background: activeTab === "logs" ? "#fce7ea" : "transparent", color: activeTab === "logs" ? "var(--brand)" : "var(--muted)", fontWeight: "700", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", transition: "all 0.2s" }}
            >
              <span style={{ color: "#f59e0b" }}>📋</span> Tizim tarixi
            </button>
          </div>
        </div>

        <button 
          onClick={async () => {
            await fetch('/api/logout', { method: 'POST' });
            localStorage.removeItem('yk_role');
            setAuthenticated(false);
          }} 
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: "transparent", color: "var(--brand)", fontWeight: "700", textAlign: "left", cursor: "pointer" }}
        >🚪 Chiqish</button>
      </aside>

      {/* Main Content Area */}
      <main style={{ padding: "40px" }}>
        
        {/* Tab 1: Dashboard */}
                {activeTab === "languages" && <AdminLanguages languages={languages} setLanguages={setLanguages} />}
        {activeTab === "categories" && <AdminCategories categories={categories} setCategories={setCategories} languages={languages} />}

        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>Dashboard</h2>
              <button onClick={() => window.location.reload()} style={{ background: "var(--brand)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>↻ Yangilash</button>
            </div>
            
            {dashboardStats ? (
              <>
                {/* Stats Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
                  <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                    <span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "600" }}>Umumiy Maqolalar</span>
                    <h3 style={{ fontSize: "32px", fontWeight: "900", color: "var(--ink)", marginTop: "8px" }}>{dashboardStats.stats.totalArticles}</h3>
                  </div>
                  <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                    <span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "600" }}>Chop etilganlar</span>
                    <h3 style={{ fontSize: "32px", fontWeight: "900", color: "#10b981", marginTop: "8px" }}>{dashboardStats.stats.publishedArticles}</h3>
                  </div>
                  <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                    <span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "600" }}>Qoralamalar (Draft)</span>
                    <h3 style={{ fontSize: "32px", fontWeight: "900", color: "#f59e0b", marginTop: "8px" }}>{dashboardStats.stats.draftArticles}</h3>
                  </div>
                  <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                    <span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "600" }}>Rejalashtirilgan</span>
                    <h3 style={{ fontSize: "32px", fontWeight: "900", color: "#a855f7", marginTop: "8px" }}>{dashboardStats.stats.scheduledArticles}</h3>
                  </div>
                </div>

                {/* Charts Area */}
                {window.Recharts && (
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr", gap: "24px" }}>
                    <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                      <h4 style={{ fontWeight: "800", color: "var(--ink)", marginBottom: "16px" }}>📈 Haftalik Ko'rishlar (LineChart)</h4>
                      <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                          <LineChart data={dashboardStats.weeklyViews} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                            <XAxis dataKey="name" tick={{fill: "var(--muted)", fontSize: 12}} />
                            <YAxis tick={{fill: "var(--muted)", fontSize: 12}} />
                            <Tooltip contentStyle={{ background: "var(--surface)", borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                      <h4 style={{ fontWeight: "800", color: "var(--ink)", marginBottom: "16px" }}>📊 Maqolalar (BarChart)</h4>
                      <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                          <BarChart data={dashboardStats.weeklyViews} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                            <XAxis dataKey="name" tick={{fill: "var(--muted)", fontSize: 12}} />
                            <YAxis tick={{fill: "var(--muted)", fontSize: 12}} />
                            <Tooltip contentStyle={{ background: "var(--surface)", borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                            <Bar dataKey="articles" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Widgets */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
                  {/* Category Pie Chart */}
                  {window.Recharts && (
                    <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                      <h4 style={{ fontWeight: "800", color: "var(--ink)", marginBottom: "16px" }}>🔘 Ruknlar Bo'yicha</h4>
                      <div style={{ width: "100%", height: 250 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={dashboardStats.categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {dashboardStats.categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Logs & Memory Status */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                      <h4 style={{ fontWeight: "800", color: "var(--ink)", marginBottom: "16px" }}>⚡ Server Holati (Xotira)</h4>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--muted)" }}>RAM Yuklanishi: {dashboardStats.serverStatus.memUsagePercent}%</span>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>{dashboardStats.serverStatus.usedMemGB} GB / {dashboardStats.serverStatus.totalMemGB} GB</span>
                      </div>
                      <div style={{ width: "100%", height: "8px", background: "var(--line)", borderRadius: "4px", overflow: "hidden", marginBottom: "16px" }}>
                        <div style={{ width: `${dashboardStats.serverStatus.memUsagePercent}%`, height: "100%", background: dashboardStats.serverStatus.memUsagePercent > 80 ? "#ef4444" : "var(--brand)", transition: "width 0.5s ease" }} />
                      </div>

                      {dashboardStats.serverStatus.diskTotalGB && (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--muted)" }}>Disk (Doimiy xotira): {dashboardStats.serverStatus.diskUsagePercent}%</span>
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>{dashboardStats.serverStatus.diskUsedGB} GB / {dashboardStats.serverStatus.diskTotalGB} GB</span>
                          </div>
                          <div style={{ width: "100%", height: "8px", background: "var(--line)", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ width: `${dashboardStats.serverStatus.diskUsagePercent}%`, height: "100%", background: dashboardStats.serverStatus.diskUsagePercent > 80 ? "#ef4444" : "var(--brand)", transition: "width 0.5s ease" }} />
                          </div>
                        </>
                      )}

                      <div style={{ marginTop: "16px", fontSize: "13px", color: "var(--muted)" }}>
                        CPU: {dashboardStats.serverStatus.cpuModel}
                      </div>
                    </div>

                    <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", flex: 1, maxHeight: "200px", overflowY: "auto" }}>
                      <h4 style={{ fontWeight: "800", color: "var(--ink)", marginBottom: "16px" }}>📜 Server Loglari</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {dashboardLogs.slice(0, 10).map((log, i) => (
                          <div key={i} style={{ fontSize: "12px", color: "var(--ink)", padding: "8px", background: "var(--fill)", borderRadius: "4px", fontFamily: "monospace" }}>
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>Yuklanmoqda...</div>
            )}
          </div>
        )}

        {/* Tab videos: Videos Management */}
        {activeTab === "videos" && (
          <AdminVideos videos={videos} setVideos={setVideos} lang={lang} isUz={isUz} categories={categories} />
        )}

        {/* Tab photos: Photos Management */}
        {activeTab === "photos" && (
          <AdminPhotos photos={photos} setPhotos={setPhotos} lang={lang} isUz={isUz} />
        )}

        {/* Tab 2: Articles Management */}
        {activeTab === "articles" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>📝 Maqolalar Ro'yxati</h2>
              <button 
                onClick={() => { setEditingStory(null); setForm({ title: "", category: isUz ? "Siyosat" : "Politics", summary: "", body: "", image: "", author: "Tahririyat", status: "published", time: "Bugun", read: "", isFeatured: false, isEditorChoice: false, isBreaking: false, tags: "", seoTitle: "", seoDescription: "", seoKeywords: "", focusKeyword: "", videoUrl: "", publishAt: "" }); setActiveTab("editor"); }} 
                className="more-news-btn" 
                style={{ padding: "10px 20px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700" }}
              >+ Yangi Maqola</button>
            </div>

            {/* Filter Bar */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
              <input 
                type="text" 
                placeholder="Mavzu bo'yicha qidiruv..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
              />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
              >
                <option value="all">{isUz ? "Barcha ruknlar" : "All Categories"}</option>
                {categories.map(c => {
                   const catName = c.names[lang] || c.names["en"] || c.slug;
                   return <option key={c.id} value={catName}>{catName}</option>;
                })}
              </select>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
              >
                <option value="all">Barcha statuslar</option>
                <option value="published">Chop etilgan</option>
                <option value="draft">Qoralama</option>
              </select>
            </div>

            {/* Articles Table Grid */}
            <div style={{ background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--line)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--fill)", borderBottom: "1px solid var(--line)" }}>
                    <th style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "800", color: "var(--ink)" }}>Mavzu / Sarlavha</th>
                    <th style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "800", color: "var(--ink)" }}>Kategoriya</th>
                    <th style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "800", color: "var(--ink)" }}>Status</th>
                    <th style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "800", color: "var(--ink)", textAlign: "right" }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStories.map(story => (
                    <tr key={story.id} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "16px 24px", fontSize: "15px", fontWeight: "700", color: "var(--ink)" }}>{story.title}</td>
                      <td style={{ padding: "16px 24px", fontSize: "14px", color: "var(--muted)" }}>{story.category}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "700", background: story.status === "published" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)", color: story.status === "published" ? "#10b981" : "#f59e0b" }}>
                          {story.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button onClick={() => handleEdit(story)} style={{ padding: "6px 12px", background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}>Tahrirlash</button>
                        <button onClick={() => handleDelete(story)} style={{ padding: "6px 12px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}>O'chirish</button>
                      </td>
                    </tr>
                  ))}
                  {filteredStories.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "var(--muted)" }}>Maqolalar topilmadi.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Text Editor and Live SEO Optimizer */}
        {activeTab === "editor" && (
          <form onSubmit={handleSave} className="adm-2col-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 2.2fr) minmax(320px, 1fr)", gap: "24px", alignItems: "start" }}>
            
            {/* Main Column (Left) */}
            <div className="adm-col-main" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="adm-card" style={{ background: "var(--surface, #fff)", border: "1px solid var(--line, #e2e8f0)", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--line, #e2e8f0)" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--ink)", margin: 0 }}>
                    ✍️ {editingStory ? "Maqolani Tahrirlash" : "Yangi Maqola Qo'shish"}
                  </h2>
                  <button type="button" onClick={loadDraft} style={{ padding: "6px 12px", background: "var(--fill)", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                    💾 Qoralamani tiklash
                  </button>
                </div>

                {/* Language selection */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Maqola tili</label>
                  <select 
                    value={form.articleLang || "uzk"} 
                    onChange={(e) => {
                      const newLang = e.target.value;
                      let newCat = "";
                      if(categories && categories.length > 0) {
                         newCat = categories[0].names[newLang] || categories[0].names["en"] || categories[0].slug;
                      }
                      
                      let newTitle = form.title;
                      let newSummary = form.summary;
                      let newBody = form.body;
                      let newTags = form.tags;
                      
                      const currentLang = form.articleLang || "uzk";
                      
                      if ((currentLang === "uzk" && newLang === "uz") || (currentLang === "uz" && newLang === "uzk")) {
                        const toCyrillic = newLang === "uzk";
                        newTitle = convertText(form.title, toCyrillic);
                        newSummary = convertText(form.summary, toCyrillic);
                        newBody = convertText(form.body, toCyrillic);
                        newTags = convertText(form.tags, toCyrillic);
                      }
                      
                      setForm({ 
                        ...form, 
                        articleLang: newLang, 
                        category: newCat,
                        title: newTitle,
                        summary: newSummary,
                        body: newBody,
                        tags: newTags
                      });
                    }}
                    className="adm-form-input"
                  >
                    {languages.map(l => (
                       <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {/* Title input */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Sarlavha *</label>
                  <input 
                    type="text" 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Maqola sarlavhasi..."
                    className="adm-form-input"
                    style={{ fontSize: "16px", fontWeight: "700" }}
                  />
                </div>

                {/* Summary / Lead */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Qisqacha mazmun (Подзаголовок)</label>
                  <textarea 
                    rows="3" 
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    placeholder="Maqolaning qisqacha tavsifi..."
                    className="adm-form-input"
                    style={{ resize: "vertical" }}
                  />
                </div>

                {/* Main Body Editor */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Matn</label>
                  <RichEditor 
                    key={form.articleLang || "uzk"}
                    value={form.body}
                    onChange={(html) => setForm({ ...form, body: html })}
                  />
                  <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--muted)", marginTop: "8px", fontWeight: "600" }}>
                    <span>📝 {form.body ? form.body.trim().split(/\s+/).filter(Boolean).length : 0} ta so'z</span>
                    <span>🔤 {form.body ? form.body.length : 0} ta belgi</span>
                    <span>⏱️ ~{Math.ceil((form.body ? form.body.trim().split(/\s+/).filter(Boolean).length : 0) / 200) || 1} daqiqa o'qish</span>
                  </div>
                </div>
              </div>

              {/* SEO Block */}
              <div className="adm-card" style={{ background: "var(--surface, #fff)", border: "1px solid var(--line, #e2e8f0)", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <h3 className="adm-card-header" style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)", margin: "0 0 16px 0", paddingBottom: "12px", borderBottom: "1px solid var(--line, #e2e8f0)" }}>🎯 SEO teglar va tahlil</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Focus Keyword (Asosiy so'z)</label>
                  <input 
                    type="text" 
                    value={form.focusKeyword}
                    onChange={(e) => setForm({ ...form, focusKeyword: e.target.value })}
                    placeholder="Masalan: eksport"
                    className="adm-form-input"
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Kalit so'zlar (Tags)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                    {(form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : []).map((tag, i) => (
                      <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: "#f1f5f9", color: "var(--ink)", borderRadius: "16px", fontSize: "12px", fontWeight: "600", border: "1px solid var(--line)" }}>
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontWeight: "bold", padding: 0, fontSize: "14px" }}>&times;</button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Yangi kalit so'z yozib Enter bosing..."
                    className="adm-form-input"
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                    <button type="button" onClick={() => {
                      const textToAnalyze = (form.title + " " + form.body).toLowerCase();
                      let suggestedTags = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                      let added = 0;
                      adminTags.forEach(t => {
                        if (textToAnalyze.includes(t.name.toLowerCase()) && !suggestedTags.includes(t.name)) {
                          suggestedTags.push(t.name);
                          added++;
                        }
                      });
                      if(added > 0) {
                        setForm({...form, tags: suggestedTags.join(", ")});
                      }
                    }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "var(--ink)", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                      ✨ Avto taglash
                    </button>
                  </div>
                </div>

                {/* SEO Score Feedback */}
                <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: seoScore > 70 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", display: "flex", justifyContent: "center", alignItems: "center", border: `2px solid ${seoScore > 70 ? "#10b981" : "#ef4444"}` }}>
                      <strong style={{ fontSize: "14px", color: seoScore > 70 ? "#10b981" : "#ef4444" }}>{seoScore}</strong>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: "700", fontSize: "13px", color: "var(--ink)", margin: 0 }}>SEO Sifat</h4>
                      <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>Real-vaqt hisob-kitobi</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {seoSuggestions.map((sug, idx) => (
                      <div key={idx} style={{ fontSize: "12px", color: "#ef4444", display: "flex", gap: "6px" }}>
                        <span>⚠️</span> <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar Column (Right) */}
            <div className="adm-col-side" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Action & Publishing Card */}
              <div className="adm-card" style={{ background: "var(--surface, #fff)", border: "1px solid var(--line, #e2e8f0)", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <h3 className="adm-card-header" style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)", margin: "0 0 16px 0", paddingBottom: "12px", borderBottom: "1px solid var(--line, #e2e8f0)" }}>🚀 Nashr qilish</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Holati (Status)</label>
                    <select 
                      value={form.status || "published"} 
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="adm-form-input"
                    >
                      <option value="published">🟢 Darhol nashr qilish</option>
                      <option value="draft">🟡 Qoralama</option>
                    </select>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Rejalashtirish (Vaqti)</label>
                    <input 
                      type="datetime-local" 
                      value={form.publishAt || ""}
                      onChange={(e) => setForm({ ...form, publishAt: e.target.value })}
                      className="adm-form-input"
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button type="button" onClick={() => setActiveTab("articles")} style={{ padding: "12px 16px", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer", flex: 1 }}>
                      Bekor qilish
                    </button>
                    <button type="button" onClick={(e) => { if(!form.title) { alert("Sarlavha kiritilishi shart!"); return; } handleSave(e); }} style={{ padding: "12px 16px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", flex: 1, boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>
                      Saqlash
                    </button>
                  </div>
                </div>
              </div>

              {/* Cover Image Block */}
              <div className="adm-card" style={{ background: "var(--surface, #fff)", border: "1px solid var(--line, #e2e8f0)", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--line, #e2e8f0)" }}>
                  <h3 className="adm-card-header" style={{ margin: 0, borderBottom: "none", paddingBottom: 0, fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>🖼️ Rasm Muqovasi</h3>
                  <button type="button" onClick={() => setShowMediaModal(true)} style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Kutubxona</button>
                </div>
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleImageUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  style={{ border: "2px dashed #cbd5e1", padding: "24px 16px", borderRadius: "8px", textAlign: "center", background: "#f8fafc", cursor: "pointer", transition: "0.2s" }}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    };
                    input.click();
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = "#94a3b8"}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = "#cbd5e1"}
                >
                  {imageUploading ? (
                    <div style={{ color: "#3b82f6", fontWeight: "600", fontSize: "14px" }}>Yuklanmoqda...</div>
                  ) : form.image ? (
                    <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", display: "inline-block" }}>
                      <img src={form.image} alt="Cover preview" style={{ maxHeight: "140px", maxWidth: "100%", borderRadius: "6px", display: "block", margin: "0 auto", border: "1px solid var(--line)" }} />
                      <button type="button" onClick={() => setForm({...form, image: ""})} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
                    </div>
                  ) : (
                    <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                      <div style={{ fontSize: "28px", marginBottom: "6px" }}>📁</div>
                      <strong style={{ color: "var(--ink)" }}>Faylni bu yerga tashlang</strong><br/>
                      <span style={{ fontSize: "12px" }}>Yoki yuklash uchun bosing</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category & Details Card */}
              <div className="adm-card" style={{ background: "var(--surface, #fff)", border: "1px solid var(--line, #e2e8f0)", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <h3 className="adm-card-header" style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)", margin: "0 0 16px 0", paddingBottom: "12px", borderBottom: "1px solid var(--line, #e2e8f0)" }}>📂 Rukn va Parametrlar</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Kategoriya</label>
                    <select 
                      value={form.category} 
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="adm-form-input"
                    >
                      {form.articleLang === "en" ? (
                        <>
                          <option value="Politics">Politics</option>
                          <option value="Economy">Economy</option>
                          <option value="History">History</option>
                          <option value="Philosophy">Philosophy</option>
                          <option value="Literature">Literature</option>
                        </>
                      ) : form.articleLang === "uzk" ? (
                        <>
                          <option value="Сиёсат">Сиёсат</option>
                          <option value="Иқтисодиёт">Иқтисодиёт</option>
                          <option value="Тарих">Тарих</option>
                          <option value="Фалсафа">Фалсафа</option>
                          <option value="Адабиёт">Адабиёт</option>
                        </>
                      ) : (
                        <>
                          <option value="Siyosat">Siyosat</option>
                          <option value="Iqtisodiyot">Iqtisodiyot</option>
                          <option value="Tarix">Tarix</option>
                          <option value="Falsafa">Falsafa</option>
                          <option value="Adabiyot">Adabiyot</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Video URL (ixtiyoriy)</label>
                    <input 
                      type="text" 
                      value={form.videoUrl || ""} 
                      onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="adm-form-input"
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>Ko'rishlar (Prosmotr)</label>
                    <input 
                      type="number" 
                      value={form.views || 0} 
                      onChange={(e) => setForm({ ...form, views: parseInt(e.target.value) || 0 })}
                      className="adm-form-input"
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label className="adm-form-label" style={{ fontWeight: "700", fontSize: "14px", color: "var(--ink)" }}>O'qish vaqti (daqiqa)</label>
                    <input 
                      type="number" 
                      value={form.read || ""} 
                      onChange={(e) => setForm({ ...form, read: e.target.value })}
                      placeholder="Masalan: 5"
                      className="adm-form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles Card */}
              <div className="adm-card" style={{ background: "var(--surface, #fff)", border: "1px solid var(--line, #e2e8f0)", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <h3 className="adm-card-header" style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)", margin: "0 0 16px 0", paddingBottom: "12px", borderBottom: "1px solid var(--line, #e2e8f0)" }}>⚙️ Qo'shimcha Sozlamalar</h3>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  
                  {/* Telegram */}
                  <div 
                    onClick={() => setForm(prev => ({ ...prev, sendToTelegram: !prev.sendToTelegram }))}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line, #e2e8f0)", cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>Telegramga yuborish</span>
                    <div style={{
                      position: "relative",
                      width: "46px",
                      height: "24px",
                      backgroundColor: form.sendToTelegram ? "#2563eb" : "#cbd5e1",
                      borderRadius: "12px",
                      transition: "background-color 0.2s ease"
                    }}>
                      <div style={{
                        position: "absolute",
                        top: "2px",
                        left: form.sendToTelegram ? "24px" : "2px",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#ffffff",
                        borderRadius: "50%",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                        transition: "left 0.2s ease"
                      }} />
                    </div>
                  </div>
                  
                  {/* Push Notification */}
                  <div 
                    onClick={() => setForm(prev => ({ ...prev, sendPushNotification: !prev.sendPushNotification }))}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line, #e2e8f0)", cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>Push xabar (Breaking News)</span>
                    <div style={{
                      position: "relative",
                      width: "46px",
                      height: "24px",
                      backgroundColor: form.sendPushNotification ? "#2563eb" : "#cbd5e1",
                      borderRadius: "12px",
                      transition: "background-color 0.2s ease"
                    }}>
                      <div style={{
                        position: "absolute",
                        top: "2px",
                        left: form.sendPushNotification ? "24px" : "2px",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#ffffff",
                        borderRadius: "50%",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                        transition: "left 0.2s ease"
                      }} />
                    </div>
                  </div>

                  {/* Featured */}
                  <div 
                    onClick={() => setForm(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line, #e2e8f0)", cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>Asosiy maqola (Featured)</span>
                    <div style={{
                      position: "relative",
                      width: "46px",
                      height: "24px",
                      backgroundColor: form.isFeatured ? "#2563eb" : "#cbd5e1",
                      borderRadius: "12px",
                      transition: "background-color 0.2s ease"
                    }}>
                      <div style={{
                        position: "absolute",
                        top: "2px",
                        left: form.isFeatured ? "24px" : "2px",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#ffffff",
                        borderRadius: "50%",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                        transition: "left 0.2s ease"
                      }} />
                    </div>
                  </div>

                  {/* Editor's Choice */}
                  <div 
                    onClick={() => setForm(prev => ({ ...prev, isEditorChoice: !prev.isEditorChoice }))}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line, #e2e8f0)", cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>Tahririyat tanlovi</span>
                    <div style={{
                      position: "relative",
                      width: "46px",
                      height: "24px",
                      backgroundColor: form.isEditorChoice ? "#2563eb" : "#cbd5e1",
                      borderRadius: "12px",
                      transition: "background-color 0.2s ease"
                    }}>
                      <div style={{
                        position: "absolute",
                        top: "2px",
                        left: form.isEditorChoice ? "24px" : "2px",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#ffffff",
                        borderRadius: "50%",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                        transition: "left 0.2s ease"
                      }} />
                    </div>
                  </div>

                  {/* Breaking */}
                  <div 
                    onClick={() => setForm(prev => ({ ...prev, isBreaking: !prev.isBreaking }))}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>Dolzarb xabar (Breaking)</span>
                    <div style={{
                      position: "relative",
                      width: "46px",
                      height: "24px",
                      backgroundColor: form.isBreaking ? "#ef4444" : "#cbd5e1",
                      borderRadius: "12px",
                      transition: "background-color 0.2s ease"
                    }}>
                      <div style={{
                        position: "absolute",
                        top: "2px",
                        left: form.isBreaking ? "24px" : "2px",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#ffffff",
                        borderRadius: "50%",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                        transition: "left 0.2s ease"
                      }} />
                    </div>
                  </div>

                </div>
              </div>
              
              {editingStory && editingStory.history && editingStory.history.length > 0 && (
                  <div className="adm-card" style={{ background: "var(--surface, #fff)", border: "1px solid var(--line, #e2e8f0)", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                    <h3 className="adm-card-header" style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)", margin: "0 0 16px 0", paddingBottom: "12px", borderBottom: "1px solid var(--line, #e2e8f0)" }}>⏳ Tarix</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {editingStory.history.map((hist, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: "var(--fill)", borderRadius: "6px" }}>
                          <span style={{ fontSize: "11px", color: "var(--muted)" }}>{new Date(hist.updatedAt).toLocaleString("uz-UZ")}</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              if (confirm("Rostdan ham ushbu versiyaga qaytishni xohlaysizmi?")) {
                                setForm({ ...form, title: hist.title, summary: hist.summary, body: hist.body, image: hist.image, tags: hist.tags });
                              }
                            }}
                            style={{ padding: "4px 8px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}
                          >
                            Qaytarish
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
              )}
              
            </div>
          </form>
        )}

        

{/* Tab: Comments */}
        {activeTab === "comments" && <AdminComments />}

        {activeTab === "tags" && <AdminTags />}
        
        {activeTab === "pages" && <AdminPages staticPages={staticPages} setStaticPages={setStaticPages} />}

        {/* Tab 6: Translations */}
        {activeTab === "translations" && (
          <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>🌍 Tillar va Tarjimalar</h2>
              <button onClick={saveTranslations} disabled={translationsLoading} style={{ padding: "10px 20px", background: "var(--brand)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                {translationsLoading ? "Saqlanmoqda..." : "💾 O'zgarishlarni saqlash"}
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
              {['uz', 'uzk', 'en'].map(langKey => (
                <div key={langKey}>
                  <h3 style={{ marginBottom: "16px", textTransform: "uppercase" }}>{langKey === 'uz' ? "O'zbek tili (UZ)" : (langKey === 'uzk' ? "Ўзбек (Кирилл)" : "English (EN)")}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {Object.keys(translations.uz || {}).map(key => (
                      <div key={key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "bold" }}>Key: {key}</label>
                        <input 
                          type="text"
                          value={translations[langKey] ? translations[langKey][key] : ''}
                          onChange={(e) => {
                            const updated = { ...translations };
                            if (!updated[langKey]) updated[langKey] = {};
                            updated[langKey][key] = e.target.value;
                            setTranslations(updated);
                          }}
                          style={{ padding: "10px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--fill)", color: "var(--ink)" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && <AdminSettings setSiteConfig={setSiteConfig} isUz={isUz} />}
        {activeTab === "special" && <AdminSpecial setSiteConfig={setSiteConfig} />}
        {activeTab === "security" && <AdminSecurity isUz={isUz} />}
        {activeTab === "users" && <AdminUsers isUz={isUz} />}
        {activeTab === "logs" && <AdminLogs isUz={isUz} />}
        {activeTab === "media" && <AdminMedia isUz={isUz} />}
        {activeTab === "seo-audit" && <AdminSeoAudit allStories={allStories} />}
        {activeTab === "ads" && <AdminAds ads={ads} setAds={setAds} />}
        {activeTab === "trash" && <AdminTrash isUz={isUz} />}
        {activeTab === "kpi" && <AdminKPI isUz={isUz} />}
      </main>
      {showMediaModal && (
        <MediaSelectModal isUz={isUz} onClose={() => setShowMediaModal(false)} onSelect={(url) => {
          setForm(prev => ({ ...prev, image: url }));
          setShowMediaModal(false);
        }} />
      )}
    </div>
  );
};

function AdBanner({ ads, position }) {
  const active = (ads || []).filter(a => a.active && a.position === position);
  if (!active.length) return null;
  const ad = active[Math.floor(Date.now() / 30000) % active.length];
  if (!ad) return null;

  const sizes = {
    super_top: { height: 90, label: "728×90 Leaderboard" },
    top:     { height: 90, label: "728×90 Leaderboard" },
    bottom:  { height: 90, label: "728×90 Leaderboard" },
    sidebar: { height: 250, label: "300×250 Rectangle" },
    inline:  { height: 100, label: "468×100 Banner" },
  };
  const sz = sizes[position] || sizes.inline;

  return (
    <div className={`ad-banner ad-banner-${position}`}>
      <span className="ad-label">Reklama</span>
      {ad.link ? (
        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="ad-inner" style={{minHeight: sz.height}}>
          {ad.image ? (
            <img src={ad.image} alt={ad.title || "Reklama"} />
          ) : (
            <div className="ad-text-banner">
              {ad.title && <strong>{ad.title}</strong>}
              {ad.subtitle && <span>{ad.subtitle}</span>}
            </div>
          )}
        </a>
      ) : (
        <div className="ad-inner" style={{minHeight: sz.height}}>
          {ad.image ? (
            <img src={ad.image} alt={ad.title || "Reklama"} />
          ) : (
            <div className="ad-text-banner">
              {ad.title && <strong>{ad.title}</strong>}
              {ad.subtitle && <span>{ad.subtitle}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Footer({ t, pages, setPage, openAdmin, siteConfig }) {
  const year = new Date().getFullYear();
  const contactEmail = siteConfig?.contact?.email || siteConfig?.email || "vatankont@gmail.com";
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="brand-mark">V</span>
            <strong style={{ fontSize: "22px", color: "#fff" }}>{siteConfig?.siteName || "Vatanuz.uz"}</strong>
          </div>
          <p>{t.portal}. O'zbekiston yangiliklari portali. Tezkor, ishonchli, mustaqil.</p>
          <div className="footer-socials">
            <a href="https://t.me/vatanuz" target="_blank" rel="noopener" title="Telegram">✈</a>
            <a href="https://instagram.com/vatanuz" target="_blank" rel="noopener" title="Instagram">📷</a>
            <a href="https://youtube.com/@vatanuz" target="_blank" rel="noopener" title="YouTube">▶</a>
            <a href="https://facebook.com/vatanuz" target="_blank" rel="noopener" title="Facebook">f</a>
          </div>
        </div>
        <div className="footer-nav">
          <div className="footer-links">
            {pages.map((item) => (
              <button key={item.slug} onClick={() => setPage(item.slug)}>
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="footer-copy">
          <span>© {year} {siteConfig?.siteName || "Vatanuz.uz"}. {window.__currentLang === "en" ? "All rights reserved." : (window.__currentLang === "uzk" ? "Барча ҳуқуқлар ҳимояланган." : "Barcha huquqlar himoyalangan.")}</span>
          <span>{contactEmail}</span>
        </div>
      </div>
    </footer>
  );
}


function AdminPhotos({ photos, setPhotos, lang, isUz }) {
  const [form, setForm] = React.useState({ title: '', meta: '', url: '', images: [], body: '' });
  const [editingId, setEditingId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [showMediaModal, setShowMediaModal] = React.useState(false);
  const ps = photos[lang] || [];

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    
    let currentUrls = [...(form.images || [])];
    if (form.url && currentUrls.length === 0) currentUrls.push(form.url);

    for (const file of files) {
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          try {
            const res = await fetch('/api/admin/upload', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
              },
              body: JSON.stringify({ dataUrl: ev.target.result })
            });
            if (res.ok) {
              const data = await res.json();
              currentUrls.push(data.url);
            }
          } catch (err) {}
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setForm(prev => ({ ...prev, images: currentUrls, url: currentUrls[0] || '' }));
    setUploading(false);
    e.target.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.url) {
      alert(isUz ? "Rasm yuklash majburiy!" : "Image upload required!");
      return;
    }
    setLoading(true);
    try {
      let res;
      if (editingId) {
        res = await fetch("/api/admin/photos/" + lang + "/" + editingId, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1") },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch("/api/admin/photos/" + lang, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1") },
          body: JSON.stringify(form)
        });
      }
      if (res.ok) {
        const fresh = await fetch("/api/photos?t=" + Date.now()).then(r => r.json());
        setPhotos(fresh);
        setForm({ title: "", meta: "", url: "", images: [], body: "" });
        setEditingId(null);
        alert(isUz ? "Foto saqlandi!" : "Photo saved!");
      } else {
        const err = await res.json();
        alert("Xatolik: " + err.message);
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm(isUz ? "Rostdan ham o'chirasizmi?" : "Are you sure?")) return;
    try {
      const res = await fetch("/api/admin/photos/" + lang + "/" + id, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1") }
      });
      if (res.ok) {
        const fresh = await fetch("/api/photos?t=" + Date.now()).then(r => r.json());
        setPhotos(fresh);
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>📸 {isUz ? "Fotolar" : "Photos"}</h2>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", padding: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>{editingId ? (isUz ? "Fotoni tahrirlash" : "Edit photo") : (isUz ? "Yangi foto qo'shish" : "Add new photo")}</h3>
        <form onSubmit={handleSave} className="adm-2col-layout">
          <div className="adm-col-main" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="adm-card">
              <h3 className="adm-card-header">Fotogalereya Yaratish</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="adm-form-label">Sarlavha (Title) - ixtiyoriy</label>
                  <input type="text" className="adm-form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Masalan: Fotoreportaj..." />
                </div>
                <div>
                  <label className="adm-form-label">Rukn va vaqt (Meta) - ixtiyoriy</label>
                  <input type="text" className="adm-form-input" value={form.meta} onChange={e => setForm({...form, meta: e.target.value})} placeholder="Masalan: Dunyo | 12:15" />
                </div>
                <div>
                  <label className="adm-form-label">Matn (ixtiyoriy)</label>
                  <RichEditor value={form.body} onChange={(html) => setForm({...form, body: html})} />
                </div>
              </div>
            </div>
            
            <div className="adm-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 className="adm-card-header" style={{margin:0, borderBottom:"none", paddingBottom:0}}>Rasmlar yuklash</h3>
                <button type="button" onClick={() => setShowMediaModal(true)} style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Kutubxonadan Tanlash</button>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "32px 20px", border: "2px dashed #cbd5e1", borderRadius: "8px", background: "#f8fafc", justifyContent: "center" }}>
                <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} style={{ cursor: "pointer", maxWidth: "250px" }} />
                {uploading && <span style={{ color: "#3b82f6", fontSize: 14, fontWeight: "600" }}>Yuklanmoqda...</span>}
              </div>
              {(form.images && form.images.length > 0) ? (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
                  {form.images.map((img, i) => (
                    <div key={i} style={{ position: "relative", width: 100, height: 100 }}>
                      <img src={img} alt="Preview" style={{ width: "100%", height: "100%", borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)" }} />
                      <button type="button" onClick={() => {
                          const newImages = form.images.filter((_, idx) => idx !== i);
                          setForm({...form, images: newImages, url: newImages[0] || ''});
                      }} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
                    </div>
                  ))}
                </div>
              ) : form.url ? (
                <div style={{ position: "relative", display: "inline-block", marginTop: 16 }}>
                  <img src={form.url} alt="Preview" style={{ height: 100, borderRadius: 6, objectFit: "cover", border: "1px solid var(--line)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "block" }} />
                  <button type="button" onClick={() => setForm({...form, url: ""})} style={{ position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&times;</button>
                </div>
              ) : null}
            </div>
          </div>
          
          <div className="adm-col-side" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
             <div className="adm-card">
               <h3 className="adm-card-header">Amallar</h3>
               <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                 <button type="button" onClick={handleSave} disabled={loading} style={{ padding: "12px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>
                   {loading ? "Saqlanmoqda..." : "Saqlash"}
                 </button>
                 {editingId && (
                   <button type="button" onClick={() => { setEditingId(null); setForm({title:"",meta:"",url:"",images:[],body:""}); }} style={{ padding: "12px 24px", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                     Bekor qilish
                   </button>
                 )}
               </div>
             </div>
          </div>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {ps.map(p => (
          <div key={p.id} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ height: "180px", background: "#f5f5f5", position: "relative" }}>
               <img src={p.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={p.title} />
            </div>
            <div style={{ padding: "16px" }}>
              {p.title && <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: "700", lineHeight: "1.4", height: "42px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.title}</h4>}
              {p.meta && <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--muted)" }}>{p.meta}</p>}
              <div style={{ display: "flex", gap: "8px", marginTop: (!p.title && !p.meta) ? 0 : 16 }}>
                <button onClick={() => { setForm({ title: p.title || "", meta: p.meta || "", url: p.url, images: p.images || (p.url ? [p.url] : []), body: p.body || "" }); setEditingId(p.id); window.scrollTo({top:0, behavior:"smooth"}); }} style={{ flex: 1, padding: "8px", background: "var(--surface)", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Tahrirlash</button>
                <button onClick={() => handleDelete(p.id)} style={{ flex: 1, padding: "8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>O'chirish</button>
              </div>
            </div>
          </div>
        ))}
        {ps.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", gridColumn: "1 / -1", border: "1px dashed var(--line)", borderRadius: "12px" }}>
            Hozircha fotolar yo'q.
          </div>
        )}
      </div>
      {showMediaModal && (
        <MediaSelectModal isUz={isUz} onClose={() => setShowMediaModal(false)} onSelect={(url) => {
          setForm(prev => ({ ...prev, images: [...(prev.images || []), url] }));
          setShowMediaModal(false);
        }} />
      )}
    </div>
  );
}

function AdminVideos({ videos, setVideos, lang, isUz, categories }) {
  const [form, setForm] = React.useState({ title: '', meta: '', url: '', images: [], body: '' });
  const [editingId, setEditingId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showMediaModal, setShowMediaModal] = React.useState(false);
  const vids = videos[lang] || [];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.url) {
      alert(isUz ? "Sarlavha va URL kiritish majburiy!" : "Title and URL are required!");
      return;
    }
    setLoading(true);
    try {
      let res;
      if (editingId) {
        res = await fetch("/api/admin/videos/" + lang + "/" + editingId, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1") },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch("/api/admin/videos/" + lang, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1") },
          body: JSON.stringify(form)
        });
      }
      if (res.ok) {
        const fresh = await fetch("/api/videos?t=" + Date.now()).then(r => r.json());
        setVideos(fresh);
        setForm({ title: "", meta: "", url: "", images: [], body: "" });
        setEditingId(null);
        alert(isUz ? "Video saqlandi!" : "Video saved!");
      } else {
        const err = await res.json();
        alert("Xatolik: " + err.message);
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm(isUz ? "Rostdan ham o'chirasizmi?" : "Are you sure?")) return;
    try {
      const res = await fetch("/api/admin/videos/" + lang + "/" + id, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + document.cookie.replace(/(?:(?:^|.*;\s*)yk_session\s*\=\s*([^;]*).*$)|^.*$/, "$1") }
      });
      if (res.ok) {
        const fresh = await fetch("/api/videos?t=" + Date.now()).then(r => r.json());
        setVideos(fresh);
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--ink)" }}>🎥 {isUz ? "Videolar" : "Videos"}</h2>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", padding: "24px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>{editingId ? (isUz ? "Videoni tahrirlash" : "Edit video") : (isUz ? "Yangi video qo'shish" : "Add new video")}</h3>
        <form onSubmit={handleSave} className="adm-2col-layout">
          <div className="adm-col-main" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="adm-card">
              <h3 className="adm-card-header">Asosiy ma'lumotlar</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="adm-form-label">Sarlavha (Title)</label>
                  <input type="text" className="adm-form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Masalan: Qora dengizdagi yangi kelishuv..." />
                </div>
                <div>
                  <label className="adm-form-label">Rukn va vaqt (Meta)</label>
                  <input type="text" className="adm-form-input" value={form.meta} onChange={e => setForm({...form, meta: e.target.value})} placeholder="Masalan: Dunyo | 12:15" />
                </div>
                <div>
                  <label className="adm-form-label">{isUz ? "Matn (ixtiyoriy)" : "Text (optional)"}</label>
                  <RichEditor value={form.body} onChange={(html) => setForm({...form, body: html})} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="adm-col-side" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
             <div className="adm-card">
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                 <h3 className="adm-card-header" style={{margin:0, borderBottom:"none", paddingBottom:0}}>Video manba</h3>
                 <button type="button" onClick={() => setShowMediaModal(true)} style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Kutubxonadan Tanlash</button>
               </div>
               <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                 <div>
                   <label className="adm-form-label">Video URL (YouTube yoki mp4)</label>
                   <input type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="adm-form-input" required placeholder="https://youtube.com/watch?v=..." />
                 </div>
               </div>
             </div>
             
             <div className="adm-card">
               <h3 className="adm-card-header">Amallar</h3>
               <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                 <button type="button" onClick={handleSave} disabled={loading} style={{ padding: "12px 24px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)" }}>
                   {loading ? "Saqlanmoqda..." : "Saqlash"}
                 </button>
                 {editingId && (
                   <button type="button" onClick={() => { setEditingId(null); setForm({title:"",meta:"",url:"",images:[],body:""}); }} style={{ padding: "12px 24px", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                     Bekor qilish
                   </button>
                 )}
               </div>
             </div>
          </div>
        </form>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {vids.map(v => (
          <div key={v.id || v.title} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ height: "180px", background: "#000", position: "relative" }}>
               {v.url.includes("youtube.com") || v.url.includes("youtu.be") ? (
                 <iframe width="100%" height="100%" src={getYouTubeEmbedUrl(v.url)} frameBorder="0" allowFullScreen></iframe>
               ) : (
                 <video src={v.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} controls />
               )}
            </div>
            <div style={{ padding: "16px" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: "700", lineHeight: "1.4", height: "42px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{v.title}</h4>
              <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--muted)" }}>{v.meta}</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setForm({ title: v.title, meta: v.meta, url: v.url, body: v.body || "" }); setEditingId(v.id); window.scrollTo({top:0, behavior:"smooth"}); }} style={{ flex: 1, padding: "8px", background: "var(--surface)", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Tahrirlash</button>
                <button onClick={() => handleDelete(v.id)} style={{ flex: 1, padding: "8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>O'chirish</button>
              </div>
            </div>
          </div>
        ))}
        {vids.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", gridColumn: "1 / -1", border: "1px dashed var(--line)", borderRadius: "12px" }}>
            Hozircha videolar yo'q. Yuqoridagi formadan foydalanib birinchi videoni qo'shing.
          </div>
        )}
      </div>
      {showMediaModal && (
        <MediaSelectModal isUz={isUz} onClose={() => setShowMediaModal(false)} onSelect={(url) => {
          setForm(prev => ({ ...prev, url: url }));
          setShowMediaModal(false);
        }} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);




