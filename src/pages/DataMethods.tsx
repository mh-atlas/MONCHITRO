import type { ElementType, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Database,
  FileText,
  Info,
  ShieldAlert,
  Calculator,
  ClipboardList,
} from 'lucide-react';
import AppHeader from '@/components/dashboard/AppHeader';
import { Button } from '@/components/ui/button';

const DASHBOARD_VERSION = 'v1.0';
const DATA_LAST_UPDATED = '12 June 2026';
const FACILITY_RECORDS = 371;
const DISTRICTS_WITH_INDEXED_FACILITIES = 44;
const DISTRICT_DENOMINATORS = 64;
const ZERO_INDEXED_DISTRICTS = 20;

function SectionCard({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: ElementType;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="dashboard-panel p-5 md:p-6 scroll-mt-24">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground md:text-lg">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function DefinitionRow({ term, definition }: { term: string; definition: string }) {
  return (
    <tr className="border-b border-border/60 last:border-0">
      <th
        scope="row"
        className="w-[220px] px-3 py-2.5 text-left align-top text-xs font-semibold text-foreground"
      >
        {term}
      </th>
      <td className="px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        {definition}
      </td>
    </tr>
  );
}

function IndicatorRow({
  indicator,
  formula,
  interpretation,
}: {
  indicator: string;
  formula: string;
  interpretation: string;
}) {
  return (
    <tr className="border-b border-border/60 last:border-0">
      <th
        scope="row"
        className="w-[220px] px-3 py-2.5 text-left align-top text-xs font-semibold text-foreground"
      >
        {indicator}
      </th>
      <td className="px-3 py-2.5 align-top font-mono text-xs text-foreground">
        {formula}
      </td>
      <td className="px-3 py-2.5 align-top text-xs leading-relaxed text-muted-foreground">
        {interpretation}
      </td>
    </tr>
  );
}

export default function DataMethods() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 p-4 md:p-8" id="main-content">
        <div className="mx-auto max-w-5xl space-y-5 animate-fade-in">
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                Data transparency and reproducibility
              </p>
              <h1 className="text-xl font-bold text-foreground md:text-2xl">
                Data & Methods
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                This page documents the dashboard purpose, data sources, analytical indicators,
                limitations, and variable definitions. It is intended to support manuscript review,
                public interpretation, and reuse of the dashboard for planning and research.
              </p>
            </div>

            <Button variant="outline" onClick={() => navigate('/')} className="w-full md:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to dashboard
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <div className="dashboard-panel p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Dashboard version
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">{DASHBOARD_VERSION}</p>
            </div>

            <div className="dashboard-panel p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Last updated
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">{DATA_LAST_UPDATED}</p>
            </div>

            <div className="dashboard-panel p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Facility records
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">{FACILITY_RECORDS}</p>
            </div>

            <div className="dashboard-panel p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                District denominators
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">{DISTRICT_DENOMINATORS}</p>
            </div>
          </div>

          <nav
            aria-label="Data and methods sections"
            className="dashboard-panel flex flex-wrap gap-2 p-3 text-xs"
          >
            {[
              ['overview', 'Overview'],
              ['sources', 'Data sources'],
              ['quality', 'Data quality'],
              ['indicators', 'Indicators'],
              ['dictionary', 'Data dictionary'],
              ['limitations', 'Limitations'],
              ['citation', 'Citation'],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {label}
              </a>
            ))}
          </nav>

          <SectionCard id="overview" icon={Info} title="Dashboard purpose and scope">
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Mental Health Atlas BD is an open-source, browser-based interactive GIS dashboard
                for national-scope mental health facility mapping in Bangladesh. It supports
                facility lookup, district-level service coverage comparison, equity-oriented
                planning, tabular export, and structured report generation.
              </p>

              <p>
                The dashboard visualizes {FACILITY_RECORDS} indexed mental health service
                facilities across {DISTRICTS_WITH_INDEXED_FACILITIES} of Bangladesh&apos;s 64
                administrative districts. District-level population and socioeconomic denominator
                data are available for all {DISTRICT_DENOMINATORS} districts.
              </p>

              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
                The dashboard is a planning and research-support tool. It is not an emergency
                referral system, a clinical decision-support tool, or a verified government census
                of all mental health services in Bangladesh.
              </p>
            </div>
          </SectionCard>

          <SectionCard id="sources" icon={Database} title="Data sources and processing">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                The facility dataset is derived from the ADD International Bangladesh Mental Health
                Service Directory. The raw directory was standardized into a structured facility
                table with harmonized field names, cleaned categorical values, district identifiers,
                and latitude/longitude coordinates.
              </p>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left font-semibold">
                        Dataset
                      </th>
                      <th scope="col" className="px-3 py-2 text-left font-semibold">
                        Source
                      </th>
                      <th scope="col" className="px-3 py-2 text-left font-semibold">
                        Coverage
                      </th>
                      <th scope="col" className="px-3 py-2 text-left font-semibold">
                        Dashboard file
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2 align-top text-foreground">Facility records</td>
                      <td className="px-3 py-2 align-top">
                        ADD International Bangladesh Mental Health Service Directory
                      </td>
                      <td className="px-3 py-2 align-top">371 indexed facilities</td>
                      <td className="px-3 py-2 align-top font-mono">/data/facilities.json</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2 align-top text-foreground">
                        Population and socioeconomic denominators
                      </td>
                      <td className="px-3 py-2 align-top">
                        Bangladesh Bureau of Statistics Census 2022
                      </td>
                      <td className="px-3 py-2 align-top">64 districts</td>
                      <td className="px-3 py-2 align-top font-mono">/data/districts_pop.json</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2 align-top text-foreground">
                        District boundaries
                      </td>
                      <td className="px-3 py-2 align-top">
                        GADM Level 2 Bangladesh boundaries
                      </td>
                      <td className="px-3 py-2 align-top">64 district polygons</td>
                      <td className="px-3 py-2 align-top font-mono">/data/district.geojson</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>

          <SectionCard id="quality" icon={ClipboardList} title="Data quality summary">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Spatial coordinates</p>
                <p className="mt-1 text-lg font-bold text-foreground">100%</p>
                <p className="mt-1 text-xs text-muted-foreground">371 of 371 records</p>
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Website completeness</p>
                <p className="mt-1 text-lg font-bold text-foreground">38.0%</p>
                <p className="mt-1 text-xs text-muted-foreground">141 of 371 records</p>
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Cost completeness</p>
                <p className="mt-1 text-lg font-bold text-foreground">60.9%</p>
                <p className="mt-1 text-xs text-muted-foreground">226 of 371 records</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Missing, blank, null, N/A, and placeholder values such as “Call for details” are
              interpreted as incomplete for data quality reporting. Coordinate validity is assessed
              by checking whether each latitude/longitude pair falls within the Bangladesh national
              bounding box used in the manuscript.
            </p>
          </SectionCard>

          <SectionCard id="indicators" icon={Calculator} title="Calculated indicators">
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Calculated indicators are derived at runtime after loading the static district and
                facility datasets into browser memory.
              </p>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left font-semibold">
                        Indicator
                      </th>
                      <th scope="col" className="px-3 py-2 text-left font-semibold">
                        Formula
                      </th>
                      <th scope="col" className="px-3 py-2 text-left font-semibold">
                        Interpretation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <IndicatorRow
                      indicator="Facilities per 100,000 population"
                      formula="facility_count / population × 100,000"
                      interpretation="Higher values indicate greater indexed facility density."
                    />
                    <IndicatorRow
                      indicator="Population per facility"
                      formula="population / facility_count"
                      interpretation="Higher values indicate a larger population served per indexed facility."
                    />
                    <IndicatorRow
                      indicator="Households per facility"
                      formula="total_households / facility_count"
                      interpretation="Provides a household-based service availability denominator."
                    />
                    <IndicatorRow
                      indicator="Zero-indexed district"
                      formula="facility_count = 0"
                      interpretation="May reflect a true service gap, directory coverage gap, or both."
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>

          <SectionCard id="dictionary" icon={BookOpen} title="Data dictionary">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-xs">
                <tbody>
                  <DefinitionRow
                    term="facility_name"
                    definition="Name of the indexed mental health service facility."
                  />
                  <DefinitionRow
                    term="facility_type"
                    definition="Type of facility, such as psychiatric service, general hospital, child development centre, OCC, mental health institute, trauma center, or neuro service."
                  />
                  <DefinitionRow
                    term="services_provided"
                    definition="Short description of the mental health or psychosocial services listed for the facility."
                  />
                  <DefinitionRow
                    term="ownership"
                    definition="Administrative ownership category, mainly government or private in the current dataset."
                  />
                  <DefinitionRow
                    term="cost"
                    definition="Recorded service cost category, including free, paid brackets, call for details, or missing/unknown."
                  />
                  <DefinitionRow
                    term="appointment_required"
                    definition="Whether the listed facility requires an appointment or accepts walk-in clients."
                  />
                  <DefinitionRow
                    term="category_adult_child_both"
                    definition="Patient service category, including adult psychiatry, child and adolescent mental health, or trauma/OCC categories."
                  />
                  <DefinitionRow
                    term="latitude / longitude"
                    definition="Geographic coordinates used to place facility markers on the interactive map."
                  />
                  <DefinitionRow
                    term="DIV_NAME / DIS_NAME"
                    definition="Division and district names used for filtering, grouping, and display."
                  />
                  <DefinitionRow
                    term="DIV_CODE / DIS_CODE"
                    definition="Administrative join keys used to connect facilities, district denominators, and boundary polygons."
                  />
                  <DefinitionRow
                    term="Population"
                    definition="District-level population denominator from BBS Census 2022 data used in service-density indicators."
                  />
                  <DefinitionRow
                    term="Poverty Index"
                    definition="District-level socioeconomic indicator included for equity-oriented exploration."
                  />
                  <DefinitionRow
                    term="Literacy_rate"
                    definition="District-level literacy percentage used as a contextual socioeconomic indicator."
                  />
                  <DefinitionRow
                    term="Urban_percent"
                    definition="Percentage of district population classified as urban."
                  />
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard id="limitations" icon={ShieldAlert} title="Interpretation limitations">
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>
                The facility dataset is directory-derived and should not be interpreted as a
                verified national census of all mental health services in Bangladesh.
              </li>
              <li>
                The {ZERO_INDEXED_DISTRICTS} zero-indexed districts may represent true service
                gaps, directory coverage gaps, or both. They require validation against DGHS or
                MOHFW registries before being interpreted as confirmed service deserts.
              </li>
              <li>
                Operational fields such as website, service days, visiting hours, and cost have
                partial completeness and should be interpreted with caution.
              </li>
              <li>
                Coordinates are inherited from the processed source dataset. Any upstream geocoding
                error will affect marker placement and distance-based interpretation.
              </li>
              <li>
                The feedback form supports informal improvement tracking, but it is not a formal
                usability evaluation, System Usability Scale assessment, or representative user
                study.
              </li>
            </ul>
          </SectionCard>

          <SectionCard id="citation" icon={FileText} title="Citation and reuse">
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                Suggested citation text can be updated after manuscript acceptance. Until then,
                cite the dashboard as:
              </p>

              <div className="rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs text-foreground">
                Mental Health Atlas BD [dashboard]. Bangladesh mental health facility mapping
                dashboard. Version {DASHBOARD_VERSION}. Data last updated {DATA_LAST_UPDATED}.
              </div>

              <p>
                The dashboard and source code are intended for research, public health planning,
                and transparent reuse with proper attribution to the project team and data sources.
              </p>
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
