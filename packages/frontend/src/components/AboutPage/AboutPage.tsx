import { Container } from "react-bootstrap";
import mdmImage from "../images/mdm283.jpg";
import leonImage from "../images/leon.jpg";
import hectorImage from "../images/Hector_Bio_Picture.jpg";
import styles from "./AboutPage.module.css";

const AboutPage = () => {
  return (
    <Container>
      <div className="AboutContainer">
        <h1 className="header">Coauthor Team</h1>
        <div className="teamContainer">
          <div className={styles.Card}>
            <img src={mdmImage} height={300} width={300} alt="" />
            <p className={styles.aboutText}>
              <a
                href="https://sha.cornell.edu/faculty-research/faculty/mdm283/"
                target="_blank"
                rel="noreferrer"
              >
                Michael Maffie
              </a>{" "}
              is an assistant professor at Cornell&apos;s Johnson College of
              Business. His research focuses on technical change and the
              employment relationship, typically in the context of the gig
              economy.
            </p>
          </div>
          <div className={styles.Card}>
            <img src={leonImage} height={200} width={300} alt="" />
            <p className={styles.aboutText}>
              <a
                href="https://www.linkedin.com/in/leon-zhuang-52557a178/"
                target="_blank"
                rel="noreferrer"
              >
                Leon Zhuang
              </a>{" "}
              is a freelance web developer. He specializes in full stack web
              development. Leon holds a B.S. in computer science from the
              University of California, Davis (&apos;22) and a M.Eng in computer
              science from Cornell University (&apos;23).
            </p>
          </div>
          <div className={styles.Card}>
            <img src={hectorImage} height={200} width={300} alt="" />
            <p className={styles.aboutText}>
              <span className="bold">Hector Hurtado</span> is a Junior at
              Cornell University with broad interests in management, computer
              and data science, and philosophy. Additionally, Hector is a McNair
              scholar, interested in pursuing a doctoral degree in Information
              Science. Hector can be reached at: hlh94 [at] cornell [dot] edu
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AboutPage;
