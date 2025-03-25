import { merge } from "webpack-merge";
import { sentryWebpackPlugin } from "@sentry/webpack-plugin";
import common from "./webpack.common.js";

export default merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    }),
  ],
});
