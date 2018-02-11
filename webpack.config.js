const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Default plugins
const plugins = [
  new ExtractTextPlugin({
    filename: 'main.css',
    allChunks: true
  })
];

module.exports = {
  entry: {
    main: './static_src/js/main.js'
  },
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/public/',
    filename: '[name].js'
  },
  module: {
    rules: [
      // JS
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // CSS
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: [
            {
              loader: 'style-loader',
              options: {
                modules: true
              }
            }
          ],
          use: ['css-loader']
        })
      },
      // Copy images
      {
        test: /\.(png|jpg|gif|svg)/,
        loader: 'file-loader?name=[hash:6].[ext]'
      },
      // Copy fonts
      {
        test: /\.(woff2?|ttf|eot)/,
        loader: ['file-loader']
      }
    ]
  },
  devtool: 'sourcemap',
  plugins,
  resolve: {
    extensions: ['.js', '.css'],
    modules: ['./static_src', './node_modules'],
    alias: {
      node_modules: path.join(__dirname, 'node_modules')
    }
  }
};
