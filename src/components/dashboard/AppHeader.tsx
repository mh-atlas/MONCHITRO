import { useTransition } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Map,
  BarChart3,
  Table2,
  FileText,
  MessageSquare,
  Menu,
  X,
  Info,
} from 'lucide-react';

export type TabKey = 'map' | 'insights' | 'table' | 'report';

const TAB_WIDTH = 92;
const TAB_GAP = 4;

const NAV_TABS = [
  { key: 'map' as TabKey, label: 'Map', icon: Map },
  { key: 'insights' as TabKey, label: 'Insights', icon: BarChart3 },
  { key: 'table' as TabKey, label: 'Data table', icon: Table2 },
  { key: 'report' as TabKey, label: 'Report', icon: FileText },
];

interface AppHeaderProps {
  activeTab?: TabKey;
  onTabChange?: (tab: TabKey) => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export default function AppHeader({
  activeTab = 'map',
  onTabChange,
  sidebarOpen = false,
  onToggleSidebar,
  showSidebarToggle = false,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPending, startTransition] = useTransition();

  const onFeedback = location.pathname === '/feedback';
  const onDataMethods = location.pathname === '/data-methods';
  const onSpecialPage = onFeedback || onDataMethods;

  const activeIndex = NAV_TABS.findIndex((tab) => tab.key === activeTab);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const handleTabClick = (tab: TabKey) => {
    startTransition(() => {
      if (onSpecialPage || !onTabChange) {
        navigate(tab === 'map' ? '/' : `/?tab=${tab}`);
        return;
      }

      onTabChange(tab);
    });
  };

  const handleFeedbackClick = () => {
    if (!onFeedback) navigate('/feedback');
  };

  const handleDataMethodsClick = () => {
    if (!onDataMethods) navigate('/data-methods');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-card/85 backdrop-blur-xl supports-[backdrop-filter]:bg-card/75">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to main content
      </a>

      <div className="flex items-center gap-3 px-3 py-2.5 md:px-4">
        {showSidebarToggle && onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? 'Close filters' : 'Open filters'}
            aria-expanded={sidebarOpen}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Go to dashboard"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Map className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </button>
        )}

        <div className="min-w-0 flex-shrink-0">
          <h1 className="truncate text-sm font-bold leading-tight text-foreground md:text-base">
            Mental Health Atlas
          </h1>

          <p className="hidden truncate text-[11px] text-muted-foreground sm:block md:text-xs">
            Interactive mental health service mapping for Bangladesh
          </p>
        </div>

        <nav
          className="flex min-w-0 flex-1 justify-center"
          aria-label="Dashboard sections"
        >
          <div className="max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="relative flex min-w-max gap-1 rounded-2xl border border-border/60 bg-muted/55 p-1 shadow-inner">
              {!onSpecialPage && (
                <div
                  className="absolute bottom-1 top-1 rounded-xl bg-primary shadow-sm transition-transform duration-300 ease-out"
                  style={{
                    width: `${TAB_WIDTH}px`,
                    transform: `translateX(${safeActiveIndex * (TAB_WIDTH + TAB_GAP)}px)`,
                  }}
                  aria-hidden="true"
                />
              )}

              {NAV_TABS.map((tab) => {
                const isActive = !onSpecialPage && activeTab === tab.key;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabClick(tab.key)}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Open ${tab.label}`}
                    className={`relative z-10 flex h-9 w-[92px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-[13px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? 'font-semibold text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isActive ? 'scale-110' : ''
                      }`}
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleDataMethodsClick}
            aria-current={onDataMethods ? 'page' : undefined}
            aria-label="Open data and methods"
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-[7px] text-[13px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              onDataMethods
                ? 'border-primary/80 bg-primary font-medium text-primary-foreground shadow-sm'
                : 'border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground'
            }`}
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden md:inline">Data & Methods</span>
          </button>

          <button
            type="button"
            onClick={handleFeedbackClick}
            aria-current={onFeedback ? 'page' : undefined}
            aria-label="Open feedback"
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-[7px] text-[13px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              onFeedback
                ? 'border-primary/80 bg-primary font-medium text-primary-foreground shadow-sm'
                : 'border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Feedback</span>
          </button>
        </div>
      </div>

      {isPending && (
        <div className="h-[2px] w-full overflow-hidden bg-muted" aria-hidden="true">
          <div className="h-full w-1/3 animate-pulse bg-primary" />
        </div>
      )}
    </header>
  );
}
