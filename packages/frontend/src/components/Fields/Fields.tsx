const Fields = ({
  journal,
  fieldFilter,
}: {
  readonly journal: string;
  readonly fieldFilter: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <div>
      <button
        type="button"
        className="btn btn-secondary"
        value={journal}
        onClick={fieldFilter}
      >
        {journal}
      </button>
    </div>
  );
};

export default Fields;
