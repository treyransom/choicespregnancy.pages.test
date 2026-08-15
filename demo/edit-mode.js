// DEMO ONLY — visual edit mode. Loaded by demo-loader.js when the URL has ?edit=1.
// Click any element to select it; double-click text to edit it in place.
// Changes are saved per page into content/demo-overrides.json via the local decap-server.
(function () {
  const state = window.__demoState || { allOverrides: {}, overrides: {}, page: 'index.html', animGroups: {}, speeds: ['normal'], applyAnim: () => {} };
  const overrides = state.overrides;
  let selected = null;
  let dirty = false;

  // ---------- selector generation ----------
  function selectorFor(el) {
    if (el.id) return '#' + el.id;
    const path = [];
    let node = el;
    while (node && node !== document.body) {
      if (node.id) { path.unshift('#' + node.id); return path.join(' > '); }
      let seg = node.tagName.toLowerCase();
      const parent = node.parentElement;
      if (parent) {
        const same = [...parent.children].filter((c) => c.tagName === node.tagName);
        if (same.length > 1) seg += ':nth-of-type(' + (same.indexOf(node) + 1) + ')';
      }
      path.unshift(seg);
      node = parent;
    }
    return 'body > ' + path.join(' > ');
  }

  function rec(el) {
    const sel = selectorFor(el);
    if (!overrides[sel]) overrides[sel] = {};
    dirty = true;
    saveBtn.textContent = 'Save changes •';
    return overrides[sel];
  }

  function setStyle(el, prop, value) {
    el.style[prop] = value;
    const o = rec(el);
    if (!o.styles) o.styles = {};
    o.styles[prop] = value;
  }

  function toHex(rgb) {
    const m = rgb.match(/\d+/g);
    if (!m) return '#000000';
    return '#' + m.slice(0, 3).map((v) => (+v).toString(16).padStart(2, '0')).join('');
  }

  // ---------- panel UI ----------
  const panel = document.createElement('div');
  panel.setAttribute('data-editor', '1');
  panel.style.cssText =
    'position:fixed;top:70px;right:12px;width:300px;z-index:100000;background:#16162a;color:#eee;' +
    'border-radius:10px;padding:16px;font:13px/1.6 sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4);' +
    'display:none;max-height:84vh;overflow-y:auto';
  const row = (label, control) => {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin:7px 0';
    const l = document.createElement('span');
    l.textContent = label;
    l.style.opacity = '.75';
    d.append(l, control);
    return d;
  };
  const btnCss = 'background:#2ea3f2;border:0;color:#fff;border-radius:6px;padding:7px 11px;cursor:pointer;font:13px sans-serif';
  const inputCss = 'width:110px;background:#0d0d1c;border:1px solid #333;color:#eee;border-radius:5px;padding:5px 8px;font:13px sans-serif';

  const title = document.createElement('div');
  title.style.cssText = 'font-weight:bold;margin-bottom:2px';
  const selLabel = document.createElement('div');
  selLabel.style.cssText = 'opacity:.5;font-size:10px;word-break:break-all;margin-bottom:8px';
  const langNote = document.createElement('div');
  langNote.style.cssText = 'display:none;background:#3a2f10;color:#ffd66b;border-radius:6px;padding:6px;margin:6px 0;font-size:11px';
  langNote.textContent = 'This text is bilingual — your edit updates English; Spanish would be a separate field in the real build.';

  const sizeIn = document.createElement('input');
  sizeIn.type = 'number'; sizeIn.style.cssText = inputCss;
  sizeIn.oninput = () => selected && setStyle(selected, 'fontSize', sizeIn.value + 'px');

  const colorIn = document.createElement('input');
  colorIn.type = 'color';
  colorIn.oninput = () => selected && setStyle(selected, 'color', colorIn.value);

  const bgIn = document.createElement('input');
  bgIn.type = 'color';
  bgIn.oninput = () => selected && setStyle(selected, 'backgroundColor', bgIn.value);

  const alignWrap = document.createElement('div');
  ['left', 'center', 'right'].forEach((a) => {
    const b = document.createElement('button');
    b.textContent = a[0].toUpperCase();
    b.style.cssText = btnCss + ';background:#333;margin-left:4px';
    b.onclick = () => selected && setStyle(selected, 'textAlign', a);
    alignWrap.appendChild(b);
  });

  const boldBtn = document.createElement('button');
  boldBtn.textContent = 'B';
  boldBtn.style.cssText = btnCss + ';background:#333;font-weight:bold';
  boldBtn.onclick = () => {
    if (!selected) return;
    const cur = getComputedStyle(selected).fontWeight;
    setStyle(selected, 'fontWeight', +cur >= 600 ? '400' : '700');
  };

  const mtIn = document.createElement('input');
  mtIn.type = 'number'; mtIn.style.cssText = inputCss;
  mtIn.oninput = () => selected && setStyle(selected, 'marginTop', mtIn.value + 'px');
  const mbIn = document.createElement('input');
  mbIn.type = 'number'; mbIn.style.cssText = inputCss;
  mbIn.oninput = () => selected && setStyle(selected, 'marginBottom', mbIn.value + 'px');

  // ---------- animation ----------
  const animSel = document.createElement('select');
  animSel.style.cssText = inputCss;
  const noneOpt = document.createElement('option');
  noneOpt.value = 'none'; noneOpt.textContent = 'none';
  animSel.appendChild(noneOpt);
  Object.entries(state.animGroups).forEach(([group, anims]) => {
    const og = document.createElement('optgroup');
    og.label = group;
    Object.keys(anims).forEach((k) => {
      const o = document.createElement('option');
      o.value = k; o.textContent = k;
      og.appendChild(o);
    });
    animSel.appendChild(og);
  });
  const customOpt = document.createElement('option');
  customOpt.value = 'custom'; customOpt.textContent = 'custom…';
  animSel.appendChild(customOpt);

  const trigSel = document.createElement('select');
  trigSel.style.cssText = inputCss;
  [['load', 'on load'], ['hover', 'on hover'], ['loop', 'loop forever']].forEach(([v, l]) => {
    const o = document.createElement('option');
    o.value = v; o.textContent = l;
    trigSel.appendChild(o);
  });

  const speedSel = document.createElement('select');
  speedSel.style.cssText = inputCss;
  state.speeds.forEach((k) => {
    const o = document.createElement('option');
    o.value = k; o.textContent = k;
    speedSel.appendChild(o);
  });
  speedSel.value = 'normal';

  const customWrap = document.createElement('div');
  customWrap.style.display = 'none';
  const customIn = document.createElement('textarea');
  customIn.style.cssText = inputCss + ';width:100%;height:90px;font:11px monospace;margin-top:4px';
  customIn.placeholder = 'from { opacity: 0; transform: translateY(40px) rotate(-5deg); }\nto { opacity: 1; transform: none; }';
  const customApply = document.createElement('button');
  customApply.textContent = 'Apply custom animation';
  customApply.style.cssText = btnCss + ';width:100%;margin-top:4px';
  customWrap.append(customIn, customApply);

  function applyAnim() {
    if (!selected) return;
    const name = animSel.value;
    customWrap.style.display = name === 'custom' ? 'block' : 'none';
    if (name === 'custom' && !customIn.value.trim()) return; // wait for keyframes
    const o = rec(selected);
    if (name === 'none') {
      delete o.animation; delete o.customCss;
    } else {
      o.animation = name;
      o.animTrigger = trigSel.value;
      o.animSpeed = speedSel.value;
      if (name === 'custom') o.customCss = customIn.value.trim();
    }
    selected.style.animation = 'none';
    void selected.offsetWidth; // restart animation
    state.applyAnim(selected, name === 'none' ? {} : o, selectorFor(selected));
  }
  animSel.onchange = applyAnim;
  trigSel.onchange = applyAnim;
  speedSel.onchange = applyAnim;
  customApply.onclick = applyAnim;

  // ---------- images & backgrounds ----------
  const fileIn = document.createElement('input');
  fileIn.type = 'file';
  fileIn.accept = 'image/*';
  fileIn.style.display = 'none';
  let uploadTarget = null; // 'src' | 'bg'

  const imgBtn = document.createElement('button');
  imgBtn.style.cssText = btnCss + ';width:100%;margin-top:8px';
  imgBtn.onclick = () => {
    if (!selected) return;
    uploadTarget = selected.tagName === 'IMG' ? 'src' : 'bg';
    fileIn.click();
  };

  const clearBgBtn = document.createElement('button');
  clearBgBtn.textContent = 'Clear background';
  clearBgBtn.style.cssText = btnCss + ';background:#333;width:100%;margin-top:6px';
  clearBgBtn.onclick = () => {
    if (!selected) return;
    setStyle(selected, 'backgroundImage', '');
    setStyle(selected, 'backgroundColor', '');
  };

  fileIn.onchange = async () => {
    const file = fileIn.files[0];
    fileIn.value = '';
    if (!file || !selected) return;
    imgBtn.textContent = 'Uploading…';
    try {
      const path = await uploadImage(file);
      if (uploadTarget === 'src') {
        selected.src = path;
        rec(selected).src = path;
      } else {
        setStyle(selected, 'backgroundImage', `url('${path}')`);
        setStyle(selected, 'backgroundSize', 'cover');
        setStyle(selected, 'backgroundPosition', 'center');
      }
      imgBtn.textContent = uploadTarget === 'src' ? 'Replace image…' : 'Background image…';
    } catch (err) {
      imgBtn.textContent = 'Upload failed';
      console.error(err);
    }
  };

  function uploadImage(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = reject;
      fr.onload = () => {
        const clean = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
        const path = 'images/uploads/' + Date.now() + '-' + clean;
        fetch('http://localhost:8081/api/v1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'persistMedia',
            params: {
              branch: 'master',
              asset: { path, content: fr.result.split(',')[1], encoding: 'base64' },
              options: { commitMessage: 'edit mode upload' },
            },
          }),
        })
          .then((r) => (r.ok ? resolve(path) : reject(new Error('upload failed: ' + r.status))))
          .catch(reject);
      };
      fr.readAsDataURL(file);
    });
  }

  // ---------- element actions ----------
  const hideBtn = document.createElement('button');
  hideBtn.textContent = 'Hide element';
  hideBtn.style.cssText = btnCss + ';background:#8b2635;width:100%;margin-top:6px';
  hideBtn.onclick = () => {
    if (!selected) return;
    rec(selected).hidden = true;
    selected.style.display = 'none';
    deselect();
  };

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset element';
  resetBtn.style.cssText = btnCss + ';background:#333;width:100%;margin-top:6px';
  resetBtn.onclick = () => {
    if (!selected) return;
    delete overrides[selectorFor(selected)];
    dirty = true;
    save().then(() => location.reload());
  };

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save changes';
  saveBtn.style.cssText = btnCss + ';width:100%;margin-top:12px;padding:8px';
  saveBtn.onclick = save;

  const discardBtn = document.createElement('button');
  discardBtn.textContent = 'Discard this page’s edits';
  discardBtn.style.cssText = btnCss + ';background:#555;width:100%;margin-top:6px';
  discardBtn.onclick = () => {
    Object.keys(overrides).forEach((k) => delete overrides[k]);
    save().then(() => location.reload());
  };

  panel.append(
    title, selLabel, langNote,
    row('Text size', sizeIn), row('Text color', colorIn), row('Background', bgIn),
    row('Align', alignWrap), row('Bold', boldBtn),
    row('Space above', mtIn), row('Space below', mbIn),
    row('Animation', animSel), row('Trigger', trigSel), row('Speed', speedSel), customWrap,
    imgBtn, clearBgBtn, fileIn,
    hideBtn, resetBtn, saveBtn, discardBtn
  );
  document.body.appendChild(panel);

  // top banner
  const bar = document.createElement('div');
  bar.setAttribute('data-editor', '1');
  bar.textContent = 'EDIT MODE (' + state.page + ') — click to style, double-click text to rewrite';
  bar.style.cssText =
    'position:fixed;top:0;left:0;right:0;z-index:100000;background:#2ea3f2;color:#fff;text-align:center;' +
    'font:bold 12px/1 sans-serif;padding:9px;letter-spacing:.3px';
  const exit = document.createElement('a');
  exit.textContent = 'Exit ✕';
  exit.href = location.pathname;
  exit.style.cssText = 'color:#fff;position:absolute;right:14px;top:8px';
  bar.appendChild(exit);
  document.body.appendChild(bar);

  // ---------- nav menu editor ----------
  const nav = state.navModel || [];

  const mk = (txt, fn, bg) => {
    const b = document.createElement('button');
    b.textContent = txt;
    b.style.cssText = btnCss + ';background:' + (bg || '#333') + ';padding:3px 7px';
    b.onclick = fn;
    return b;
  };

  const menuBtn = document.createElement('button');
  menuBtn.textContent = '☰ Edit menu';
  menuBtn.style.cssText = btnCss + ';position:absolute;left:14px;top:5px;background:#0d5c96';
  bar.appendChild(menuBtn);

  const barSaveBtn = document.createElement('button');
  barSaveBtn.textContent = 'Save';
  barSaveBtn.style.cssText = btnCss + ';position:absolute;left:110px;top:5px;background:#1a7a3a';
  barSaveBtn.onclick = () => {
    state.allOverrides._nav = nav;
    save().then(() => {
      barSaveBtn.textContent = 'Saved ✓';
      setTimeout(() => { barSaveBtn.textContent = 'Save'; }, 1500);
    });
  };
  bar.appendChild(barSaveBtn);

  const menuPanel = document.createElement('div');
  menuPanel.setAttribute('data-editor', '1');
  menuPanel.style.cssText =
    'position:fixed;top:70px;left:12px;width:min(540px,94vw);z-index:100000;background:#16162a;color:#eee;' +
    'border-radius:10px;padding:16px;font:13px/1.6 sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4);' +
    'display:none;max-height:84vh;overflow-y:auto';
  document.body.appendChild(menuPanel);

  menuBtn.onclick = () => {
    const open = menuPanel.style.display === 'block';
    menuPanel.style.display = open ? 'none' : 'block';
    if (!open) renderMenu();
  };

  // Rebuild the page's nav from the model. Only structural changes re-render the
  // panel itself — re-rendering on input change would destroy the +/✕ buttons
  // mid-click when an input's blur fires first.
  function applyNavOnly() {
    dirty = true;
    state.applyNav(nav);
    state.refreshLinks();
  }
  function refreshNav() {
    applyNavOnly();
    renderMenu();
  }

  function renderMenu() {
    menuPanel.innerHTML = '';
    const h = document.createElement('div');
    h.textContent = 'Navigation menu';
    h.style.cssText = 'font-weight:bold;margin-bottom:2px';
    const hint = document.createElement('div');
    hint.textContent = '↑↓ reorder · ＋ add sub-item · ✕ remove. Links are page filenames (e.g. faq.html). Changes apply to the menu on every page.';
    hint.style.cssText = 'opacity:.55;font-size:10px;margin-bottom:10px';
    menuPanel.append(h, hint);

    const renderList = (arr, depth) => {
      arr.forEach((item, i) => {
        const rowEl = document.createElement('div');
        rowEl.style.cssText = 'display:flex;gap:4px;align-items:center;margin:4px 0 4px ' + (depth * 18) + 'px';
        if (item.divider) {
          const lbl = document.createElement('span');
          lbl.textContent = '— divider —';
          lbl.style.cssText = 'flex:1;opacity:.5';
          rowEl.appendChild(lbl);
        } else {
          const labelIn = document.createElement('input');
          labelIn.value = item.label;
          labelIn.style.cssText = inputCss + ';flex:2;width:auto';
          labelIn.oninput = () => { item.label = labelIn.value; applyNavOnly(); };
          const hrefIn = document.createElement('input');
          hrefIn.value = item.href || '';
          hrefIn.placeholder = 'page.html';
          hrefIn.style.cssText = inputCss + ';flex:2;width:auto;opacity:.8';
          hrefIn.oninput = () => { item.href = hrefIn.value; applyNavOnly(); };
          rowEl.append(labelIn, hrefIn);
        }
        rowEl.append(
          mk('↑', () => { if (i > 0) { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); refreshNav(); } }),
          mk('↓', () => { if (i < arr.length - 1) { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); refreshNav(); } })
        );
        if (!item.divider && depth < 2) {
          rowEl.append(mk('＋', () => {
            item.children = item.children || [];
            item.children.push({ label: 'New Item', href: '#' });
            refreshNav();
          }, '#0d5c96'));
        }
        rowEl.append(mk('✕', () => { arr.splice(i, 1); refreshNav(); }, '#8b2635'));
        menuPanel.appendChild(rowEl);
        if (item.children && item.children.length) renderList(item.children, depth + 1);
      });
    };
    renderList(nav, 0);

    const foot = document.createElement('div');
    foot.style.cssText = 'display:flex;gap:6px;margin-top:12px;flex-wrap:wrap';
    foot.append(
      mk('+ Item', () => { nav.push({ label: 'New Item', href: '#' }); refreshNav(); }, '#0d5c96'),
      mk('+ Divider', () => { nav.push({ divider: true }); refreshNav(); }, '#333'),
      mk('Save menu', () => { state.allOverrides._nav = nav; save(); }, '#2ea3f2'),
      mk('Close', () => { menuPanel.style.display = 'none'; }, '#555')
    );
    menuPanel.appendChild(foot);
  }

  // ---------- direct on-menu editing ----------
  const navMenuEl = document.getElementById('navMenu');

  function byPath(p) {
    const idx = p.split('.').map(Number);
    let arr = nav, item = null;
    for (const i of idx) { item = arr && arr[i]; arr = item && item.children; }
    return item;
  }
  function parentOf(p) {
    const idx = p.split('.').map(Number);
    let arr = nav;
    for (let k = 0; k < idx.length - 1; k++) arr = arr[idx[k]].children;
    return { arr, i: idx[idx.length - 1] };
  }
  function redoNav() {
    dirty = true;
    saveBtn.textContent = 'Save changes •';
    state.applyNav(nav);
    state.refreshLinks();
    hideTb();
    if (menuPanel.style.display === 'block') renderMenu();
  }

  const tb = document.createElement('div');
  tb.setAttribute('data-editor', '1');
  tb.style.cssText =
    'position:fixed;display:none;z-index:100001;background:#16162a;border-radius:7px;padding:3px;' +
    'box-shadow:0 4px 14px rgba(0,0,0,.5);white-space:nowrap';
  document.body.appendChild(tb);
  let tbPath = null;
  const hideTb = () => { tb.style.display = 'none'; tbPath = null; };

  const tbtn = (txt, tip, fn) => {
    const b = document.createElement('button');
    b.textContent = txt;
    b.title = tip;
    b.style.cssText = btnCss + ';background:#333;padding:7px 10px;margin:0 2px;font-size:12px';
    b.onclick = fn;
    tb.appendChild(b);
  };
  tbtn('rename', 'Rename (or double-click the item)', () => {
    const li = navMenuEl && navMenuEl.querySelector('li[data-path="' + tbPath + '"]');
    if (li) startRename(li);
  });
  tbtn('link', 'Change where this item points', () => {
    const it = byPath(tbPath);
    if (!it || it.divider) return;
    const v = prompt('Link (page filename, e.g. faq.html)', it.href || '');
    if (v !== null) { it.href = v; redoNav(); }
  });
  tbtn('＋ after', 'Add a new item after this one', () => {
    const { arr, i } = parentOf(tbPath);
    arr.splice(i + 1, 0, { label: 'New Item', href: '#' });
    redoNav();
  });
  tbtn('＋ sub', 'Add an item inside (makes this a dropdown)', () => {
    if (tbPath.split('.').length > 2) return; // max 3 levels
    const it = byPath(tbPath);
    if (!it || it.divider) return;
    it.children = it.children || [];
    it.children.push({ label: 'New Item', href: '#' });
    redoNav();
  });
  tbtn('↑', 'Move up / left', () => {
    const { arr, i } = parentOf(tbPath);
    if (i > 0) { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); redoNav(); }
  });
  tbtn('↓', 'Move down / right', () => {
    const { arr, i } = parentOf(tbPath);
    if (i < arr.length - 1) { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); redoNav(); }
  });
  tbtn('go', 'Open this page', () => {
    const li = navMenuEl && navMenuEl.querySelector('li[data-path="' + tbPath + '"]');
    const a = li && li.querySelector(':scope > a');
    if (a && a.getAttribute('href') !== '#') location.href = a.href;
  });
  tbtn('✕', 'Remove this item', () => {
    const { arr, i } = parentOf(tbPath);
    arr.splice(i, 1);
    redoNav();
  });

  function startRename(li) {
    const a = li.querySelector(':scope > a');
    const item = byPath(li.dataset.path);
    if (!a || !item || item.divider) return;
    const input = document.createElement('input');
    input.setAttribute('data-editor', '1');
    input.value = item.label;
    input.style.cssText = 'font:inherit;color:#111;padding:2px 4px;border-radius:4px;border:2px solid #2ea3f2;width:' +
      Math.max(110, a.offsetWidth) + 'px';
    a.style.display = 'none';
    a.parentElement.insertBefore(input, a.nextSibling);
    input.focus();
    input.select();
    input.onblur = () => { item.label = input.value.trim() || item.label; redoNav(); };
    input.onkeydown = (ev) => {
      if (ev.key === 'Enter') input.blur();
      if (ev.key === 'Escape') { input.onblur = null; redoNav(); }
    };
    hideTb();
  }

  if (navMenuEl) {
    // rebuild once so every item carries a data-path (original static nav has none)
    state.applyNav(nav);
    state.refreshLinks();

    navMenuEl.addEventListener('mouseover', (e) => {
      const li = e.target.closest && e.target.closest('li[data-path]');
      if (!li) return;
      tbPath = li.dataset.path;
      const r = li.getBoundingClientRect();
      tb.style.display = 'block';
      // keep the toolbar fully on-screen: clamp right edge, flip above if near the bottom
      const left = Math.min(Math.max(4, r.left), window.innerWidth - tb.offsetWidth - 8);
      const below = r.bottom - 2 + tb.offsetHeight <= window.innerHeight - 8;
      tb.style.left = left + 'px';
      tb.style.top = (below ? r.bottom - 2 : r.top - tb.offsetHeight + 2) + 'px';
    });
    document.addEventListener('mouseover', (e) => {
      if (!e.target.closest) return;
      if (!e.target.closest('#navMenu') && !e.target.closest('[data-editor]')) hideTb();
    });
  }

  // ---------- selection ----------
  function deselect() {
    if (selected) selected.style.outline = '';
    selected = null;
    panel.style.display = 'none';
  }

  function select(el) {
    deselect();
    selected = el;
    el.style.outline = '2px solid #2ea3f2';
    const cs = getComputedStyle(el);
    title.textContent = '<' + el.tagName.toLowerCase() + '>';
    selLabel.textContent = selectorFor(el);
    langNote.style.display = el.hasAttribute('data-en') ? 'block' : 'none';
    sizeIn.value = Math.round(parseFloat(cs.fontSize));
    colorIn.value = toHex(cs.color);
    bgIn.value = toHex(cs.backgroundColor);
    mtIn.value = Math.round(parseFloat(cs.marginTop));
    mbIn.value = Math.round(parseFloat(cs.marginBottom));
    const o = overrides[selectorFor(el)];
    animSel.value = (o && o.animation) || 'none';
    trigSel.value = (o && o.animTrigger) || 'load';
    speedSel.value = (o && o.animSpeed) || 'normal';
    customIn.value = (o && o.customCss) || '';
    customWrap.style.display = animSel.value === 'custom' ? 'block' : 'none';
    imgBtn.textContent = el.tagName === 'IMG' ? 'Replace image…' : 'Background image…';
    panel.style.display = 'block';
  }

  const isEditorUi = (el) => el.closest && el.closest('[data-editor]');

  document.addEventListener('mouseover', (e) => {
    if (isEditorUi(e.target) || e.target === selected || e.target === document.body) return;
    e.target.style.outline = '1px dashed rgba(46,163,242,.7)';
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target !== selected) e.target.style.outline = '';
  });
  document.addEventListener('click', (e) => {
    if (isEditorUi(e.target)) return;
    // allow navigating between pages while staying in edit mode
    const link = e.target.closest && e.target.closest('a[href^="demo/"]');
    if (link && e.detail === 2) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.target === document.body) { deselect(); return; }
    select(e.target);
  }, true);

  // ---------- inline text editing ----------
  document.addEventListener('dblclick', (e) => {
    if (isEditorUi(e.target)) return;
    // nav menu items: double-click renames in place
    const navLi = e.target.closest && e.target.closest('#navMenu li[data-path]');
    if (navLi) { e.preventDefault(); e.stopPropagation(); startRename(navLi); return; }
    // double-click on any other internal link navigates
    const link = e.target.closest && e.target.closest('a[href^="demo/"]');
    if (link) { location.href = link.href; return; }
    const el = e.target;
    const simpleText = [...el.children].every((c) => ['BR', 'SPAN', 'B', 'STRONG', 'EM'].includes(c.tagName));
    if (!simpleText) return;
    e.preventDefault();
    el.contentEditable = 'true';
    el.focus();
    const done = () => {
      el.contentEditable = 'false';
      el.removeEventListener('blur', done);
      const o = rec(el);
      o.text = el.innerHTML;
      if (el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
    };
    el.addEventListener('blur', done);
  }, true);

  // ---------- persistence ----------
  function save() {
    state.allOverrides[state.page] = overrides;
    return fetch('http://localhost:8081/api/v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'persistEntry',
        params: {
          branch: 'master',
          dataFiles: [{ path: 'content/demo-overrides.json', slug: 'demo-overrides', raw: JSON.stringify(state.allOverrides, null, 2) }],
          assets: [],
          options: { useWorkflow: false, status: 'draft', commitMessage: 'edit mode save' },
        },
      }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('save failed: ' + r.status);
        dirty = false;
        saveBtn.textContent = 'Saved ✓';
        setTimeout(() => { saveBtn.textContent = 'Save changes'; }, 1500);
      })
      .catch((err) => {
        saveBtn.textContent = 'Save failed — is decap-server running?';
        console.error(err);
      });
  }

  window.addEventListener('beforeunload', (e) => {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });
})();
