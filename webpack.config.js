const path = require("path");

module.exports = {
  target: "node",
  entry: {
    "email-verification-email-customisation":
      "./api-tasks/build/functions/email-verification-email-customisation.js",
    "inbound-web-socket-handler":
      "./api-tasks/build/functions/inbound-web-socket-handler.js",
    api: "./api/build/lambda.js",
    server: "./api/build/server.js",
    "generate-email-templates":
      "./core-backend/build/email-service/generate-email-html",
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
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader",
        },
      },
    ],
  },
};
