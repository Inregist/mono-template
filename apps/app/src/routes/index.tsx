import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpcQuery } from "../lib/orpc";

export const Route = createFileRoute("/")({
	loader: () => {
		return Math.round(Math.random() * 100);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const data = Route.useLoaderData();
	const query = useQuery(orpcQuery.pingPong.ping.queryOptions());
	console.log("query", query);

	return <div>Hello "/"! {data}</div>;
}
