# Coauthor

This repository contains a code sample from Coauthor, the flagship research project of the MaffieLab at Cornell University which I am the technical lead of currently. You can view the production website at [coauthor.fly.dev](https://coauthor.fly.dev). I have obtained permission from my lab director to release this code sample to showcase my professional skills. However, I have omitted certain portions of the codebase as it is the most unique and "proprietary" part of our research and it is in our best interest to not make it publicly accessible at this time. But, if you are visiting this repository as part of a hiring process, temporary private access to these omitted portions is available upon request.

## Project Overview

### What problem does it solve?

In academic publishing, the peer review process is the main method in which scientific research is evaluated, accepted, and published to the world. Therefore it is in authors' and the general public's best interest that academic journals conduct this process as fairly as possible. While existing research has suggested the existence of potential biases, to date, there have not existed large enough datasets to make definitive conclusions. We're creating Coauthor to build the largest dataset of its kind and provide the general academic community with a resource for conducting independent audits on the publication practices of academic journals.

<details>
<summary>The longer version with citations, written by my lab director (click to expand)</summary>

Many academic disciplines organize professional advancement and distribution of scientific knowledge through peer review (Fox & Lash, 2017). Yet this system of evaluating and distributing knowledge is not without criticism (Björk & Solomon, 2013). Extensive research raises questions regarding biases and delays built into the review and publication process (Abramowitz et al., 1975; Haffar et al., 2019). For example, research has raised significant questions regarding how social biases, such as gender, influence the peer review process (Cislak et al., 2018). Furthermore, researchers have long suspected that a prestige bias, such as institutional affiliation, plays a role in editorial decision making (Frachtenberg & McConville, 2022). Given the importance of building a more inclusive and egalitarian academy, these concerns merit considerable attention.

Data, and data quality, remain a central limitation in understanding these concerns about peer review systems (Lee et al., 2013; Squazzoni et al., n.d.). Specifically, publishers rarely provide datasets to independent researchers to audit publication practices. As a result, many of the existing studies rely on surveys, audit studies, post-hoc analyses, or limited datasets that are provided by publishers. While extant studies have advanced our understanding of both the delays associated with publishing academic work and some of the biases within the publication process, these data make it challenging for researchers to make strong claims regarding potential biases in peer review (Frachtenberg & McConville, 2022). To address this problem we are developing the Coauthor Project, a project that crowd-sources peer review information across academic fields.

</details>

### Architecture and Main User Flows

The system consists of four main components: a browser extension, REST API, database, and frontend.

#### User Flow 1: Contributing Data

What happens when a user wants to upload their peer review history to our system?

1.  User downloads the browser extension and creates an account
2.  User navigates to their author dashboard on a manuscript submission site supported by the extension
3.  The extension automatically scrapes the page and uploads it via POST request to the REST API
4.  After access control and input validation checks pass, the data is written to the database

#### User Flow 2: Viewing Journal Statistics

What happens when a user wants to view the crowdsourced dataset?

1.  User visits the website frontend
2.  Frontend sends GET request to REST API
3.  API queries the database to calculate journal statistics. Only aggregate statistics are sent back to the client to preserve anonymity of individual users
4.  Frontend receives the response and re-renders to display the data to user

### Tech Stack

- Browser Extension: TypeScript
- REST API: TypeScript, Node.js, Express
- Frontend: TypeScript, React, CSS
- Database: PostgreSQL
- CI/CD: GitHub Actions, Bash, YAML
- Application Monitoring: Sentry

## My Contributions

### What code have I personally contributed?

Although I have worked on major and minor features and fixes all over the codebase, I primarily have "ownership" over the server, database, test framework, build system, and CI/CD pipeline, having built these components almost completely by myself. But you want a more quantitative breakdown of code I've contributed it's probably something like this:

- Browser extension: 70% me
- REST API: 95% me
- Database: 95% me
- Frontend: 20% me
- Automated tests: 90% me
- CI/CD pipeline: 100% me
- Build system: 100% me
- Local environment setup scripts/config: 100% me
- Other config stuff: 100% me

### Specific Achievements

When I joined the lab, my professor had been the sole developer on the project up to that point in time. As a (self-admitted) novice programmer, he recruited me to show him how to properly build software. I'd say I've delivered. Here's a non-exhaustive list of improvements I've contributed completely on my own:

- Refactored the entire codebase from JavaScript to TypeScript, resulting in an overall more maintainable and bug-free codebase
- Migrated database from MongoDB to PostgreSQL and redesigned core data model using relational database design principles, greatly improving data integrity and querying flexibility (both are critical for a data analysis project)
- Wrote an automated test framework, greatly simplifying creation of new tests
- Modularized API using controller-service design pattern, standardizing creation of future API features and making it easier to test individual units of code
- Automated test, build, and deployment of the webapp and browser extension by writing a CI/CD pipeline using GitHub Actions, Bash, and YAML
- Setup devcontainers, ensuring a version controlled, consistent, reproducible development environment across team members
- Enforced consistent code formatting and quality by integrating static code analysis tools like ESLint and Prettier into workflow
- Setup a Kanban task board to track tasks, keeping the project organized and well-documented 
