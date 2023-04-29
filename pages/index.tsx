import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { SearchDialog } from "@/components/SearchDialog";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import React from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const csrfToken = context.res.getHeader("x-csrf-token") ?? "missing";
	if (csrfToken === "missing") {
		throw new Error("Invalid CSRF token");
	}

	return { props: { csrfToken } };
};

const Home: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken }) => {
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
				<div className={styles.center}>
					<SearchDialog csrfToken={csrfToken} />
				</div>
			</main>
		</>
	);
};

export default Home;
