import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDataLoader } from '@/hooks/useDataLoader';
import { useFilters } from '@/hooks/useFilters';
import type { TabView } from '@/types/dashboard';
import KPICards from '@/components/dashboard/KPICards';
import DistrictMap from '@/components/dashboard/DistrictMap';
import FilterPanel from '@/components/dashboard/FilterPanel';
import InsightsTab from '@/components/dashboard/InsightsTab';
import DataTable from '@/components/dashboard/DataTable';
import DistrictSummaryCards from '@/components/dashboard/DistrictSummaryCards';
import ReportTab from '@/components/dashboard/ReportTab';
import ActiveFilterChips from '@/components/dashboard/ActiveFilterChips';
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/LoadingScreen';
import AppHeader from '@/components/dashboard/AppHeader';

const VALID_TABS: TabView[] = ['map', 'insights', 'table', 'report'];

function NoDataState({
  resetFilters,
  message,
}: {
  resetFilters: () => void;
  message: string;
}) {
  return (
    <div className="dashboard-panel p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Database className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>

      <h2 className="text-base font-semibold text-foreground">No matching data</h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {message}
      </p>

      <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
        <Button size="sm" onClick={resetFilters}>
          Reset filters
        </Button>

        <Button size="sm" variant="outline" asChild>
          <Link to="/data-methods">Read data limitations</Link>
        </Button>
      </div>
    </div>
  );
}

export default function Index() {
  const { districts, facilities, geojson, loading, error, reload } = useDataLoader();

  const {
    filters,
    updateFilter,
    resetFilters,
    mapDisplay,
    updateMapDisplay,
    selectedDistrict,
    setSelectedDistrict,
    activeDistricts,
    activeFacilities,
    filterOptions,
  } = useFilters(districts, facilities);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabView) || 'map';

  const [activeTab, setActiveTab] = useState<TabView>(
    VALID_TABS.includes(initialTab) ? initialTab : 'map'
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };

    check();
    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    if (activeTab === 'map') {
      next.delete('tab');
    } else {
      next.set('tab', activeTab);
    }

    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const districtNameLookup = useMemo(() => {
    const m: Record<string, string> = {};

    districts.forEach((d) => {
      if (d.DIS_CODE) m[d.DIS_CODE] = d.DIS_NAME;
    });

    return m;
  }, [districts]);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />

        <main
          id="main-content"
          className="flex flex-1 items-center justify-center p-6"
        >
          <div className="max-w-lg rounded-2xl border border-border bg-card p-6 text-center shadow-sm animate-fade-in">
            <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-destructive" />

            <h1 className="mb-2 text-lg font-bold text-foreground">
              Could not load dashboard data
            </h1>

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              The dashboard could not load one or more required static data files from the
              <span className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                /data
              </span>
              directory. Please refresh the page. If the problem continues, check that
              <span className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                facilities.json
              </span>
              ,
              <span className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                districts_pop.json
              </span>
              , and
              <span className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                district.geojson
              </span>
              are available in the public data folder.
            </p>

            <p className="mb-5 rounded-lg bg-muted px-3 py-2 text-left font-mono text-xs text-muted-foreground">
              {error}
            </p>

            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button onClick={reload} size="sm">
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Try again
              </Button>

              <Button variant="outline" size="sm" asChild>
                <Link to="/data-methods">Open Data & Methods</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabView)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        showSidebarToggle={activeTab !== 'report'}
      />

      <div className="flex flex-1 relative">
        {activeTab !== 'report' && isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {activeTab !== 'report' && (
          <aside
            aria-label="Dashboard filters"
            className={`bg-card border-r border-border transition-all duration-300 flex-shrink-0 ${
              isMobile
                ? `fixed top-[52px] bottom-0 left-0 z-50 w-[85%] max-w-[320px] shadow-xl ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  }`
                : sidebarOpen
                ? 'w-72'
                : 'w-0 overflow-hidden'
            }`}
          >
            <div
              className={`${
                isMobile ? 'h-full' : 'h-[calc(100vh-52px)] sticky top-[52px]'
              } overflow-hidden`}
            >
              <FilterPanel
                filters={filters}
                updateFilter={updateFilter}
                mapDisplay={mapDisplay}
                updateMapDisplay={updateMapDisplay}
                resetFilters={resetFilters}
                filterOptions={filterOptions}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                facilities={facilities}
                districtNameLookup={districtNameLookup}
                chipsSlot={
                  <ActiveFilterChips
                    filters={filters}
                    selectedDistrict={selectedDistrict}
                    districtNameLookup={districtNameLookup}
                    updateFilter={updateFilter}
                    setSelectedDistrict={setSelectedDistrict}
                    resetFilters={resetFilters}
                  />
                }
              />
            </div>
          </aside>
        )}

        <main id="main-content" className="flex-1 min-w-0">
          <div className={activeTab === 'report' ? '' : 'p-3 md:p-4 space-y-4'}>
            {activeTab !== 'report' && (
              <KPICards districts={activeDistricts} facilities={activeFacilities} />
            )}

            {activeTab !== 'report' && activeDistricts.length >= 2 && (
              <DistrictSummaryCards districts={activeDistricts} />
            )}

            {activeTab === 'map' &&
              (activeDistricts.length === 0 || activeFacilities.length === 0 ? (
                <NoDataState
                  resetFilters={resetFilters}
                  message="No districts or facilities match the current filter selection. Reset filters or broaden the geography/facility criteria."
                />
              ) : (
                <DistrictMap
                  geojson={geojson}
                  districts={activeDistricts}
                  facilities={activeFacilities}
                  mapDisplay={mapDisplay}
                  updateMapDisplay={updateMapDisplay}
                  selectedDistrict={selectedDistrict}
                  onDistrictClick={setSelectedDistrict}
                />
              ))}

            {activeTab === 'insights' &&
              (activeDistricts.length === 0 ? (
                <NoDataState
                  resetFilters={resetFilters}
                  message="No district-level denominator data match the current filters. Adjust filters to see insights."
                />
              ) : (
                <InsightsTab districts={activeDistricts} facilities={activeFacilities} />
              ))}

            {activeTab === 'table' && (
              <DataTable districts={activeDistricts} facilities={activeFacilities} />
            )}
          </div>

          {activeTab === 'report' && (
            <ReportTab districts={districts} facilities={facilities} />
          )}
        </main>
      </div>
    </div>
  );
}
