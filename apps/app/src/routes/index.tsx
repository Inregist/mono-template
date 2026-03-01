import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	loader: () => {
		return Math.round(Math.random() * 100);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const data = Route.useLoaderData();
	return <div>Hello "/"! {data}</div>;
}
