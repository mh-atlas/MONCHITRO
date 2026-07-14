# MONCHITRO

**MONCHITRO** is an open-source, browser-based interactive GIS dashboard for mapping and exploring mental health service facilities across Bangladesh.

Live dashboard: https://monchitro.vercel.app/
Source code: https://github.com/mh-atlas/MONCHITRO
Version: v1.0
Data last updated: 12 June 2026
License: MIT

---

## Overview

MONCHITRO visualizes indexed mental health service facilities across Bangladesh through an interactive geospatial dashboard.

The application is designed to support:

* Public health planning
* Mental health service mapping
* Geographic coverage assessment
* Referral planning
* Facility distribution analysis
* District-level equity analysis
* Research and policy communication
* Identification of potential service gaps requiring further validation

The current v1.0 dashboard includes:

* 371 indexed mental health service facilities
* 44 of 64 districts with at least one indexed facility
* All 8 administrative divisions of Bangladesh
* District-level population and socioeconomic denominator data for all 64 districts
* District boundary polygons for national-level choropleth mapping

MONCHITRO is a planning and decision-support application. It is not a verified national census of all mental health services and should not be used as an emergency referral system.

---

## Purpose

Mental health service information can be difficult to explore geographically. Planners, researchers, nongovernmental organizations, government agencies, and service providers may need to understand:

* Where mental health services are available
* Which districts appear underserved
* How facilities are distributed across administrative areas
* How service availability relates to population
* Whether services are government, private, or nongovernmental
* Which apparent service gaps require field-level verification

MONCHITRO makes facility-level information easier to search, filter, visualize, compare, and export through a public web dashboard.

---

## Key Features

### Interactive Map

The interactive map includes:

* Bangladesh district boundaries
* Facility marker clusters
* Facility density heatmap
* District bubble overlay
* District labels
* Choropleth indicators
* Multiple basemap options
* District information popups
* Facility information popups
* Fullscreen map view
* Map snapshot support

### Choropleth Indicators

The map supports district-level visualization of:

* Facility count
* Population
* Facilities per 100,000 population
* Population per facility
* Poverty index
* Literacy rate
* Urban population percentage

### Filters

Users can filter the dashboard by:

* Facility name
* Division
* District
* Ownership
* Facility type
* Free service availability
* Appointment requirements
* Walk-in availability

Active filters are displayed as removable filter chips.

### Insights Tab

The Insights tab provides visual summaries of:

* Facilities by district
* Facilities per 100,000 population
* District coverage gaps
* Best-served districts
* Division-level comparisons
* Ownership distribution
* Government and private facility distribution
* Cost bracket distribution
* Facility type distribution
* District comparisons

### Data Table Tab

The Data Table tab provides:

* Searchable facility records
* Searchable district records
* Sortable columns
* Pagination
* CSV export of filtered facility data
* CSV export of filtered district summary data

Exported data are derived from the dashboard directory and should be validated against official registries before being used for formal service-coverage decisions.

### Report Tab

The Report tab allows users to generate a structured report based on:

* Selected geographic scope
* Active dashboard filters
* Selected report sections
* Current facility and district indicators

Reports can be downloaded as PDF files through client-side report generation.

### Data & Methods Page

The Data & Methods page documents:

* Application scope
* Data sources
* Data coverage
* Denominator coverage
* Calculated indicators
* Data dictionary entries
* Interpretation guidance
* Application limitations

### Feedback Page

The application includes a feedback page where users can provide:

* User role
* Ease-of-use rating
* Intended use
* Suggested improvements
* General comments

Feedback is used for application improvement and issue tracking.

---

## Data Sources

MONCHITRO uses three main data inputs.

| Dataset                   | Description                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Facility records          | Indexed mental health service facilities derived from the ADD International Bangladesh Mental Health Service Directory |
| District denominator data | Bangladesh Bureau of Statistics Census 2022 district-level population and socioeconomic indicators                     |
| District boundaries       | GADM Level 2 Bangladesh district boundary polygons                                                                     |

Runtime data files are loaded from the `/data` directory:

```text
/data/facilities.json
/data/districts_pop.json
/data/district.geojson
```

---

## Data Coverage

| Indicator                         | Current value |
| --------------------------------- | ------------: |
| Indexed facilities                |           371 |
| Districts with indexed facilities |      44 of 64 |
| Districts with denominator data   |      64 of 64 |
| Divisions represented             |        8 of 8 |
| Coordinate completeness           |    371 of 371 |
| Website completeness              |    141 of 371 |
| Email completeness                |    205 of 371 |
| Mobile contact completeness       |    332 of 371 |
| Service days completeness         |    246 of 371 |
| Visiting hours completeness       |    265 of 371 |
| Cost completeness                 |    226 of 371 |

---

## Data Limitations

MONCHITRO uses a directory-derived planning dataset. It should not be interpreted as a complete or verified government census of all mental health facilities in Bangladesh.

A district with zero indexed facilities may indicate:

1. A genuine service gap
2. Incomplete directory coverage
3. An unverified or outdated facility record
4. A combination of service and data gaps

Dashboard findings should be validated against official DGHS, Ministry of Health and Family Welfare, local administrative, or facility-level records before making formal decisions about absolute service availability.

Facility availability, service schedules, contact details, costs, ownership, and appointment requirements may change over time.

---

## Technology Stack

| Layer              | Technology             |
| ------------------ | ---------------------- |
| Frontend framework | React                  |
| Language           | TypeScript             |
| Build tool         | Vite                   |
| Mapping            | Leaflet                |
| Marker clustering  | leaflet.markercluster  |
| Heatmap            | leaflet.heat           |
| Charts             | Recharts               |
| UI components      | Shadcn/ui and Radix UI |
| Styling            | Tailwind CSS           |
| Routing            | React Router           |
| PDF export         | html2pdf.js            |
| Image export       | html-to-image          |
| Testing            | Vitest                 |

MONCHITRO is implemented as a static single-page application.

The main dashboard does not require:

* User registration
* User login
* A central application database
* A server-side application API
* Patient-level health data

---

## Project Structure

```text
MONCHITRO/
├── public/
│   └── data/
│       ├── facilities.json
│       ├── districts_pop.json
│       └── district.geojson
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── lib/
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

Check the installed versions:

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
git clone https://github.com/mh-atlas/MONCHITRO.git
```

Go to the project directory:

```bash
cd MONCHITRO
```

Install the project dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the local development address displayed in the terminal.

The default local address may be:

```text
http://localhost:8080
```

Vite may use another available port if the configured port is unavailable.

---

## Available Commands

### Start the development server

```bash
npm run dev
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Run linting

```bash
npm run lint
```

### Run tests

```bash
npm run test
```

---

## Build for Production

Create a production build:

```bash
npm run build
```

The compiled application will be generated in:

```text
dist/
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment

MONCHITRO can be deployed as a static web application using:

* Vercel
* Netlify
* GitHub Pages
* Cloudflare Pages
* Any compatible static web server

The current public deployment is available at:

```text
https://monchitro.vercel.app/
```

The source code is available at:

```text
https://github.com/mh-atlas/MONCHITRO
```

---

## Data Update Workflow

MONCHITRO loads static JSON and GeoJSON files from the public data directory.

To update dashboard data:

1. Update the source facility or district datasets.
2. Clean and standardize field names.
3. Validate division and district names.
4. Validate district codes.
5. Validate facility coordinates.
6. Check missing and duplicate records.
7. Regenerate the required JSON or GeoJSON files.
8. Replace the files in `public/data/`.
9. Run the production build.
10. Review the dashboard outputs.
11. Redeploy the application.

The main runtime files are:

```text
public/data/facilities.json
public/data/districts_pop.json
public/data/district.geojson
```

Future versions may include a protected administrative data-update workflow.

---

## Privacy and Security

This repository should not contain confidential, restricted, or sensitive information.

Do not upload or commit:

```text
.env
.env.local
API keys
access tokens
passwords
private keys
private datasets
patient-level health data
personally identifiable information
node_modules/
dist/
```

The current dashboard does not use:

* Patient-level records
* Clinical case records
* Personal health information
* User accounts
* Authentication credentials
* Payment information

Only facility information intended for public display should be included in the deployed data directory.

---

## Responsible Use

MONCHITRO should be used as a planning, exploration, and decision-support application.

Users should not rely exclusively on the dashboard for:

* Emergency mental health referrals
* Clinical decision-making
* Confirmation that a facility is currently operating
* Confirmation of service availability
* Confirmation of visiting hours
* Confirmation of treatment costs
* Confirmation of appointment requirements
* Definitive conclusions about district-level service absence

Facility information should be independently verified before referral, travel, programme planning, or formal reporting.

---

## Accessibility

The application aims to support accessible use through:

* Responsive layouts
* Keyboard-accessible interface components
* Visible focus states
* Semantic page structure
* Descriptive labels
* Readable tables and charts
* Alternative text for meaningful images
* Accessible map and loading-state descriptions

Accessibility testing and improvements will continue in future versions.

---

## Browser Support

MONCHITRO is intended for current versions of:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

JavaScript must be enabled to use the interactive dashboard.

For the best experience, use a modern desktop or mobile browser with an active internet connection.

---

## License

MONCHITRO is released under the MIT License.

See the `LICENSE` file for the complete licence terms.

---

## Contact and Issue Reporting

For technical issues, data corrections, feature requests, or application feedback, use the GitHub issue tracker:

```text
https://github.com/mh-atlas/MONCHITRO/issues
```

When reporting an issue, include:

* A clear description of the problem
* The affected page or dashboard section
* Steps to reproduce the issue
* Browser and device information
* Screenshots where appropriate
* Suggested data corrections, where applicable

Do not include sensitive or patient-level information in issue reports.

---

## Application Status

Current status:

```text
Version v1.0 public dashboard
```

Planned improvements may include:

* Protected data-update workflows
* Additional facility validation
* Improved security controls
* Expanded accessibility testing
* Improved mobile usability
* Additional data documentation
* Additional service-accessibility indicators
* Improved export functionality
* Performance optimization
* Formal application usability testing
* Templates for adapting the dashboard to other service-mapping applications
