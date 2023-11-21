const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Your application entry point
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve files from the dist directory
    compress: true,
    port: 3000, // Port on which the server will run
    open: true, // Open the browser after server had been started
    hot: true, // Enable hot module replacement
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Target .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use babel-loader to process these files
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Automatically resolve these file types
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Specify the path to your HTML file
    }),
  ],
};
