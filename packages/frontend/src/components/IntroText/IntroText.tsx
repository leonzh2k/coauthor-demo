import styles from "./IntroText.module.css";

const IntroText = () => {
  return (
    <div className={styles.introText}>
      <p>
        The Coauthor Project was created to increase transparency in scientific
        publishing. The project is built on{" "}
        <span className="boldUnder">community-sourced data</span>. Accordingly,
        we acknowledge the statistics below are only estimates. Want to
        contribute data? Click the link on the top right to learn how.
      </p>
      <p>
        You can filter journals by academic field using the grey field buttons
        below. Clicking &quot;All&quot; will reset the field filter.
        Alternatively, you can search for a journal using the search bar.
      </p>
    </div>
  );
};

export default IntroText;
