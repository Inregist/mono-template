import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootLayout,
  notFoundComponent: () => {
    return (
      <div>
        <p>Page Not Found</p>
        <Link to="/">Back to home</Link>
      </div>
    );
  },
});
