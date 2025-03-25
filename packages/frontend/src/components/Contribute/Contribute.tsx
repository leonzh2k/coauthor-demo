import { Container } from "react-bootstrap";
import styles from "./Contribute.module.css";

const Contribute = () => {
  return (
    <Container>
      <h1 className="header">Contributing Data</h1>
      <p className={styles.download}>
        The official Coauthor browser extension provides an simple, hassle-free
        way to contribute your manuscript submission data - fully automated, and
        it should only take a few minutes. Learn how to install and use the
        extension{" "}
        <a
          href="https://github.com/MaffieLab/Coauthor/wiki"
          target="_blank"
          rel="noreferrer"
        >
          here.
        </a>
      </p>
    </Container>
  );
};

export default Contribute;
