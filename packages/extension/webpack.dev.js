import { merge } from "webpack-merge";
import { sentryWebpackPlugin } from "@sentry/webpack-plugin";
import common from "./webpack.common.js";

const plugins = [];

if (process.env.UPLOAD_SOURCEMAPS === "true") {
  plugins.push(
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    })
  );
}

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: plugins,
});
