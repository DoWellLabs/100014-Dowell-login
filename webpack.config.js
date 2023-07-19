const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  plugins: [
    // Add the MiniCssExtractPlugin to extract CSS into separate files
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    // Add the DefinePlugin to expose environment variables to your built code
    new webpack.DefinePlugin(envKeys),
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      // Add rule for handling JavaScript with Babel (including JSX)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      // Add rule for handling SCSS files with MiniCssExtractPlugin and sass-loader
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      // Add rule for handling CSS files with MiniCssExtractPlugin
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      // Add rule for handling SVG files with svg-url-loader
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Limit the size for inlining SVG as a data URI
              limit: 8192, // Adjust the limit as needed
              noquotes: true, // Remove quotes from URLs
            },
          },
        ],
      },
    ],
  },
};
