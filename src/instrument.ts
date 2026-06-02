import * as Sentry from "@sentry/node";
import { SENTRY_DSN } from "./utils/env";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV ?? "production",
  enabled: true,
  tracesSampleRate: 0.2,
});
