const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  plugins: [new CleanWebpackPlugin()],
  output: {
    publicPath: 'dist/',
    path: path.join(__dirname, "/dist"),
    filename: "pdf-highlighter.js",
    library: ["c60", "widgets", "pdfAnnotator"],
    libraryTarget: "umd"
  },
  module: {
    rules: [{
      oneOf: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: '10000'
          },
        },
        {
          loader: require.resolve('file-loader'),
          exclude: [/\.(js|mjs|jsx|ts|tsx|css)$/, /\.html$/, /\.json$/],
          options: {
            name: '[name].[hash:8].[ext]',
          },
        }
      ]
    }]
  }
};