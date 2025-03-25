import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import webpack from "webpack";
import dotenv from "dotenv";
import CopyPlugin from "copy-webpack-plugin";

const { DefinePlugin } = webpack;

// Load env vars that should be present in the final build.
const publicEnvVars = dotenv.config({
  path: `.env.${process.env.NODE_ENV}.public`,
}).parsed;

// Load env vars that shouldn't be present in the final build but are required during the build process.
dotenv.config({ path: `.env.${process.env.NODE_ENV}.private` });

const outputDir = path.resolve(
  fileURLToPath(path.dirname(import.meta.url)),
  "build"
);

class BuildManifestPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.done.tap("BuildManifestPlugin", () => {
      const outputFile = path.resolve(outputDir, "manifest.json");

      const manifest = JSON.stringify(
        {
          manifest_version: 3,
          name: "Coauthor",
          version: JSON.parse(fs.readFileSync("./package.json")).version,
          icons: {
            128: "assets/icon128.png",
          },
          content_scripts: [
            {
              matches: ["https://mc.manuscriptcentral.com/*"],
              run_at: "document_end",
              js: ["content.js"],
            },
          ],
          background: {
            service_worker: "background.js",
          },
          action: {
            default_popup: "./ui/popup/popup.html",
          },
          web_accessible_resources: [
            {
              resources: ["*.map", "assets/*.*"],
              matches: ["<all_urls>"],
            },
          ],
          description:
            "Share your manuscript submission experiences and help increase transparency in academic publishing!",
          permissions: ["identity"],
          host_permissions: [`${process.env.API_BASE_URL}/*`],
          key: "redacted",
        },
        null,
        2
      );

      fs.writeFileSync(outputFile, manifest);
    });
  }
}

export default {
  /* 
    Two bundles, because chrome extensions require
    content scripts and background scripts to be in 
    separate files
  */
  entry: {
    content: "./src/content.ts",
    background: "./src/services/background.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new BuildManifestPlugin(), // builds the manifest
    /**
     * This replaces all instances of 'process.env' in source code
     * with an object w/ environment variable key-value pairs. This means that
     * all environment variables in this object will be exposed to the client.
     * So it is VERY IMPORTANT that this object only contains
     * environment variables that you're okay with making public.
     *
     * An example of what you shouldn't do: doing JSON.stringify(process.env).
     * That will expose ALL environment variables of the system used to build the
     * app to the client. Obviously a bad idea!
     */
    new DefinePlugin({
      "process.env": JSON.stringify(publicEnvVars),
    }),

    new CopyPlugin({
      patterns: [
        { from: "./src/ui", to: "./ui" },
        { from: "./src/assets", to: "./assets" },
      ],
    }),
  ],
  watchOptions: {
    poll: true, // Check for changes every second
    ignored: /node_modules/,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    // Solves this: https://stackoverflow.com/questions/64796952/webpack-ts-loader-import-with-js-extension-not-resolving
    extensionAlias: {
      ".js": [".js", ".ts"],
    },
  },
  output: {
    filename: "[name].js",
    path: outputDir,
    clean: true,
  },
};
