import Head from "next/head";
import styles from "../styles/Home.module.css";
import { SearchDialog } from "../components/SearchDialog";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import React from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
	console.log("in getServerSideProps", context.res.getHeaders());
	const csrfToken = context.res.getHeader("X-CSRF-Token") ?? "missing";
	if (csrfToken === "missing") {
		throw new Error("Invalid CSRF token");
	}

	return { props: { csrfToken } };
};

const Home: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken }) => {
	const [loading, setLoading] = React.useState(false);
	const [state, setState] = React.useState<any>({
		path: "/api/ping",
		latency: null,
		status: null,
		headers: {
			"X-upstash-latency": "",
			"X-RateLimit-Limit": "",
			"X-RateLimit-Remaining": "",
			"X-RateLimit-Reset": "",
		},
		data: null,
	});

	return (
		<>
			<Head>
				<title>Handbuch OpenAI Suche</title>
				<meta
					name="description"
					content="Handbuch Öffentliches Gestalten OpenAI Suche"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<h1 className={styles.title}>Handbuch GPT Search</h1>
				<div className={styles.center}>
					<SearchDialog csrfToken={csrfToken} />
				</div>
				<button
					type="button"
					className="px-4 py-2 font-bold text-black bg-blue-500 rounded hover:bg-blue-700"
					onClick={(e) => {
						console.log("clicked");
						const handleRequest = async () => {
							console.log("requesting");
							const start = Date.now();
							setLoading(true);

							try {
								const res = await fetch("/api/ping");
								setState({
									path: "/api/ping",
									latency: `~${Math.round(Date.now() - start)}ms`,
									status: `${res.status}`,
									headers: {
										"X-upstash-latency": `${res.headers.get(
											"X-upstash-latency"
										)}ms`,
										"X-RateLimit-Limit": res.headers.get("X-RateLimit-Limit"),
										"X-RateLimit-Remaining": res.headers.get(
											"x-RateLimit-Remaining"
										),
										"X-RateLimit-Reset": res.headers.get("x-RateLimit-Reset"),
									},
									data: res.headers
										.get("Content-Type")
										?.includes("application/json")
										? await res.json()
										: null,
								});
							} finally {
								setLoading(false);
							}
						};
						handleRequest().catch(console.error);
					}}
				>
					ping rate limited
				</button>
				<pre
					className={`text-black border border-accents-2 rounded-md bg-white overflow-x-auto p-6 transition-all ${
						loading ? ` opacity-50` : ""
					}`}
				>
					{JSON.stringify(state, null, 2)}
				</pre>
			</main>
		</>
	);
};

export default Home;
