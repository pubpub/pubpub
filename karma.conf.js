var webpack = require('webpack');
var path = require('path');

module.exports = function (config) {
  config.set({

    browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Safari'],

    singleRun: !!process.env.CI,

    frameworks: [ 'mocha' , 'intl-shim'],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    reporters: [ 'mocha' ],

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-phantomjs-launcher"),
      require("karma-chrome-launcher"),
      require("karma-firefox-launcher"),
      require("karma-safari-launcher"),
      require("karma-sourcemap-loader"),
      require("karma-intl-shim")
    ],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: {limit: 10240} },
          { test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
          { test: /\.jsx$/, exclude: /node_modules/, loaders: ['babel']},
          { test: /\.json$/, loader: 'json-loader' },
        ]
      },
      resolve: {
        root: path.resolve('src'),
        modulesDirectories: [
          'node_modules'
        ],
        extensions: ['', '.json', '.js', '.jsx']
      },
      plugins: [
        // new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: true,
          __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
        })
      ],
      node: {
        fs: "empty"
      },
    },

    webpackServer: {
      noInfo: true
    }

  });
};