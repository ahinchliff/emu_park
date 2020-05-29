const path = require("path");

module.exports = {
  target: "node",
  entry: {
    "inbound-web-socket-handler":
      "./queue-tasks/build/functions/inbound-web-socket-handler.js",
    goodbyeWorld: "./queue-tasks/build/functions/goodbyeWorld.js",
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
