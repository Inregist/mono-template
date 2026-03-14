import { createORPCClient, onError } from "@orpc/client";
import type { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { router } from "@repo/api";

const link = new OpenAPILink(router, {
  url: `${import.meta.env.VITE_API_BASE_URL}/api/rpc`,
  headers: () => ({}),
  fetch: (request, init) => {
    return globalThis.fetch(request, {
      ...init,
      credentials: "include", // Include cookies for cross-origin requests
    });
  },
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const orpcClient: JsonifiedClient<ContractRouterClient<typeof router>> =
  createORPCClient(link);

export const orpcQuery = createTanstackQueryUtils(orpcClient);
