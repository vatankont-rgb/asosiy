const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const purify = DOMPurify(window);

function sanitizeHtml(dirtyHtml) {
  if (!dirtyHtml) return "";
  return purify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'a', 'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'iframe', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'src', 'target', 'class', 'id', 'width', 'height', 'frameborder', 'allowfullscreen', 'alt', 'style', 'align'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    ADD_TAGS: ['iframe'],
    ALLOW_UNKNOWN_PROTOCOLS: false
  });
}

module.exports = { sanitizeHtml };
