// shadow-maker
// up to 5 layers, each composes to a single box-shadow string

const MAX_LAYERS = 5;

const presets = {
  subtle: [
    { x: 0, y: 1, blur: 2, spread: 0, color: '#00000022', inset: false },
    { x: 0, y: 2, blur: 6, spread: 0, color: '#00000018', inset: false },
  ],
  hard: [
    { x: 6, y: 6, blur: 0, spread: 0, color: '#000000', inset: false },
  ],
  glow: [
    { x: 0, y: 0, blur: 18, spread: 2, color: '#7aa2ffaa', inset: false },
    { x: 0, y: 0, blur: 36, spread: 6, color: '#7aa2ff44', inset: false },
  ],
  neumorphism: [
    { x: 8, y: 8, blur: 16, spread: 0, color: '#b8bcc4', inset: false },
    { x: -8, y: -8, blur: 16, spread: 0, color: '#ffffff', inset: false },
  ],
  layered: [
    { x: 0, y: 1, blur: 2, spread: 0, color: '#0000001f', inset: false },
    { x: 0, y: 2, blur: 4, spread: 0, color: '#0000001a', inset: false },
    { x: 0, y: 4, blur: 8, spread: 0, color: '#00000014', inset: false },
    { x: 0, y: 8, blur: 16, spread: 0, color: '#0000000f', inset: false },
  ],
};

let layers = [];

const layersEl = document.getElementById('layers');
const addBtn = document.getElementById('addBtn');
const previewEl = document.getElementById('preview');
const cssOut = document.getElementById('cssOut').querySelector('code');
const copyBtn = document.getElementById('copyBtn');

function uid() { return Math.random().toString(36).slice(2, 8); }

function newLayer(seed) {
  return Object.assign({
    id: uid(),
    x: 0,
    y: 4,
    blur: 12,
    spread: 0,
    color: '#000000',
    alpha: 0.25,
    inset: false,
  }, seed || {});
}

// turn a hex like #aabbcc or #aabbccdd into something we can use directly.
// if the hex already includes alpha we keep it, otherwise we tack on alpha from the slider.
function hexWithAlpha(hex, alpha) {
  const h = hex.replace('#', '');
  if (h.length === 8) return '#' + h; // already has alpha
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16).padStart(2, '0');
  return '#' + h + a;
}

function shadowString(layer) {
  const parts = [];
  if (layer.inset) parts.push('inset');
  parts.push(layer.x + 'px');
  parts.push(layer.y + 'px');
  parts.push(layer.blur + 'px');
  parts.push(layer.spread + 'px');
  // if user pasted a color with explicit alpha, trust it. otherwise apply the slider.
  const c = (layer.color && layer.color.length === 9) ? layer.color : hexWithAlpha(layer.color, layer.alpha);
  parts.push(c);
  return parts.join(' ');
}

function compose() {
  if (!layers.length) return 'none';
  return layers.map(shadowString).join(', ');
}

function render() {
  layersEl.innerHTML = '';
  layers.forEach((l, idx) => {
    layersEl.appendChild(layerCard(l, idx));
  });
  addBtn.disabled = layers.length >= MAX_LAYERS;

  const value = compose();
  previewEl.style.boxShadow = value;
  cssOut.textContent = 'box-shadow: ' + value + ';';
}

function layerCard(l, idx) {
  const wrap = document.createElement('div');
  wrap.className = 'layer';

  const head = document.createElement('div');
  head.className = 'layer-head';
  head.innerHTML = '<h3>shadow ' + (idx + 1) + '</h3>';
  const rm = document.createElement('button');
  rm.className = 'remove';
  rm.textContent = 'remove';
  rm.onclick = () => { layers = layers.filter(x => x.id !== l.id); render(); };
  head.appendChild(rm);
  wrap.appendChild(head);

  wrap.appendChild(slider('offset x', l.x, -50, 50, 1, v => { l.x = v; render(); }));
  wrap.appendChild(slider('offset y', l.y, -50, 50, 1, v => { l.y = v; render(); }));
  wrap.appendChild(slider('blur', l.blur, 0, 100, 1, v => { l.blur = v; render(); }));
  wrap.appendChild(slider('spread', l.spread, -50, 50, 1, v => { l.spread = v; render(); }));
  wrap.appendChild(slider('alpha', l.alpha, 0, 1, 0.01, v => { l.alpha = v; render(); }));

  const bottom = document.createElement('div');
  bottom.className = 'bottom';

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  // strip alpha for the native picker, it doesn't support it
  colorInput.value = (l.color || '#000000').slice(0, 7);
  colorInput.oninput = (e) => { l.color = e.target.value; hexBox.value = l.color; render(); };

  const hexBox = document.createElement('input');
  hexBox.className = 'hex';
  hexBox.value = l.color;
  hexBox.oninput = (e) => {
    const v = e.target.value.trim();
    if (/^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) {
      l.color = v;
      colorInput.value = v.slice(0, 7);
      render();
    }
  };

  const insetWrap = document.createElement('label');
  insetWrap.className = 'inset';
  const insetCb = document.createElement('input');
  insetCb.type = 'checkbox';
  insetCb.checked = !!l.inset;
  insetCb.onchange = () => { l.inset = insetCb.checked; render(); };
  insetWrap.appendChild(insetCb);
  insetWrap.appendChild(document.createTextNode('inset'));

  bottom.appendChild(colorInput);
  bottom.appendChild(hexBox);
  bottom.appendChild(insetWrap);
  wrap.appendChild(bottom);

  return wrap;
}

function slider(label, val, min, max, step, onChange) {
  const row = document.createElement('div');
  row.className = 'row';
  const lab = document.createElement('label');
  lab.textContent = label;
  const inp = document.createElement('input');
  inp.type = 'range';
  inp.min = min; inp.max = max; inp.step = step; inp.value = val;
  const num = document.createElement('span');
  num.className = 'num';
  num.textContent = String(val);
  inp.oninput = (e) => {
    const v = step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
    num.textContent = step < 1 ? v.toFixed(2) : String(v);
    onChange(v);
  };
  row.appendChild(lab);
  row.appendChild(inp);
  row.appendChild(num);
  return row;
}

addBtn.onclick = () => {
  if (layers.length >= MAX_LAYERS) return;
  layers.push(newLayer());
  render();
};

document.getElementById('presetRow').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-preset]');
  if (!btn) return;
  const name = btn.dataset.preset;
  const seeds = presets[name];
  if (!seeds) return;
  // presets ship with explicit hex+alpha colors, so set alpha=1 and let the
  // 8-digit hex carry the transparency.
  layers = seeds.slice(0, MAX_LAYERS).map(s => newLayer(Object.assign({}, s, { alpha: 1 })));
  render();
});

copyBtn.onclick = async () => {
  const text = cssOut.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.classList.add('ok');
    copyBtn.textContent = 'copied';
    setTimeout(() => {
      copyBtn.classList.remove('ok');
      copyBtn.textContent = 'copy';
    }, 1200);
  } catch (err) {
    console.log('clipboard failed', err);
  }
};

// start with one layer so the page isn't empty
layers.push(newLayer({ y: 6, blur: 18, alpha: 0.3 }));
render();
