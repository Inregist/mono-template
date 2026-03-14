import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "../lib/auth";
import { orpcQuery } from "../lib/orpc";

export const Route = createFileRoute("/")({
  loader: () => {
    return Math.round(Math.random() * 100);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const query = useQuery(
    orpcQuery.example.hello.queryOptions({ input: { name: "saas" } }),
  );

  const { useSession } = authClient;
  const { data: session } = useSession();

  const handleLineLogin = async () => {
    await authClient.signIn.social({
      provider: "line",
      callbackURL: `${window.location.origin}`,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <p>{query.data?.message}</p>
      <button type="button" onClick={handleLineLogin}>
        Line Login
      </button>
      <button type="button" onClick={() => authClient.signOut()}>
        Logout
      </button>

      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
