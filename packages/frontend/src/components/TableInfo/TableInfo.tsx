import styles from "./TableInfo.module.css";

const TableInfo = () => {
  return (
    <div className={styles.bottomText}>
      <br />
      <p>
        <span className="boldUnder">Table Information</span>
      </p>
      <p>
        Days to first decision calculates the time from submission to a
        decision. All desk rejections (defined by fewer than 20 days under
        review) are omitted. The first revise and resubmit includes major and
        minor revision requests. The column &quot;Acceptance Percentage After
        First R&R&quot; calculates the conditional acceptance percentage after a
        first revision request. Finally, &quot;Sample Size&quot; reports the
        number of unique manuscripts in each journal.
      </p>
    </div>
  );
};

export default TableInfo;
