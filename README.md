<h1 align="center">vidar</h1>

<p align="center"><strong>Generate high-performance heatmap.</strong></p>

<p align="center">Fork of simpleheat.js with more focus on perfomance and maintainable code.</p>

[Demo](./playground/front)

## Reference

#### Rendering

```js
// create a heatmap object given an id or canvas reference
const heatmap = vidar(canvas);
// draw the heatmap with optional minimum point opacity (0.05 by default) and data points
heat.draw(minOpacity, data);
```

#### Data

```js
// set data of [[x, y, value], ...] format
const data = getData(data)

// add a data point
data.add(point);

// clear data
data.clear();
```

#### Appearance

```js
// set point radius and blur radius (25 and 15 by default)
heatmap.setRadius(r, r2);

// set gradient colors as {<stop>: '<color>'}, e.g. {0.4: 'blue', 0.65: 'lime', 1: 'red'}
heatmap.setGradient(grad);

// call in case Canvas size changed
heatmap.resize();
```

#### DOM Screenshot with [html2canvas](https://github.com/niklasvh/html2canvas)
```js
// you can take screenshot from DOM at a given time with points being drawn on it

const capture = document.querySelector('#capture')
html2canvas(capture)
  .then(canvas => {
    document.body.appendChild(canvas)
    canvas.style.display = 'none'
    return canvas
  })
  .then(canvas => {
    const image = canvas.toDataURL('image/png')
    // You can then send it to the server or whatever you want and then remove the canvas
    canvas.remove()
  })

```
## Development
- Clone this repository.
- Install dependencies using `yarn install` or `npm install`.
- Start development server using `npm run dev:front` or `yarn dev:front`.
- Follow the [Conventional Commits Specification](https://conventionalcommits.org) for opening PRs.

## License

[MIT](./LICENSE)

