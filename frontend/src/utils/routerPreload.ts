// routerPreload.ts - Dynamic route chunk & asset preloader on hover/focus

type RouteLoader = () => Promise<any>;

const routeLoaders: Record<string, RouteLoader> = {
  '/': () => import('../pages/HomePage'),
  '/jobs': () => import('../pages/JobBrowsePage'),
  '/login': () => import('../pages/LoginPage'),
  '/register': () => import('../pages/RegisterPage'),
  '/employer/dashboard': () => import('../pages/employer/EmployerDashboard'),
  '/employer/my-jobs': () => import('../pages/employer/MyJobsPage'),
  '/employer/post-job': () => import('../pages/PostJobPage'),
  '/student/dashboard': () => import('../pages/student/StudentDashboard'),
  '/student/applications': () => import('../pages/student/MyApplicationsPage'),
};

const preloadedCache = new Set<string>();

/**
 * Preload dynamic route chunks before navigation occurs
 */
export function preloadRoute(path: string): void {
  // Normalize path (strip query params or hash)
  const basePath = path.split('?')[0].split('#')[0];

  if (preloadedCache.has(basePath)) return;

  const loader = routeLoaders[basePath];
  if (loader) {
    preloadedCache.add(basePath);
    // Execute dynamic import in background idle queue
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        loader().catch(() => {
          preloadedCache.delete(basePath);
        });
      });
    } else {
      setTimeout(() => {
        loader().catch(() => {
          preloadedCache.delete(basePath);
        });
      }, 0);
    }
  }
}
