// DEMO ONLY — applies content/*.json (edited via /admin or ?edit=1 mode) onto demo copies of the site pages.

// Lighten (pct > 0) or darken (pct < 0) a #rrggbb color.
function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => {
    const adj = pct < 0 ? v * (1 + pct / 100) : v + (255 - v) * (pct / 100);
    return Math.max(0, Math.min(255, Math.round(adj)));
  };
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(ch);
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Animation catalog: display name → keyframe name. Grouped for the editor UI.
const DEMO_ANIM_GROUPS = {
  'Entrances': {
    'fade': 'demoFade', 'fade-up': 'demoFadeUp', 'fade-down': 'demoFadeDown',
    'fade-left': 'demoFadeLeft', 'fade-right': 'demoFadeRight',
    'slide-up': 'demoSlideUp', 'slide-down': 'demoSlideDown',
    'slide-left': 'demoSlideLeft', 'slide-right': 'demoSlideRight',
    'zoom-in': 'demoZoomIn', 'zoom-out': 'demoZoomOut',
    'bounce-in': 'demoBounceIn', 'drop-in': 'demoDropIn', 'pop': 'demoPop',
    'flip-in-x': 'demoFlipInX', 'flip-in-y': 'demoFlipInY',
    'rotate-in': 'demoRotateIn', 'roll-in': 'demoRollIn',
    'blur-in': 'demoBlurIn', 'wipe-up': 'demoWipeUp', 'wipe-left': 'demoWipeLeft',
  },
  'Attention': {
    'shake': 'demoShake', 'wobble': 'demoWobble', 'tada': 'demoTada',
    'jello': 'demoJello', 'swing': 'demoSwing', 'rubber-band': 'demoRubberBand',
    'flash': 'demoFlash', 'heartbeat': 'demoHeartbeat', 'bounce': 'demoBounce',
  },
  'Loops': {
    'pulse': 'demoPulse', 'float': 'demoFloat', 'spin': 'demoSpin',
    'wiggle': 'demoWiggle', 'glow': 'demoGlow', 'breathe': 'demoBreathe',
  },
};
const DEMO_ANIMS = Object.assign({ 'zoom': 'demoZoomIn', 'flip-in': 'demoFlipInX' }, // legacy aliases
  ...Object.values(DEMO_ANIM_GROUPS));
const DEMO_LOOP_NAMES = Object.keys(DEMO_ANIM_GROUPS.Loops);
const DEMO_SPEEDS = { fast: 0.5, normal: 0.9, slow: 1.6 };

const demoHash = (s) => s.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0).toString(36);

// Apply an override's animation settings to an element.
// o: { animation, animSpeed, animTrigger: 'load'|'hover'|'loop', customCss }
function demoApplyAnim(el, o, selKey) {
  el.removeAttribute('data-demo-hover');
  if (!o || !o.animation) { el.style.animation = ''; return; }
  const dur = DEMO_SPEEDS[o.animSpeed] || DEMO_SPEEDS.normal;
  // custom keyframes: user-authored @keyframes body, injected under a stable per-element name
  if (o.animation === 'custom') {
    if (!o.customCss) return;
    const id = 'demo-kf-' + demoHash(selKey || 'x');
    let st = document.getElementById(id);
    if (!st) { st = document.createElement('style'); st.id = id; document.head.appendChild(st); }
    const name = 'demoC' + demoHash(selKey || 'x');
    st.textContent = '@keyframes ' + name + ' { ' + o.customCss + ' }';
    el.style.animation = o.animTrigger === 'loop'
      ? `${name} ${(dur * 2.4).toFixed(1)}s ease-in-out infinite`
      : `${name} ${dur}s ease both`;
    return;
  }
  const kf = DEMO_ANIMS[o.animation];
  if (!kf) return;
  const loop = o.animTrigger === 'loop' || (!o.animTrigger && DEMO_LOOP_NAMES.includes(o.animation));
  if (o.animTrigger === 'hover') {
    el.style.animation = '';
    el.setAttribute('data-demo-hover', o.animation);
    el.style.setProperty('--demo-dur', dur + 's');
  } else if (loop) {
    const timing = o.animation === 'spin' ? 'linear' : 'ease-in-out';
    el.style.animation = `${kf} ${(dur * 2.4).toFixed(1)}s ${timing} infinite`;
  } else {
    el.style.animation = `${kf} ${dur}s ease both`;
  }
}

function demoAnimCss(name, speed) {
  const kf = DEMO_ANIMS[name];
  if (!kf) return '';
  return `${kf} ${DEMO_SPEEDS[speed] || DEMO_SPEEDS.normal}s ease both`;
}

function injectKeyframes() {
  const fx = document.createElement('style');
  fx.textContent = `
    @keyframes demoFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes demoFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
    @keyframes demoFadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: none; } }
    @keyframes demoFadeLeft { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
    @keyframes demoFadeRight { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }
    @keyframes demoSlideUp { from { opacity: 0; transform: translateY(36px); } to { opacity: 1; transform: none; } }
    @keyframes demoSlideDown { from { opacity: 0; transform: translateY(-36px); } to { opacity: 1; transform: none; } }
    @keyframes demoSlideLeft { from { opacity: 0; transform: translateX(48px); } to { opacity: 1; transform: none; } }
    @keyframes demoSlideRight { from { opacity: 0; transform: translateX(-48px); } to { opacity: 1; transform: none; } }
    @keyframes demoZoomIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }
    @keyframes demoZoomOut { from { opacity: 0; transform: scale(1.15); } to { opacity: 1; transform: none; } }
    @keyframes demoBounceIn { 0% { opacity: 0; transform: scale(0.7); } 60% { opacity: 1; transform: scale(1.06); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes demoDropIn { 0% { opacity: 0; transform: translateY(-120px); } 60% { opacity: 1; transform: translateY(6px); } 80% { transform: translateY(-3px); } 100% { opacity: 1; transform: none; } }
    @keyframes demoPop { 0% { opacity: 0; transform: scale(0.5); } 70% { transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes demoFlipInX { from { opacity: 0; transform: perspective(600px) rotateX(70deg); } to { opacity: 1; transform: none; } }
    @keyframes demoFlipInY { from { opacity: 0; transform: perspective(600px) rotateY(70deg); } to { opacity: 1; transform: none; } }
    @keyframes demoRotateIn { from { opacity: 0; transform: rotate(-180deg) scale(0.6); } to { opacity: 1; transform: none; } }
    @keyframes demoRollIn { from { opacity: 0; transform: translateX(-80px) rotate(-120deg); } to { opacity: 1; transform: none; } }
    @keyframes demoBlurIn { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
    @keyframes demoWipeUp { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0 0 0 0); } }
    @keyframes demoWipeLeft { from { clip-path: inset(0 0 0 100%); } to { clip-path: inset(0 0 0 0); } }
    @keyframes demoShake { 0%, 100% { transform: none; } 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
    @keyframes demoWobble { 0%, 100% { transform: none; } 15% { transform: translateX(-12px) rotate(-6deg); } 30% { transform: translateX(8px) rotate(4deg); } 45% { transform: translateX(-6px) rotate(-3deg); } 60% { transform: translateX(4px) rotate(2deg); } 75% { transform: translateX(-2px) rotate(-1deg); } }
    @keyframes demoTada { 0%, 100% { transform: scale(1); } 10%, 20% { transform: scale(0.94) rotate(-3deg); } 30%, 50%, 70%, 90% { transform: scale(1.06) rotate(3deg); } 40%, 60%, 80% { transform: scale(1.06) rotate(-3deg); } }
    @keyframes demoJello { 0%, 100% { transform: none; } 25% { transform: skewX(-6deg); } 50% { transform: skewX(4deg); } 65% { transform: skewX(-2deg); } 80% { transform: skewX(1deg); } }
    @keyframes demoSwing { 0%, 100% { transform: none; } 20% { transform: rotate(8deg); } 40% { transform: rotate(-6deg); } 60% { transform: rotate(4deg); } 80% { transform: rotate(-2deg); } }
    @keyframes demoRubberBand { 0%, 100% { transform: scale(1); } 30% { transform: scale(1.2, 0.8); } 40% { transform: scale(0.8, 1.2); } 50% { transform: scale(1.12, 0.9); } 65% { transform: scale(0.95, 1.03); } 80% { transform: scale(1.03, 0.98); } }
    @keyframes demoFlash { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }
    @keyframes demoHeartbeat { 0%, 28%, 70%, 100% { transform: scale(1); } 14%, 42% { transform: scale(1.1); } }
    @keyframes demoBounce { 0%, 50%, 80%, 100% { transform: none; } 30% { transform: translateY(-18px); } 65% { transform: translateY(-8px); } }
    @keyframes demoPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes demoFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes demoSpin { to { transform: rotate(360deg); } }
    @keyframes demoWiggle { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
    @keyframes demoGlow { 0%, 100% { box-shadow: 0 0 0 rgba(46,163,242,0); } 50% { box-shadow: 0 0 22px var(--primary, #2ea3f2); } }
    @keyframes demoBreathe { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.75; transform: scale(1.02); } }
    ${Object.entries(DEMO_ANIMS).map(([name, kf]) =>
      `[data-demo-hover="${name}"]:hover { animation: ${kf} var(--demo-dur, .9s) ease; }`).join('\n')}`;
  document.head.appendChild(fx);
}

function applyTheme(t) {
  const root = document.documentElement.style;

  root.setProperty('--primary', t.color_primary);
  root.setProperty('--primary-dark', shade(t.color_primary, -18));
  root.setProperty('--primary-light', shade(t.color_primary, 25));
  root.setProperty('--secondary', t.color_secondary);
  root.setProperty('--accent', t.color_accent);
  root.setProperty('--gradient-primary', `linear-gradient(135deg, ${t.color_primary} 0%, ${t.color_secondary} 100%)`);
  root.setProperty('--gradient-soft', `linear-gradient(135deg, ${shade(t.color_primary, 88)} 0%, ${shade(t.color_secondary, 88)} 100%)`);

  const fam = (f) => f.replace(/ /g, '+') + ':wght@300;400;500;600;700';
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fam(t.font_display)}&family=${fam(t.font_body)}&display=swap`;
  document.head.appendChild(link);
  root.setProperty('--font-display', `'${t.font_display}', Georgia, serif`);
  root.setProperty('--font-body', `'${t.font_body}', -apple-system, sans-serif`);

  const corner = { rounded: null, soft: 0.5, square: 0 }[t.corners];
  if (corner !== null && corner !== undefined) {
    const base = { '--radius-sm': 8, '--radius': 12, '--radius-lg': 20, '--radius-xl': 28 };
    for (const [k, v] of Object.entries(base)) root.setProperty(k, Math.round(v * corner) + 'px');
  }

  if (t.animations !== 'full') {
    const css = t.animations === 'off'
      ? '*, *::before, *::after { animation: none !important; transition: none !important; }'
      : '*, *::before, *::after { animation-duration: .15s !important; transition-duration: .1s !important; }';
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
}

function applyContent(c) {
  const set = (sel, en, es, asHtml) => {
    const el = document.querySelector(sel);
    if (!el) return;
    if (asHtml) el.innerHTML = en; else el.textContent = en;
    el.setAttribute('data-en', en);
    if (es) el.setAttribute('data-es', es);
  };

  const banner = document.getElementById('crisisBanner');
  if (banner) {
    if (c.show_crisis_banner === false) banner.style.display = 'none';
    if (c.crisis_color) banner.style.setProperty('background', c.crisis_color, 'important');
  }

  const s = c.hero_style || {};
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    if (s.align && s.align !== 'default') {
      heroContent.style.textAlign = s.align;
      const flexAlign = s.align === 'center' ? 'center' : 'flex-start';
      document.querySelectorAll('.hero-cta, .hero-features').forEach((el) => {
        el.style.justifyContent = flexAlign;
      });
    }
    const scale = parseFloat(s.size || '1');
    if (scale !== 1) {
      document.querySelectorAll('.hero-content h1, .hero-subtitle').forEach((el) => {
        el.style.fontSize = parseFloat(getComputedStyle(el).fontSize) * scale + 'px';
      });
    }
    if (s.effect && s.effect !== 'none') {
      heroContent.style.animation = demoAnimCss(s.effect, 'normal');
    }
  }
  set('.crisis-banner span[data-en]', c.crisis_text_en, c.crisis_text_es);
  set('.hero-badge', c.hero_badge_en, c.hero_badge_es);

  const heroImg = document.querySelector('.hero-bg img');
  if (heroImg && c.hero_image) heroImg.src = c.hero_image.replace(/^\//, '');
  const overlay = document.querySelector('.hero-overlay');
  if (overlay && typeof c.hero_overlay === 'number') {
    const d = c.hero_overlay / 100;
    overlay.style.setProperty(
      'background',
      `linear-gradient(135deg, rgba(10,15,25,${Math.min(1, d + 0.1)}) 0%, rgba(15,20,35,${Math.max(0, d - 0.05)}) 100%)`,
      'important'
    );
  }

  const h1 = (l1, l2) => l1 + "<br><span class='highlight'>" + l2 + "</span>";
  set('.hero-content h1', h1(c.hero_line1_en, c.hero_line2_en), h1(c.hero_line1_es, c.hero_line2_es), true);

  set('.hero-subtitle', c.hero_subtitle_en, c.hero_subtitle_es);
  set('#heroScheduleBtn span', c.cta_schedule_en, c.cta_schedule_es);

  const tel = 'tel:' + c.phone.replace(/[^0-9]/g, '');
  const crisisLink = document.querySelector('.crisis-link');
  if (crisisLink) { crisisLink.textContent = c.phone; crisisLink.href = tel; }
  const callBtn = document.querySelector('.hero-cta .btn-secondary');
  if (callBtn) { callBtn.href = tel; }
  set('.hero-cta .btn-secondary span', 'Call ' + c.phone, 'Llamar ' + c.phone);
}

// Overrides recorded by the ?edit=1 visual editor — applied last so they win.
function applyOverrides(pageOverrides) {
  for (const [sel, o] of Object.entries(pageOverrides)) {
    const el = document.querySelector(sel);
    if (!el) continue;
    if (o.hidden) { el.style.display = 'none'; continue; }
    if (o.text !== undefined) {
      el.innerHTML = o.text;
      if (el.hasAttribute('data-en')) el.setAttribute('data-en', o.text);
    }
    if (o.src && el.tagName === 'IMG') el.src = o.src.replace(/^\//, '');
    if (o.styles) Object.assign(el.style, o.styles);
    if (o.animation) demoApplyAnim(el, o, sel);
  }
}

// ---------- nav menu structure (shared across all pages, stored under the "_nav" key) ----------
// model: [{ label, label_es, href, children: [...] } | { divider: true }]
function parseNavDom() {
  const menu = document.getElementById('navMenu');
  if (!menu) return [];
  const parseLi = (li) => {
    const a = li.querySelector(':scope > a');
    const item = {
      label: a ? (a.getAttribute('data-en') || a.textContent.trim()) : '',
      label_es: (a && a.getAttribute('data-es')) || '',
      href: a ? a.getAttribute('href') : '#',
    };
    const sub = li.querySelector(':scope > ul');
    if (sub) item.children = [...sub.children].map(parseLi);
    return item;
  };
  return [...menu.children]
    .filter((li) => !li.classList.contains('mobile-menu-logo'))
    .map((li) => (li.classList.contains('mobile-menu-divider') ? { divider: true } : parseLi(li)));
}

function buildNavDom(items) {
  const menu = document.getElementById('navMenu');
  if (!menu) return;
  const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M6 9l6 6 6-6"/></svg>';
  const keep = [...menu.children].filter((li) => li.classList.contains('mobile-menu-logo'));
  menu.innerHTML = '';
  keep.forEach((li) => menu.appendChild(li));
  const build = (item, depth, path) => {
    const li = document.createElement('li');
    li.setAttribute('data-path', path);
    if (item.divider) { li.className = 'mobile-menu-divider'; return li; }
    const hasKids = item.children && item.children.length;
    if (hasKids) li.className = depth === 0 ? 'nav-dropdown' : 'nav-sub-dropdown';
    const a = document.createElement('a');
    a.setAttribute('href', item.href || '#');
    a.setAttribute('data-en', item.label);
    if (item.label_es) a.setAttribute('data-es', item.label_es);
    a.textContent = item.label + (hasKids && depth === 0 ? ' ' : '');
    if (hasKids && depth === 0) a.insertAdjacentHTML('beforeend', CHEV);
    li.appendChild(a);
    if (hasKids) {
      const ul = document.createElement('ul');
      ul.className = depth === 0 ? 'dropdown-menu' : 'sub-dropdown-menu';
      item.children.forEach((c, ci) => ul.appendChild(build(c, depth + 1, path + '.' + ci)));
      li.appendChild(ul);
    }
    return li;
  };
  items.forEach((i, idx) => menu.appendChild(build(i, 0, String(idx))));
}

// Keep navigation inside the demo copies (and carry ?edit=1 along).
function rewriteLinks(editMode) {
  document.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    const m = href && href.match(/^([a-zA-Z0-9-]+\.html)(#.*)?$/);
    if (!m) return;
    a.setAttribute('href', 'demo/' + m[1] + (editMode ? '?edit=1' : '') + (m[2] || ''));
  });
}

const j = (url) => fetch(url, { cache: 'no-store' }).then((r) => r.json());

Promise.all([
  j('content/demo.json'),
  j('content/theme.json'),
  j('content/demo-overrides.json').catch(() => ({})),
])
  .then(([content, theme, allOverrides]) => {
    const page = location.pathname.split('/').pop() || 'index.html';
    if (!allOverrides[page]) allOverrides[page] = {};
    const editMode = new URLSearchParams(location.search).get('edit') === '1';

    injectKeyframes();
    applyTheme(theme);
    applyContent(content);
    const navModel = allOverrides._nav || parseNavDom();
    if (allOverrides._nav) buildNavDom(navModel);
    applyOverrides(allOverrides[page]);
    rewriteLinks(editMode);

    window.__demoState = {
      allOverrides,
      overrides: allOverrides[page],
      page,
      animGroups: DEMO_ANIM_GROUPS,
      speeds: Object.keys(DEMO_SPEEDS),
      applyAnim: demoApplyAnim,
      navModel,
      applyNav: buildNavDom,
      refreshLinks: () => rewriteLinks(editMode),
    };

    if (editMode) {
      const s = document.createElement('script');
      s.src = 'demo/edit-mode.js?v=' + Date.now(); // cache-bust: always load the latest editor
      document.body.appendChild(s);
    } else {
      const ribbon = document.createElement('div');
      ribbon.textContent = 'DEMO PREVIEW — edits from /admin appear here · add ?edit=1 to the URL for visual edit mode';
      ribbon.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#1a1a2e;color:#fff;text-align:center;font:13px/1.4 sans-serif;padding:8px;opacity:.92';
      document.body.appendChild(ribbon);
    }
  })
  .catch((e) => console.error('Demo loader failed:', e));
