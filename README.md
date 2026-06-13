# Mental Health Atlas BD

**Mental Health Atlas BD** is an open-source, browser-based interactive GIS dashboard for mental health facility mapping in Bangladesh.

Live dashboard: https://mh-atlas-bd.vercel.app/  
Source code: https://github.com/mh-atlas/mental-health-atlas-bd  
Version: v1.0  
Data last updated: 12 June 2026  
License: MIT

---

## Overview

Mental Health Atlas BD visualizes indexed mental health service facilities across Bangladesh using an interactive geospatial dashboard. The platform is designed to support public health planning, service mapping, research, referral planning, and equity-oriented decision-making.

The current v1.0 dashboard visualizes:

- 371 indexed mental health service facilities
- 44 of 64 districts with at least one indexed facility
- All 8 administrative divisions of Bangladesh
- District-level population and socioeconomic denominator data for all 64 districts
- District boundary polygons for national-scope choropleth mapping

The dashboard is intended as a planning and research-support tool. It is **not** a verified national census of all mental health services in Bangladesh and should not be used as an emergency referral system.

---

## Why This Project Matters

Mental health service information is often difficult to explore spatially. Planners, researchers, nongovernmental organizations, and service providers may need to understand where services are available, which districts appear underserved, and how service availability relates to population and socioeconomic indicators.

Mental Health Atlas BD addresses this gap by making facility-level service information easier to query, visualize, filter, and export through a public web dashboard.

The dashboard can support:

- Mental health service planning
- Facility distribution analysis
- Geographic coverage assessment
- Public and private service comparison
- District-level equity analysis
- Referral planning
- Research and policy communication
- Identification of potential service gaps requiring validation

---

## Key Features

### Interactive Map

- Bangladesh national district map
- Facility marker clusters
- Facility density heatmap
- Bubble overlay
- District labels
- Choropleth indicators
- Multiple basemap options
- District information popups
- Fullscreen map view
- Map snapshot support

### Choropleth Indicators

The map supports district-level visualization of:

- Facility count
- Population
- Facilities per 100,000 population
- Population per facility
- Poverty index
- Literacy rate
- Urban percentage

### Filters

The dashboard includes user-facing filters for:

- Facility search
- Division
- District
- Ownership
- Facility type
- Free services
- Appointment requirement
- Walk-in availability

Active filters are shown as removable chips.

### Insights Tab

The Insights tab provides summary visualizations for:

- Facilities by district
- Facilities per 100,000 population
- Coverage gaps
- Best-served districts
- Division-level comparison
- Ownership breakdown
- Government versus private distribution
- Cost bracket distribution
- Facility type distribution
- District comparison

### Data Table Tab

The Data table tab provides:

- Searchable facility records
- Searchable district records
- Sortable columns
- Pagination
- CSV export for filtered facility data
- CSV export for filtered district summary data

Exported data are directory-derived and should be validated against official registries before formal service-coverage decisions.

### Report Tab

The Report tab allows users to generate a structured narrative report based on selected geographic scope and selected report sections. It supports PDF download through client-side report generation.

### Data & Methods Page

The dashboard includes a dedicated Data & Methods page documenting:

- Dashboard scope
- Data sources
- Denominator coverage
- Calculated indicators
- Data dictionary entries
- Interpretation limitations
- Suggested citation text

### Feedback Route

The dashboard includes an informal feedback route where users may submit:

- User role
- Ease-of-use rating
- Use case
- Suggested improvements

The feedback route is for improvement tracking only. It is not a formal usability study, System Usability Scale assessment, or representative evaluation.

---

## Data Sources

The dashboard uses three main data inputs.

| Dataset | Description |
|---|---|
| Facility records | Indexed mental health service facilities derived from the ADD International Bangladesh Mental Health Service Directory |
| District denominator data | Bangladesh Bureau of Statistics Census 2022 district-level population and socioeconomic indicators |
| District boundaries | GADM Level 2 Bangladesh district boundary polygons |

Runtime data files are loaded from the `/data` directory:

```text
/data/facilities.json
/data/districts_pop.json
/data/district.geojson
```

---

## Data Coverage

| Indicator | Current value |
|---|---:|
| Indexed facilities | 371 |
| Districts with indexed facilities | 44 of 64 |
| Districts with denominator data | 64 of 64 |
| Divisions represented | 8 of 8 |
| Coordinate completeness | 371 of 371 |
| Website completeness | 141 of 371 |
| Email completeness | 205 of 371 |
| Mobile contact completeness | 332 of 371 |
| Service days completeness | 246 of 371 |
| Visiting hours completeness | 265 of 371 |
| Cost completeness | 226 of 371 |

---

## Important Data Limitation

This project uses a **directory-derived planning dataset**. It should not be interpreted as a complete, verified government census of all mental health facilities in Bangladesh.

Districts with zero indexed facilities may represent:

1. A true service gap,
2. A directory coverage gap, or
3. Both.

Researchers and planners should validate dashboard findings against official DGHS, MOHFW, or local administrative records before drawing conclusions about absolute service availability.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend framework | React |
| Language | TypeScript |
| Build tool | Vite |
| Mapping | Leaflet |
| Marker clustering | leaflet.markercluster |
| Heatmap | leaflet.heat |
| Charts | Recharts |
| UI components | Shadcn/ui and Radix UI |
| Styling | Tailwind CSS |
| Routing | React Router |
| PDF export | html2pdf.js |
| Image export | html-to-image |
| Testing | Vitest |

The dashboard is implemented as a static single-page application. Core dashboard use does not require an application backend, database, login system, or server-side API.

---

## Project Structure

```text
mental-health-atlas-bd/
├── public/
│   └── data/
│       ├── facilities.json
│       ├── districts_pop.json
│       └── district.geojson
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── types/
│   └── utils/
├── components.json
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

Install Node.js and npm.

Check installation:

```bash
node -v
npm -v
```

Recommended environment:

```text
Node.js: 18 or later
npm: 9 or later
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/mh-atlas/mental-health-atlas-bd.git
```

Go to the project directory:

```bash
cd mental-health-atlas-bd
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the local development URL shown in the terminal.

Common local URL:

```text
http://localhost:8080
```

Depending on your environment, Vite may also use another local port.

---

## Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment

The project can be deployed as static web files using platforms such as:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- Any static web server

The current public deployment is available at:

```text
https://mh-atlas-bd.vercel.app/
```

---

## Data Update Workflow

The current dashboard loads static JSON and GeoJSON files. Updating the dataset requires replacing or regenerating the files in the `/public/data/` or deployed `/data/` directory, then rebuilding and redeploying the site.

Typical workflow:

1. Update source facility or district data.
2. Clean and standardize field names.
3. Validate district codes and coordinates.
4. Export updated JSON/GeoJSON files.
5. Replace files in the data directory.
6. Run build.
7. Redeploy the dashboard.

Future versions may include an authenticated administrative update mechanism.

---

## Privacy and Security

This repository should not include sensitive, private, or confidential data.

Do not upload:

```text
.env
API keys
passwords
private datasets
patient-level health data
personally identifiable information
node_modules/
dist/
```

The current dashboard does not use patient-level data, personal health information, or clinical records.

---

## Research Use

This repository supports the manuscript:

**Mental Health Atlas BD: Development of an Open-Source Interactive GIS Dashboard for National-Scope Mental Health Facility Mapping in Bangladesh**

Suggested citation text before formal publication:

```text
Mental Health Atlas BD [dashboard]. Bangladesh mental health facility mapping dashboard. Version v1.0. Data last updated 12 June 2026. Available from: https://mh-atlas-bd.vercel.app/
```

Suggested source-code citation:

```text
Mental Health Atlas BD contributors. Mental Health Atlas BD [source code]. GitHub; 2026. Available from: https://github.com/mh-atlas/mental-health-atlas-bd
```

Please update citation details after manuscript publication.

---

## License

This project is released under the MIT License. See the `LICENSE` file for details.

---

## Contributors

Mental Health Atlas BD contributors.

For manuscript submission, author names, affiliations, ORCID IDs, and CRediT contribution roles should be completed separately according to the target journal requirements.

---

## Contact

For questions, collaboration, or issue reporting, please use the GitHub repository issue tracker:

```text
https://github.com/mh-atlas/mental-health-atlas-bd/issues
```

---

## Repository Status

Current status: v1.0 public dashboard.

Planned future improvements may include:

- Authenticated data update workflow
- Formal usability evaluation
- Usage and reach analytics
- Additional facility validation against official registries
- Improved accessibility testing
- Expanded data documentation
- Additional equity and accessibility indicators
- Replication template for other LMIC mental health facility mapping projects
