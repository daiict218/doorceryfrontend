const webpack = require('webpack');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');

const DEBUG = !argv.release; //todo: check where it comes from

const ___dirname = process.cwd();

const AUTOPREFIXER_BROWSERS = [
    'Android 2.3',
    'Android >= 4',
    'Chrome >= 30',
    'Firefox >= 38',
    'Explorer >= 10',
    'iOS >= 7',
    'Opera >= 30',
    'Safari >= 8',
  ],

  GLOBALS = {
    'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
    'process.env.BROWSER': true,
    __DEV__: DEBUG,
    __SERVER__: false,
    __iconPrefix__: '"icon"',
  },

  CSS_LOADER_MODULES_OPTIONS = {
    sourceMap: DEBUG,
    // CSS Modules https://github.com/css-modules/css-modules
    modules: true,
    localIdentName: DEBUG ? '[name]_[local]' : '[hash:base64:4]', // _[hash:base64:3]
    // CSS Nano http://cssnano.co/options/
    minimize: !DEBUG,
  },

  POSTCSS_LOADER_OPTIONS = {
    parser: 'postcss-scss',
    plugins: () => ([
      require('autoprefixer')({
        browsers: AUTOPREFIXER_BROWSERS,
      }),
    ]),
  },

  SASS_LOADER_OPTIONS = {
    sourceMap: DEBUG,
  },

  CSS_LOADER_OPTIONS = {
    sourceMap: DEBUG,
    minimize: !DEBUG, // CSS Nano http://cssnano.co/options/
  };

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/client/index.js',
  ],
  output: {
    path: require('path').resolve('./dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [    //todo: remove common plugins (for prod and dev) in another constant
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', ['es2015', { modules: false }], 'node5', 'stage-0'],
          plugins: ['transform-runtime', 'transform-react-jsx-source', 'transform-async-to-generator'],
        },
      },
      {
        test: /\.scss$/,
        exclude: [path.resolve(___dirname, 'src/app/common/common.unmod.scss')],
        loaders: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: CSS_LOADER_MODULES_OPTIONS,
          },
          {
            loader: 'postcss-loader',
            options: POSTCSS_LOADER_OPTIONS,
          },
          {
            loader: 'sass-loader',
            options: SASS_LOADER_OPTIONS,
          },
        ],
      },
      {
        test: /\.unmod.scss$/,
        loaders: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: CSS_LOADER_OPTIONS,
          },
          {
            loader: 'postcss-loader',
            options: POSTCSS_LOADER_OPTIONS,
          },
          {
            loader: 'sass-loader',
            options: SASS_LOADER_OPTIONS,
          },
        ],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
    ],
  },
};
