import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_AUTH_BASE_URL,
	basePath: "/api/auth",
	sessionOptions: {
		refetchInterval: 60 * 1000, // Refetch session every 60 seconds
		refetchOnWindowFocus: true, // Refetch session when the window regains focus
	},
});
