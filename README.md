<h1 align="center">vidar</h1>
<div align="center">
<a href="https://www.npmjs.com/package/@raminjafary/vidar"><img src="https://badgen.net/npm/v/@raminjafary/vidar" alt="Version"></a>
</div>

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
#### Rate limit rendering 

You can throttle rendering per frames based on available resources. In the following example, the `draw` function will always be called with the latest data points with the frame rates browsers provide (e.g. 20 calls on 20fps).

```js
// throttle draw
const frame = ensureAvailableFrames(heatmap.draw)
// run on available frame, pass any args if you have
frame.request()
// cancel a frame
frame.cancel()
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

