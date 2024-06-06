# shadow-maker

stack css `box-shadow` layers and watch them update live. plain html/css/js, no build.

## what it does

- up to 5 shadow layers, each with offset x, offset y, blur, spread, color, alpha, inset
- live preview on a sample card
- generated `box-shadow` value shown below

each layer is composed into a string and joined with `, `. the order in the panel is the render order, so the first layer sits on top of the next.

## running

```
git clone https://github.com/secanakbulut/shadow-maker.git
cd shadow-maker
open index.html
```

still adding presets and a copy button. PolyForm Noncommercial 1.0.0, see `LICENSE`.
