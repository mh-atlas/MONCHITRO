# Mental Health Atlas BD

A web-based mental health facility atlas for Bangladesh with geospatial visualization and service information.

## Overview

Mental Health Atlas BD is designed to support the exploration and visualization of mental health facilities across Bangladesh. The platform presents facility-level information in a map-based interface to help users understand service distribution, geographic coverage, and potential accessibility gaps.

The project is intended for public health planning, research, service mapping, and decision-support related to mental health service availability in Bangladesh.

## Key Features

- Interactive map-based visualization of mental health facilities
- Facility location display with service-related information
- Bangladesh-focused geographic interface
- Search and exploration support for users
- Clean web interface for public health and planning use
- Repository structure suitable for future dashboard and data expansion

## Purpose

Mental health service information is often difficult to explore spatially. This project aims to make facility distribution easier to understand through a simple, accessible, and visual platform.

The atlas can support:

- Health service planning
- Facility mapping
- Public health research
- Service gap identification
- Stakeholder communication
- Data-driven decision-making

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- JavaScript / HTML / CSS
- GitHub for version control

## Project Structure

```text
mental-health-atlas-bd/
├── public/
├── src/
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

## Getting Started

### Prerequisites

Make sure Node.js and npm are installed on your computer.

Check installation:

```bash
node -v
npm -v
```

### Installation

Clone the repository:

```bash
git clone https://github.com/mh-atlas/mental-health-atlas-bd.git
```

Go to the project folder:

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

Then open the local development URL shown in the terminal. It is usually:

```text
http://localhost:5173
```

## Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Data and Privacy Note

This repository should not include sensitive, private, or confidential data.

## Repository Status

Initial public version.

Possible future improvements include:

- Facility category filters
- Administrative boundary filters
- Service type visualization
- Facility detail panels
- Accessibility analysis
- Dashboard indicators
- Updated data documentation

## License

This project is released under the MIT License. See the `LICENSE` file for details.

## Contributors

Mental Health Atlas BD contributors

## Contact

For questions or collaboration, please contact the project maintainers through this GitHub repository.
