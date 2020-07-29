const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // Entry / Output
  entry: "./src/App.tsx",
  output: {
    filename: "bundle.[hash:8].js",
    chunkFilename: "[name].[hash:8].js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: "./dist",
    port: 3000,
    hot: true,
    host: "0.0.0.0",
    disableHostCheck: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  },
  plugins: [
    // new CleanWebpackPlugin(),
    // Setup template
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      minify: true,
    }),
    new Dotenv(),
    // new FaviconsWebpackPlugin({
    //   logo: "./src/favicon.png",
    //   favicons: {
    //     icons: {
    //       appleStartup: false,
    //     },
    //   },
    // }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  module: {
    rules: [
      {
        // Javascript Files
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        // CSS Files / Styling
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        // Sass Files / Styling
        test: /\.scss$/,
        // use: ["style-loader", "css-loader", "sass-loader"],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        // Image Support
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: { name: "[name].[contenthash:8].[ext]", path: "./img" },
      },
      {
        // Fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        options: { name: "./res/[name].[contenthash:8].[ext]" },
      },
    ],
  },
  resolve: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
};

if (process.env.NODE_ENV === "development") {
  module.exports.mode = "development";
  module.exports.devtool = "source-map";
  module.exports.optimization = {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  };
  module.exports.output.pathinfo = false;
  module.exports.output.filename = "bundle.js";
} else {
  module.exports.mode = "production";
  module.exports.optimization = {
    splitChunks: {
      chunks: "async",
    },
  };
}
