import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import JournalTable from "../JournalTable/JournalTable.js";
import journalServices from "../../journalServices/journals.js";
import { type JournalStats } from "../../../../common/types/index.js";
import IntroText from "../IntroText/IntroText.js";
import TableInfo from "../TableInfo/TableInfo.js";
import { Toolbar } from "../Toolbar/Toolbar.js";

const HomePage = () => {
  const [journals, setJournals] = useState<JournalStats[]>([]);
  const [subJournals, setSubJournals] = useState<JournalStats[]>([]);

  useEffect(() => {
    journalServices
      .getAll()
      .then((initialJournals: JournalStats[]) => {
        setJournals(initialJournals);
        setSubJournals(initialJournals);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }, []);

  const handleFieldFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const fieldSelect = e.currentTarget.value;
    if (fieldSelect === "all") {
      setSubJournals(journals);
    } else {
      setSubJournals(journals.filter((j) => j.academicField === fieldSelect));
    }
  };

  const fieldList = (journals: JournalStats[]) => {
    const fields = journals
      .map((j) => j.academicField)
      // remove duplicate fields
      .filter((item, i, ar) => ar.indexOf(item) === i)
      // remove nulls
      .filter((f) => f !== null);

    return fields;
  };

  return (
    <Container>
      <h1 className="header">Welcome to Coauthor</h1>
      <IntroText />
      <Toolbar
        fieldList={fieldList}
        handleFieldFilter={handleFieldFilter}
        journals={journals}
      />
      <JournalTable data={subJournals} />
      <TableInfo />
    </Container>
  );
};

export default HomePage;
