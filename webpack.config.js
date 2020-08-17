import path from "path";
import webpack from "webpack";

export default {
  entry: {
    main: [
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
      "./src/client/index.tsx",
    ],
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".scss"],
  },
  mode: "development",
  target: "web",
  devtool: "#source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
            plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
