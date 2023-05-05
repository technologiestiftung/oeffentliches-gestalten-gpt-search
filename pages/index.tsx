/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { SearchDialog } from "../components/SearchDialog";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import React from "react";
import { useCookies, Cookies } from "react-cookie";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const cookies = new Cookies(context.req.headers.cookie);
	const csrfToken = cookies.get("csrf") ?? "";
	return { props: { csrf: csrfToken } };
};

const Home: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrf }) => {
	const [cookie] = useCookies(["csrf"]);
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

	// calling the getcookie function to retrieve the csrf key's value
	// const csrf = getCookie("csrf");

	// onsubmit we are validating the csrf cookie and the csrf hidden input match
	const validate = async (e: any) => {
		e.preventDefault();

		console.log(cookie.csrf);
		console.log(csrf);
		console.log(e.target.elements);

		if (cookie.csrf === csrf) {
			// double submit passed
			console.log("csrf matches");
		} else {
			// double submit failed
			console.log("csrf does not match");
		}

		const response = await fetch("/api/ping", {
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			console.log(await response.text());
		} else {
			console.log(await response.json());
		}
	};

	return (
		<>
			<Head>
				<title>Handbuch GPT Suche</title>
				<meta
					name="description"
					content="Handbuch Öffentliches Gestalten OpenAI Suche"
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{/* <header className="z-10 border-b border-blue-200 h-7 bg-blue-50"></header> */}
			<main
				className={
					"flex flex-col justify-center items-center min-h-screen m-3 sm:m-0"
				}
			>
				<h1 className={"text-5xl pb-6 sm:text-5xl !text-left"}>
					Handbuch GPT Suche
				</h1>
				<div>
					<SearchDialog csrfToken={cookie.csrf} />
				</div>
			</main>
			{/* <footer className="z-10 border-t border-blue-200 h-7 bg-blue-50">
				<div className="grid grid-cols-12 px-6 py-12 gap-y-14">
					<div className="col-span-12 lg:col-start-2 md:col-span-6 lg:col-span-4">
						<p className="mb-4 text-sm">
							Entstanden durch die Zusammenarbeit von
						</p>
						<div className="flex flex-wrap gap-x-3 gap-y-6">
							<a href="https://citylab-berlin.org">
								<img src="http://placekitten.com/200/100" alt="kitten" />
							</a>
							<a href="https://www.politicsfortomorrow.eu/">
								<img src="http://placekitten.com/200/100" alt="kitten" />
							</a>
						</div>
					</div>
				</div>
			</footer> */}
		</>
	);
};

export default Home;
