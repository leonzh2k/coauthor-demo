import Fields from "../Fields/Fields.js";
import { type JournalStats } from "../../../../common/types/index.js";

export const Toolbar = ({
  fieldList,
  handleFieldFilter,
  journals,
}: {
  readonly fieldList: (journals: JournalStats[]) => string[];
  readonly handleFieldFilter: (e: React.MouseEvent<HTMLButtonElement>) => void;
  readonly journals: JournalStats[];
}) => {
  return (
    <div
      className="btn-toolbar mb-3"
      role="toolbar"
      aria-label="Toolbar with button groups"
    >
      <div className="btn-group mr-2" role="group" aria-label="First group" />
      <button
        type="button"
        className="btn btn-secondary"
        value="all"
        onClick={handleFieldFilter}
      >
        All
      </button>
      {fieldList(journals).map((j: string, index: number) => {
        return (
          <Fields key={index} journal={j} fieldFilter={handleFieldFilter} />
        );
      })}
    </div>
  );
};
