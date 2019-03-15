const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: path.join(__dirname, "src", "index.js"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist")
  },
  resolve: {
    extensions: [".js", "*"]
  },
  devtool: "eval-source-map",
  plugins: [
    new webpack.ProgressPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(js)$/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ["@babel/env"]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
          test: /\.(csv|tsv)$/,
          use: [
            "csv-loader"
          ]
      },
      {
          test: /\.xml$/,
          use: [
              'xml-loader'
          ]
      }
    ]
  }
};
