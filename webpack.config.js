const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/ts/main.ts",
  devtool: "inline-source-map",
  devServer: {
    static: "./docs"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Chessboard"
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ["ts-loader"],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "docs"),
  }
}
