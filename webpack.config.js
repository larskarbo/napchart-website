const path = require('path')
const webpack = require('webpack')
var CompressionPlugin = require('compression-webpack-plugin')

var config = {
  devtool: 'source-map',
  entry: {
    corejs: 'core-js',
    index_bundle: ['babel-polyfill','./client/index.jsx'],

  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/public/'
  },
  resolve: { // this makes npm link work
    symlinks: false
  },
  module: {
        
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'client'),
          path.resolve(__dirname, 'node_modules', 'napchart')
        ],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react', 'stage-0']
          }
        }]
      }, {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'sass-loader', // compiles Sass to CSS
          options: {
            // did only work first build when webpack --watch
            // put folder in styles instead
            // includePaths: ["node_modules"]
          }
        }]
      }, 
    ]
  },
}

if(process.env.NODE_ENV == 'production'){
  config.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({minimize: false}),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
} else {
  config.plugins = [
  ]
}

module.exports = config
// 