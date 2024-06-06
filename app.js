// shadow-maker, multi layer
const MAX_LAYERS = 5;

let layers = [];

const layersEl = document.getElementById('layers');
const addBtn = document.getElementById('addBtn');
const previewEl = document.getElementById('preview');
const cssOut = document.getElementById('cssOut').querySelector('code');

function uid() { return Math.random().toString(36).slice(2, 8); }

function newLayer() {
  return {
    id: uid(),
    x: 0,
    y: 4,
    blur: 12,
    spread: 0,
    color: '#000000',
    alpha: 0.25,
    inset: false,
  };
}

function hexWithAlpha(hex, alpha) {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16).padStart(2, '0');
  return hex + a;
}

function shadowString(l) {
  const parts = [];
  if (l.inset) parts.push('inset');
  parts.push(l.x + 'px');
  parts.push(l.y + 'px');
  parts.push(l.blur + 'px');
  parts.push(l.spread + 'px');
  parts.push(hexWithAlpha(l.color, l.alpha));
  return parts.join(' ');
}

function compose() {
  if (!layers.length) return 'none';
  return layers.map(shadowString).join(', ');
}

function render() {
  layersEl.innerHTML = '';
  layers.forEach((l, idx) => layersEl.appendChild(layerCard(l, idx)));
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
  colorInput.value = l.color;
  colorInput.oninput = (e) => { l.color = e.target.value; render(); };

  const insetWrap = document.createElement('label');
  insetWrap.className = 'inset';
  const insetCb = document.createElement('input');
  insetCb.type = 'checkbox';
  insetCb.checked = !!l.inset;
  insetCb.onchange = () => { l.inset = insetCb.checked; render(); };
  insetWrap.appendChild(insetCb);
  insetWrap.appendChild(document.createTextNode('inset'));

  bottom.appendChild(colorInput);
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

layers.push(newLayer());
layers[0].y = 6; layers[0].blur = 18; layers[0].alpha = 0.3;
render();
