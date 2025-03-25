import { types } from "vite/client";

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_ENV: string;
  readonly VITE_SENTRY_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
