import * as Sentry from "@sentry/browser";
import {
  type Manuscript,
  type ManuscriptData,
  newManuscript,
  newManuscriptData,
} from "./types/index.js";
import { sendData } from "./services/mcServices.js";
import { renderDashboard } from "./services/dashboard.js";

if (process.env.SENTRY_ENV && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENV,
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    integrations: [Sentry.browserTracingIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

const onManuscriptsWithDecisionsPage = (): boolean => {
  const h1Elements = document.querySelectorAll("h1");
  if (
    h1Elements.length === 1 &&
    (h1Elements[0].textContent! === "Manuscripts with Decisions" ||
      h1Elements[0].textContent! === "Manuscripts I Have Co-Authored")
  ) {
    return true;
  }

  return false;
};

const daysUnderReview = (submitted: string, returned: string): number => {
  // calculates the number of days a manuscripts has been under review.
  // Takes two arguments: the day a manuscript is submitted in DD-Mon-YYYY format and day decisioned DD-Mon-YYYY
  const sec = 1000 * 60 * 60 * 24;
  return Math.floor(
    (new Date(returned).getTime() - new Date(submitted).getTime()) / sec
  );
};

const createHeader = (cell_fill: string, rowNumber: number) => {
  // Creates the header column
  const header = document.createElement("td");
  header.textContent = cell_fill;
  if (
    header.textContent === "Days Under Review" ||
    header.textContent === "Days Until Decision"
  ) {
    header.style.fontWeight = "bold";
  }

  const authorDashboard = document.querySelector(
    "#authorDashboardQueue"
  ) as HTMLTableElement;
  authorDashboard.rows[rowNumber].append(header);
};

const addDecisionsColumn = (ms_dataObject: Manuscript[]) => {
  const authorDashboard = document.querySelector(
    "#authorDashboardQueue"
  ) as HTMLTableElement;
  createHeader("Days Under Review", 0);
  for (const [i, element] of ms_dataObject.entries()) {
    const header = document.createElement("td");
    header.textContent = `Days: ${daysUnderReview(
      element.submissionDate,
      element.decisionDate
    )}`;
    authorDashboard.rows[i + 1].append(header);
  }
};

const getManuscriptData = (): ManuscriptData => {
  const manuscriptTable = document.querySelector(
    "#authorDashboardQueue"
  ) as HTMLTableElement;

  const manuscriptTableHeaderRow = manuscriptTable.tHead!.rows[0];
  const manuscriptTableBodyRows = manuscriptTable.tBodies[0].rows;

  // Get the indices of the columns of interest in the table.
  // A more flexible approach than simply making an assumption about
  // what order these columns appear (or if they appear at all)
  const columnIndices = getColumnIndices(manuscriptTableHeaderRow);

  // Journal's name appears on mobile viewport widths
  const journalFullName = (
    document.querySelectorAll(
      ".brand.visible-tablet.visible-phone"
    )[0] as HTMLAnchorElement
  ).text;

  const journalID = document.URL.split("/")[3];

  const manuscriptData = newManuscriptData();
  manuscriptData.journalUrlSlug = journalID;
  manuscriptData.journalName = journalFullName;

  for (const manuscriptRow of manuscriptTableBodyRows) {
    const manuscript = newManuscript();
    const manuscriptID =
      manuscriptRow.cells[columnIndices.id].textContent!.trim();
    manuscript.manuscriptID = manuscriptID;
    let submissionDate = "";
    try {
      submissionDate =
        manuscriptRow.cells[columnIndices.submitted].textContent!.trim();
    } catch {
      submissionDate =
        manuscriptRow.cells[columnIndices.created].textContent!.trim();
    }

    manuscript.submissionDate = submissionDate;
    const status = manuscriptRow.cells[columnIndices.status];
    const decisionInfo = getDecisionInfo(status);
    manuscript.decision = decisionInfo.decision;
    manuscript.decisionDate = decisionInfo.decisionDate;
    manuscriptData.manuscripts.push(manuscript);
  }

  return manuscriptData;
};

const getColumnIndices = (manuscriptTableHeaderRow: HTMLTableRowElement) => {
  const columnIndices = {
    status: -1,
    id: -1,
    submitted: -1,
    created: -1,
  };

  for (let i = 0; i < manuscriptTableHeaderRow.cells.length; i++) {
    // Text content comparison is only reliable way of identifying which column is which
    const headerElement = manuscriptTableHeaderRow.cells[i];
    const headerText = headerElement.textContent;
    if (headerText) {
      switch (headerText.trim()) {
        case "Status": {
          columnIndices.status = i;
          break;
        }

        case "ID": {
          columnIndices.id = i;
          break;
        }

        case "Submitted": {
          columnIndices.submitted = i;
          break;
        }

        case "Created": {
          columnIndices.created = i;
          break;
        }

        default: {
          break;
        }
      }
    }
  }

  return columnIndices;
};

const getDecisionInfo = (authorDashboardCell: HTMLTableCellElement) => {
  // Assume decision type and date are in the first element of the collection
  const decisionInfoElement =
    authorDashboardCell.querySelectorAll(".pagecontents")[0];
  // Assume structure is `${decision} (${decisionDate})`
  const decisionInfoText = decisionInfoElement.textContent!;

  try {
    const tokens = decisionInfoText.split("(");
    const decision = tokens[0].trim();
    const decisionDate = tokens[1].slice(0, -1);
    return {
      decision: decision,
      decisionDate: decisionDate,
    };
  } catch {
    const decision = "Under Review";
    const decisionDate = new Date();
    const formattedDate = decisionDate
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
    return {
      decision: decision,
      decisionDate: formattedDate,
    };
  }
};

export const manuscriptUploadStatusColumn: {
  columnHeader: HTMLTableCellElement | null;
  columnCells: HTMLTableCellElement[];
  uploadStatus: "PENDING" | "SUCCESS" | "FAILURE";
  mount(): void;
  render(): void;
  unmount(): void;
} = {
  columnHeader: null,
  columnCells: [],
  uploadStatus: "PENDING",

  async mount() {
    const manuscriptTable = document.querySelector(
      "#authorDashboardQueue"
    ) as HTMLTableElement;

    const manuscriptTableRows = manuscriptTable.tBodies[0].rows;

    for (const row of manuscriptTableRows) {
      const cell = document.createElement("td");
      const imageElement = document.createElement("img");
      imageElement.style.width = "25px";
      imageElement.style.height = "25px";
      cell.append(imageElement);
      row.append(cell);
      this.columnCells.push(cell);
    }

    const header = document.createElement("th");
    header.textContent = "Uploaded to Coauthor?";
    const tableHeaders = manuscriptTable.tHead!.rows[0];
    tableHeaders.append(header);
    this.columnHeader = header;

    this.render();
    const decidedManuscripts: ManuscriptData = structuredClone(
      globalStore.manuscriptData
    );
    decidedManuscripts.manuscripts = decidedManuscripts.manuscripts.filter(
      (x) => x.decision !== "Under Review"
    );
    const uploadSuccessful = await sendData(decidedManuscripts);
    this.uploadStatus = uploadSuccessful ? "SUCCESS" : "FAILURE";
    this.render();
  },

  render() {
    switch (this.uploadStatus) {
      case "PENDING": {
        for (const cell of this.columnCells) {
          const imageElement = cell.children[0] as HTMLImageElement;
          imageElement.src = chrome.runtime.getURL("assets/loading.gif");
          imageElement.alt = "Loading icon indicating upload pending";
          imageElement.title = "Manuscript upload is pending.";
        }

        break;
      }

      case "SUCCESS": {
        for (const [
          i,
          value,
        ] of globalStore.manuscriptData.manuscripts.entries()) {
          if (
            globalStore.manuscriptData.manuscripts[i].decision ===
            "Under Review"
          ) {
            const cell = this.columnCells[i];
            cell.textContent =
              "No: Only manuscripts with decisions are uploaded.";
          } else {
            const cell = this.columnCells[i];
            const imageElement = cell.children[0] as HTMLImageElement;
            imageElement.src = chrome.runtime.getURL("assets/greenCheck.png");
            imageElement.alt = "Green checkmark indicating upload success";
            imageElement.title =
              "Manuscript successfully received by Coauthor servers.";
          }
        }

        break;
      }

      case "FAILURE": {
        for (const cell of this.columnCells) {
          const imageElement = cell.children[0] as HTMLImageElement;
          imageElement.src = chrome.runtime.getURL(
            "assets/disconnect-plug-icon.png"
          );
          imageElement.alt =
            "Disconnected plug indicating failed upload attempt";
          imageElement.title =
            "Connection could not be established with Coauthor servers.";
        }

        break;
      }
    }
  },

  unmount() {
    this.columnHeader!.remove();
    for (const cell of this.columnCells) {
      cell.remove();
    }

    this.columnCells = [];
    this.uploadStatus = "PENDING";
  },
};

const globalStore: {
  manuscriptData: ManuscriptData;
} = {
  manuscriptData: newManuscriptData(),
};

(async () => {
  if (onManuscriptsWithDecisionsPage()) {
    const manuscriptData = getManuscriptData();
    globalStore.manuscriptData = manuscriptData;
    addDecisionsColumn(manuscriptData.manuscripts);
    void renderDashboard();
    chrome.runtime.sendMessage(
      { message: "checkAuthStatus" },
      async (response) => {
        if (response.validSession) {
          manuscriptUploadStatusColumn.mount();
        }
      }
    );
  }
})();
