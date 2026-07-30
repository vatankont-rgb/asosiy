const fs = require('fs');

const cssToAdd = `
/* --- Admin 2-Column Premium Layout --- */
.adm-2col-layout {
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 1024px) {
  .adm-2col-layout {
    grid-template-columns: 1fr;
  }
}

.adm-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.adm-card-header {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

/* iOS Style Toggle Switches */
.adm-toggle-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
}
.adm-toggle-wrapper:last-child {
  border-bottom: none;
}

.adm-toggle-label-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.adm-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.adm-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.adm-toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--line);
  transition: .3s;
  border-radius: 24px;
}

.adm-toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.adm-toggle input:checked + .adm-toggle-slider {
  background-color: #3b82f6; /* Premium blue */
}

.adm-toggle input:checked + .adm-toggle-slider:before {
  transform: translateX(20px);
}
`;

fs.appendFileSync('styles.css', cssToAdd);
console.log('Appended premium CSS to styles.css');
