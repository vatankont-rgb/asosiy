const fs = require('fs');

let appJsx = fs.readFileSync('app.jsx', 'utf8');

const translations = {
  "СРОЧНО": "BREAKING",
  "Самые актуальные новости недели": "Top news of the week",
  "Выбор редакции": "Editor's Choice",
  "Читать все": "Read all",
  "Видео": "Video",
  "Фото": "Photo",
  "Главные видео дня": "Main videos of the day",
  "Фоторепортажи и визуальные материалы": "Photo reports and visual materials",
  "Смотреть →": "Watch →",
  "Посмотреть →": "View →",
  "Загрузка...": "Loading...",
  "На основе истории чтения": "Based on reading history",
  "Живая редакция": "Live Newsroom",
  "Быстрые новости": "Fast news",
  "Независимый анализ": "Independent analysis",
  "На двух языках": "Bilingual",
  "Надёжный источник": "Reliable source",
  "Мониторинг": "Monitoring",
  "Разделов": "Sections",
  "Языка": "Languages",
  "Статей": "Articles",
  "Назад": "Back",
  "материалов": "articles",
  "Материалы не найдены": "No articles found",
  "Материалы по этому тегу не найдены": "No articles found for this tag",
  "Гость": "Guest",
  "👓 Обычный вид": "👓 Normal view",
  "👓 Чистое чтение": "👓 Clean read",
  "📋 Содержание": "📋 Table of Contents",
  "просмотров": "views",
  "Реакция:": "Reaction:",
  "Поделиться:": "Share:",
  "✓ Скопировано": "✓ Copied",
  "🔗 Ссылка": "🔗 Link",
  "Печать": "Print",
  "Похожие материалы": "Related articles",
  "Ваше имя (необязательно)": "Your name (optional)",
  "Напишите ваш комментарий...": "Write your comment...",
  "Комментарий добавлен!": "Comment added!",
  "Отправить": "Send",
  "Заголовок слишком короткий": "Title is too short",
  "Описание слишком короткое": "Summary is too short",
  "Добавьте ключевое слово в заголовок": "Add a keyword to the title",
  "Текст статьи слишком короткий": "Article text is too short",
  "Неверный пароль": "Incorrect password",
  "Статья успешно сохранена!": "Article saved successfully!",
  "Подтверждаете удаление?": "Are you sure you want to delete?",
  "Резервная копия успешно восстановлена!": "Backup restored successfully!",
  "Введите пароль для входа в панель:": "Enter password to access the panel:",
  "Войти": "Login",
  "Бошқарув панели": "Dashboard",
  "⚙️ Zaxiralash ва Маълумотлар (Backup)": "⚙️ Backup & Data",
  "Barcha maqolalar, sozlamalar va ruknlarni bitta JSON fayl holatida yukлаб олинг ёки тикланг.": "Download or restore all articles, settings, and sections as a single JSON file."
};

for (const [ru, en] of Object.entries(translations)) {
  const regex = new RegExp(`"${ru}"`, 'g');
  appJsx = appJsx.replace(regex, `"${en}"`);
}

fs.writeFileSync('app.jsx', appJsx);
console.log('Inline Russian text translated to English in app.jsx');
