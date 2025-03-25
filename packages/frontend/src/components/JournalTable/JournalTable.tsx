import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { type JournalStats } from "../../../../common/types/index.js";
import styles from "./JournalTable.module.css";

const noDataTextIfNullElseOriginalValue = (value: unknown) => {
  return value === null ? "-" : value;
};

const undefinedIfNullElseOriginalValue = (value: unknown) => {
  return value === null ? undefined : value;
};

const columnHelper = createColumnHelper<JournalStats>();

const columns = [
  columnHelper.accessor("journalFullName", {
    header: "Journal Name",
    cell: (props) => {
      return noDataTextIfNullElseOriginalValue(
        props.row.original.journalFullName
      );
    },
    sortUndefined: "last",
  }),
  columnHelper.accessor(
    (row) => undefinedIfNullElseOriginalValue(row.avgDaysToFirstDecision),
    {
      header: "Initial Submission: Avg. Days Under Review",
      cell: (props) => {
        return noDataTextIfNullElseOriginalValue(
          props.row.original.avgDaysToFirstDecision
        );
      },
      sortUndefined: "last",
    }
  ),
  columnHelper.accessor(
    (row) => undefinedIfNullElseOriginalValue(row.stdDaysToFirstDecision),
    {
      header: "Initial Submission: Std. Deviation Days Under Review",
      cell: (props) => {
        return noDataTextIfNullElseOriginalValue(
          props.row.original.stdDaysToFirstDecision
        );
      },
      sortUndefined: "last",
    }
  ),
  columnHelper.accessor(
    (row) =>
      undefinedIfNullElseOriginalValue(row.pctReceivedRevisionOnInitialSub),
    {
      header: "Initial Submission: Percent Receiving First R&R",
      cell: (props) => {
        return noDataTextIfNullElseOriginalValue(
          props.row.original.pctReceivedRevisionOnInitialSub
        );
      },
      sortUndefined: "last",
    }
  ),
  columnHelper.accessor(
    (row) => undefinedIfNullElseOriginalValue(row.pctAcceptedAfterRevision),
    {
      header: "Acceptance Percentage After First R&R",
      cell: (props) => {
        return noDataTextIfNullElseOriginalValue(
          props.row.original.pctAcceptedAfterRevision
        );
      },
      sortUndefined: "last",
    }
  ),
  columnHelper.accessor(
    (row) => undefinedIfNullElseOriginalValue(row.distinctManuscripts),
    {
      header: "Sample Size",
      cell: (props) => {
        return noDataTextIfNullElseOriginalValue(
          props.row.original.distinctManuscripts
        );
      },
      sortUndefined: "last",
    }
  ),
  columnHelper.accessor(
    (row) => undefinedIfNullElseOriginalValue(row.academicField),
    {
      header: "Academic Field",
      cell: (props) => {
        return noDataTextIfNullElseOriginalValue(
          props.row.original.academicField
        );
      },
      sortUndefined: "last",
    }
  ),
];

const JournalTable = ({ data }: { readonly data: JournalStats[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className={styles.SearchBar}>
        Search:{" "}
        <input
          type="text"
          placeholder="Input Journal Name Here"
          value={filtering}
          onChange={(e) => {
            setFiltering(e.target.value);
          }}
        />{" "}
      </div>
      <br />

      <table className="table w-auto table-striped table-hover">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {(() => {
                    const sortDirection = header.column.getIsSorted();
                    if (sortDirection) {
                      return sortDirection === "asc" ? " 🔼" : " 🔽";
                    }

                    return null;
                  })()}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-menu">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            table.setPageIndex(0);
          }}
        >
          First Page
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!table.getCanPreviousPage()}
          onClick={() => {
            table.previousPage();
          }}
        >
          Previous Page
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!table.getCanNextPage()}
          onClick={() => {
            table.nextPage();
          }}
        >
          Next Page
        </button>
        <button
          type="button"
          className="btn btn-secondary page"
          onClick={() => {
            table.setPageIndex(table.getPageCount() - 1);
          }}
        >
          Last Page
        </button>
      </div>
    </div>
  );
};

export default JournalTable;
