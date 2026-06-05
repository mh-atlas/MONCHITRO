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

  const activeIndex = NAV_TABS.findIndex((tab) => tab.key === activeTab);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const handleTabClick = (tab: TabKey) => {
    startTransition(() => {
      if (onFeedback) {
        navigate('/');
      }

      onTabChange?.(tab);
    });
  };

  const handleFeedbackClick = () => {
    if (!onFeedback) {
      navigate('/feedback');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-card/85 backdrop-blur-xl supports-[backdrop-filter]:bg-card/75">
      <div className="flex items-center gap-3 px-3 py-2.5 md:px-4">
        {showSidebarToggle && onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? 'Close filters' : 'Open filters'}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Menu className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 12L6 8l4-4" />
            </svg>
          </button>
        )}

        <div className="min-w-0 flex-shrink-0">
          <h1 className="truncate text-sm font-bold leading-tight text-foreground md:text-base">
            Mental Health Atlas
          </h1>

          <p className="hidden truncate text-[11px] text-muted-foreground sm:block md:text-xs">
            Bangladesh mental health facility dashboard
          </p>
        </div>

        <nav
          className="flex min-w-0 flex-1 justify-center"
          aria-label="Dashboard sections"
        >
          <div className="max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="relative flex min-w-max gap-1 rounded-2xl border border-border/60 bg-muted/55 p-1 shadow-inner">
              {!onFeedback && (
                <div
                  className="absolute bottom-1 top-1 rounded-xl bg-primary shadow-sm transition-transform duration-300 ease-out"
                  style={{
                    width: `${TAB_WIDTH}px`,
                    transform: `translateX(${
                      safeActiveIndex * (TAB_WIDTH + TAB_GAP)
                    }px)`,
                  }}
                />
              )}

              {NAV_TABS.map((tab) => {
                const isActive = !onFeedback && activeTab === tab.key;
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
        <div className="h-[2px] w-full overflow-hidden bg-muted">
          <div className="h-full w-1/3 animate-pulse bg-primary" />
        </div>
      )}
    </header>
  );
}
