import process from "node:process";
import { init } from "@sentry/node";

init({
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_DSN,
  // Performance Monitoring
  tracesSampleRate: 1,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1,
});
