Napchart Website

*Full stack website utilizing the [napchart](https://github.com/larskarbo/napchart) library to create, save and share napcharts.*

Written using a `node.js` back-end and `react` for the front-end

## Installation

⚠️ Napchart-website uses `node-canvas` as a dependency to render charts server-side. It needs some specific programs in order to work. Go to [Automattic/node-canvas](https://github.com/Automattic/node-canvas) to see instructions for you OS

Then try to install dependencies using npm
````
npm install
````

Then launch the app
````
npm run dev
````
By default, the app will be available at `localhost:3000`


## API

From `server.js`:

```javascript
app.post('/api/create', api.create)
app.get('/api/get', api.get)
app.get('/api/getImage', api.getImage)
```

**Create chart:** `/api/create` with data as post

**Get chart:** `/api/get?chartid=xxxxx` receive data

**Get image:** `/api/getImage?chartid=xxxxx&width=600&height=600&shape=circle` receive image (shape is optional)

## Contributing

See [CONTRIBUTING.md](https://github.com/larskarbo/napchart-website/blob/master/CONTRIBUTING.md) for an introduction to the code-base
