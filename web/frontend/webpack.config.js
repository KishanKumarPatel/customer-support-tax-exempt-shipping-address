const path = require('path');

module.exports = {
  entry: './index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 50000, // Adjust this value as needed
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
