const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoPrefixer = require('autoprefixer');

const dev = process.env.WEBPACK_BUILD_MODE === 'dev';

const cssLoaders = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: !dev,
    },
  },
];

if (!dev) {
  cssLoaders.push({
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        autoPrefixer({
          browsers: ['last 2 versions', 'ie > 8'],
        }),
      ],
    },
  });
}

const config = {
  entry: {
    bundle: ['./src/index.ts'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  watch: dev,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssLoaders,
        }),
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...cssLoaders, 'sass-loader'],
        }),
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        exclude: /node_modules/, 
        include: path.resolve(__dirname, 'src'),
        loader: [
          'file-loader',
          {
            loader: 'img-loader',
            options: {
              enabled: !dev,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: dev ? '[name].css' : '[name].[contenthash:8].css',
      disable: dev,
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      inject: 'head',
      base: {
        href: '/',
      },
      title: 'my app',
      lang: 'en-US',
      meta: {
        description: 'a typescript app',
      },
      favicon: path.resolve(__dirname, './favicon.ico'),
      template: path.resolve(__dirname, './index.html'),
      minify: {
        collapseWhitespace: true,
        minifyJS: true,
      },
    }),
  ],
  devServer: {
    hot: true,
    overlay: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
  },
  devtool: dev ? 'inline-source-map' : false,
};

if (!dev) {
  config.plugins.push(new UglifyJsPlugin({
    sourceMap: false,
  }));
  config.plugins.push(new ManifestPlugin());
}

module.exports = config;