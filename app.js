// shadow maker, single shadow for now
const ids = ['x', 'y', 'blur', 'spread'];
const state = { x: 0, y: 6, blur: 18, spread: 0, color: '#000000' };

const preview = document.getElementById('preview');
const cssOut = document.getElementById('cssOut').querySelector('code');

function update() {
  const value = state.x + 'px ' + state.y + 'px ' + state.blur + 'px ' + state.spread + 'px ' + state.color;
  preview.style.boxShadow = value;
  cssOut.textContent = 'box-shadow: ' + value + ';';
}

ids.forEach((id) => {
  const el = document.getElementById(id);
  const num = document.getElementById(id + 'v');
  el.addEventListener('input', (e) => {
    state[id] = parseInt(e.target.value, 10);
    num.textContent = state[id];
    update();
  });
});

document.getElementById('color').addEventListener('input', (e) => {
  state.color = e.target.value;
  update();
});

update();
