const path = require("path");

module.exports = {
  target: "node",
  entry: {
    "inbound-web-socket-handler":
      "./api-tasks/build/functions/inbound-web-socket-handler.js",
    api: "./api/build/lambda.js",
    server: "./api/build/server.js",
  },
  resolve: {
    extensions: [".js"],
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  mode: "production",
  optimization: {
    minimize: false,
  },
};
