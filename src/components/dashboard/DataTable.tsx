import { useState, useMemo } from 'react';
import type { DistrictPop, Facility } from '@/types/dashboard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface DataTableProps {
  districts: DistrictPop[];
  facilities: Facility[];
  onFacilityClick?: (f: Facility) => void;
}

const PAGE_SIZE = 15;

function exportCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;

  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(','),
    ...data.map((row) =>
      keys.map((k) => `"${String(row[k] ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

function formatCell(value: any, key: string): string {
  if (value == null || value === '') return '-';
  if (typeof value !== 'number') return String(value);
  if (!Number.isFinite(value)) return '-';

  const isPerCapita =
    key === 'facilitiesPer100k' ||
    key === 'populationPerFacility' ||
    key === 'householdsPerFacility' ||
    key.toLowerCase().includes('per100k') ||
    key.toLowerCase().includes('perfacility');

  if (isPerCapita) return value.toFixed(2);
  if (value >= 1000) return value.toLocaleString();

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export default function DataTable({ districts, facilities, onFacilityClick }: DataTableProps) {
  const [tab, setTab] = useState<'facilities' | 'districts'>('facilities');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filteredFacilities = useMemo(() => {
    let list = facilities;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.facility_name.toLowerCase().includes(q) ||
          f.DIS_NAME?.toLowerCase().includes(q) ||
          f.facility_type?.toLowerCase().includes(q) ||
          f.ownership?.toLowerCase().includes(q)
      );
    }

    if (sortKey) {
      list = [...list].sort((a, b) => {
        const av = (a as any)[sortKey] ?? '';
        const bv = (b as any)[sortKey] ?? '';
        const cmp =
          typeof av === 'number' && typeof bv === 'number'
            ? av - bv
            : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return list;
  }, [facilities, search, sortKey, sortDir]);

  const filteredDistricts = useMemo(() => {
    let list = districts;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.DIS_NAME?.toLowerCase().includes(q) ||
          d.DIV_NAME?.toLowerCase().includes(q)
      );
    }

    if (sortKey) {
      list = [...list].sort((a, b) => {
        const av = (a as any)[sortKey] ?? '';
        const bv = (b as any)[sortKey] ?? '';
        const cmp =
          typeof av === 'number' && typeof bv === 'number'
            ? av - bv
            : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return list;
  }, [districts, search, sortKey, sortDir]);

  const currentData = tab === 'facilities' ? filteredFacilities : filteredDistricts;
  const totalPages = Math.max(1, Math.ceil(currentData.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageData = currentData.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const facCols = [
    { key: 'facility_name', label: 'Name' },
    { key: 'DIS_NAME', label: 'District' },
    { key: 'facility_type', label: 'Type' },
    { key: 'services_provided', label: 'Services' },
    { key: 'ownership', label: 'Ownership' },
    { key: 'cost', label: 'Cost' },
    { key: 'appointment_required', label: 'Appt.' },
    { key: 'category_adult_child_both', label: 'Category' },
  ];

  const distCols = [
    { key: 'DIS_NAME', label: 'District' },
    { key: 'Population', label: 'Population' },
    { key: 'total_facilities', label: 'Facilities' },
    { key: 'Poverty Index', label: 'Poverty' },
    { key: 'Literacy_rate', label: 'Literacy %' },
    { key: 'Urban_percent', label: 'Urban %' },
    { key: 'Total_households', label: 'Households' },
    { key: 'facilitiesPer100k', label: 'Per 100K' },
    { key: 'populationPerFacility', label: 'Pop/Facility' },
  ];

  const cols = tab === 'facilities' ? facCols : distCols;

  return (
    <div className="dashboard-panel animate-fade-in">
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-blue-950 dark:border-blue-900/50 dark:bg-blue-950/25 dark:text-blue-100">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <p className="text-xs leading-relaxed">
            Export downloads the currently filtered table as CSV. Facility records are
            directory-derived and should be validated against official registries before use for
            formal service coverage decisions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-lg bg-secondary p-0.5" role="tablist" aria-label="Data table type">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'facilities'}
              onClick={() => {
                setTab('facilities');
                setPage(0);
                setSortKey('');
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                tab === 'facilities'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Facilities ({facilities.length})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={tab === 'districts'}
              onClick={() => {
                setTab('districts');
                setPage(0);
                setSortKey('');
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                tab === 'districts'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              District Summary ({districts.length})
            </button>
          </div>

          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search table..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="h-8 border-0 bg-secondary pl-8 text-xs"
              aria-label="Search table"
            />
          </div>

          {tab === 'facilities' ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={filteredFacilities.length === 0}
              onClick={() => exportCSV(filteredFacilities as any[], 'facilities.csv')}
              aria-label="Export filtered facilities as CSV"
            >
              <Download className="mr-1 h-3 w-3" aria-hidden="true" />
              Export Facilities CSV
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={filteredDistricts.length === 0}
              onClick={() => exportCSV(filteredDistricts as any[], 'districts.csv')}
              aria-label="Export filtered districts as CSV"
            >
              <Download className="mr-1 h-3 w-3" aria-hidden="true" />
              Export Districts CSV
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <caption className="sr-only">
            {tab === 'facilities'
              ? 'Filtered mental health facility records'
              : 'Filtered district summary records'}
          </caption>

          <thead>
            <tr className="bg-muted/50">
              {cols.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => handleSort(col.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort(col.key);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                  className="cursor-pointer whitespace-nowrap px-3 py-2.5 text-left font-semibold text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {col.label} {sortKey === col.key && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageData.length === 0 && (
              <tr>
                <td colSpan={cols.length} className="px-3 py-12 text-center">
                  <p className="text-sm font-medium text-foreground">No records found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try clearing the table search or broadening the dashboard filters.
                  </p>
                </td>
              </tr>
            )}

            {pageData.map((row: any, i: number) => (
              <tr
                key={`${tab}-${safePage}-${i}`}
                onClick={() => tab === 'facilities' && onFacilityClick?.(row)}
                className={`border-b border-border/50 transition-colors hover:bg-muted/30 ${
                  tab === 'facilities' && onFacilityClick ? 'cursor-pointer' : ''
                }`}
              >
                {cols.map((col) => (
                  <td
                    key={col.key}
                    className="max-w-[220px] truncate whitespace-nowrap px-3 py-2"
                    title={String(row[col.key] ?? '')}
                  >
                    {formatCell(row[col.key], col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border p-3 text-xs text-muted-foreground">
        <span>
          {currentData.length === 0
            ? '0 results'
            : `Showing ${safePage * PAGE_SIZE + 1}–${Math.min(
                (safePage + 1) * PAGE_SIZE,
                currentData.length
              )} of ${currentData.length}`}
        </span>

        <div className="flex gap-1" aria-label="Table pagination">
          <Button
            variant="ghost"
            size="sm"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="h-7 w-7 p-0"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="h-7 w-7 p-0"
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
