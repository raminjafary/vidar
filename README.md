<h1 align="center">vidar</h1>

<p align="center"><strong>Generate high-performance heatmap.</strong></p>

<p align="center">Fork of simpleheat.js with more focus on perfomance and maintainable code.</p>

[Demo](./playground/front)

## Usage

#### Rendering

```js
// create a heatmap object given an id or canvas reference
const heatmap = new Canvas2dRenderer(canvas);
// draw the heatmap
heatmap.draw();
```

#### Data

```js
// set data of [[x, y, value], ...] format
heatmap.data = data

// add a data point
heatmap.addData(point);

// clear data
heatmap.clearData();
```

#### Appearance

```js
// set point radius and blur radius (25 and 15 by default)
heatmap.setRadius(radius, blur);

// set gradient colors as {<stop>: '<color>'}
// e.g. {0.4: 'blue', 0.65: 'lime', 1: 'red'}
heatmap.setGradient(gradient);

// call in case Canvas size changed
heatmap.resizeCanvas();
```

#### DOM Screenshot with [html2canvas](https://github.com/niklasvh/html2canvas)
```js
// you can take screenshot from DOM at a given time with data points baked in
const capture = document.querySelector('#capture')
html2canvas(capture)
  .then(canvas => {
    document.body.appendChild(canvas)
    canvas.style.display = 'none'
    return canvas
  })
  .then(canvas => {
    const image = canvas.toDataURL('image/png')
    // do whatever with data and then remove the canvas
    canvas.remove()
  })

```
## Development
- Clone this repository.
- Install dependencies using `yarn install` or `npm install`.
- Start development server using `yarn dev`.
- Follow the [Conventional Commits Specification](https://conventionalcommits.org) for opening PRs.

## License

[MIT](./LICENSE)

