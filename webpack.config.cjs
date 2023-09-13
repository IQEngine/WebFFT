const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./lib/benchmark.js",
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader", // Use ts-loader for TypeScript files
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: true,
        },
      }),
    ],
  },
};
