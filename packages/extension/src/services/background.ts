import * as Sentry from "@sentry/browser";
import { authenticate } from "./auth.js";

try {
  if (process.env.SENTRY_ENV && process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENV,
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      // Performance Monitoring
      tracesSampleRate: 1, // Capture 100% of the transactions, reduce in production!
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }
} catch (error) {
  console.error(error);
}

chrome.runtime.onInstalled.addListener((object) => {
  const internalUrl = chrome.runtime.getURL("ui/onboarding/onboarding.html");
  if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: internalUrl }, (tab) => {
      console.log("What are you doing here :)");
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.message);
  switch (request.message) {
    case "getdata": {
      const url = request.url;
      try {
        fetch(url, {
          method: "GET",
        })
          .then(async (response) => response.json())
          .then((response) => {
            sendResponse(response);
          })
          .catch((error: unknown) => {
            Sentry.captureException(error);
          });

        return true;
      } catch (error) {
        console.dir(error);
      }

      break;
    }

    case "postData": {
      const url = request.url;
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(request.data),
      })
        .then((response) => {
          sendResponse(true);
        })
        .catch((error: unknown) => {
          console.error(error);
          Sentry.captureException(error);
          sendResponse(false);
        });
      return true;
    }

    case "login": {
      (async () => {
        const authSuccessful = await authenticate();
        if (authSuccessful) {
          sendResponse({ outcome: "success" });
        } else {
          sendResponse({ outcome: "failure" });
        }
      })();

      return true;
    }

    case "logout": {
      fetch(`${process.env.API_BASE_URL}/api/session`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((response) => {
          sendResponse({ outcome: "success" });
        })
        .catch((error: unknown) => {
          Sentry.captureException(error);
          console.log("Error:", error);
        });
      return true;
    }

    case "checkAuthStatus": {
      fetch(`${process.env.API_BASE_URL}/api/session`, {
        method: "GET",
        credentials: "include",
      })
        .then(async (response) => response.json())
        .then((response) => {
          sendResponse(response);
        })
        .catch((error: unknown) => {
          Sentry.captureException(error);
          console.log("Error:", error);
        });
      return true;
    }

    default: {
      throw new Error("default case");
    }
  }
});
