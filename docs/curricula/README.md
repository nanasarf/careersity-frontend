# Careersity curriculum import documents

These documents are production curriculum definitions for the administrator
Curriculum Import workflow. Import documents intentionally contain no external
learning resources until the curriculum has been approved and resources have
been researched separately.

## Data Analyst

`data-analyst-v1.json` creates the Data & Analytics category, the Data Analyst
career, its skill catalog, eighteen courses, course lessons, and the four-level
primary pathway.

Use the document from **Admin > Curriculum Import**:

1. Paste the complete JSON document into the editor.
2. Select **Validate** and resolve every backend validation error.
3. Select **Import validated document**.
4. Add the documented prerequisites, projects, and assessments through their
   dedicated authoring screens.
5. Review and publish dependencies before publishing the pathway.

The import endpoint is create-only. Do not import the same document twice into
the same environment.

### Post-import prerequisite assignments

The bulk-import contract does not currently accept prerequisites. Add these in
course authoring after import:

| Course | Required prerequisites | Recommended prerequisites |
|---|---|---|
| DA 102 | DA 101 | — |
| DA 103 | DA 101 | — |
| DA 104 | DA 101 | — |
| DA 201 | DA 101 | — |
| DA 202 | DA 102, DA 103, DA 104 | — |
| DA 203 | DA 103 | — |
| DA 204 | DA 202, DA 203 | — |
| DA 205 | DA 201, DA 204 | — |
| DA 301 | DA 103, DA 204 | — |
| DA 302 | DA 102, DA 201 | — |
| DA 303 | DA 203, DA 301 | — |
| DA 304 | DA 204, DA 302 | — |
| DA 351 | DA 302 | DA 301 |
| DA 352 | DA 203, DA 301 | — |
| DA 401 | DA 201–205, DA 301, DA 302, DA 304 | DA 303 |
| DA 402 | All required DA 100–300 courses, DA 401 | — |
| DA 403 | DA 401 | DA 402 concurrently |

### Post-import assessments and projects

Each course's final lesson is an assessment or project brief. Create the
corresponding assessment/project entity from that brief. Projects are mandatory
for every course whose final lesson begins with `Project brief`; DA 103 uses an
integrated exercise set rather than a separate project.

