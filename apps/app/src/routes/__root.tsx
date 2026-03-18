import { MantineProvider } from "@repo/mantine/core";
import { ModalsProvider } from "@repo/mantine/modals";
import { Notifications } from "@repo/mantine/notifications";
import mantineTheme from "@repo/mantine/theme";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <MantineProvider theme={mantineTheme} defaultColorScheme="auto">
      <Notifications />
      <ModalsProvider>
        <Outlet />
      </ModalsProvider>
    </MantineProvider>
    <TanStackDevtools
      config={{ hideUntilHover: true }}
      plugins={[formDevtoolsPlugin()]}
    />
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
