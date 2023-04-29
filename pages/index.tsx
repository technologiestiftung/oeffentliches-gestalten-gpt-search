import Head from "next/head";
import styles from "../styles/Home.module.css";
import { SearchDialog } from "../components/SearchDialog";

export default function Home() {
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
					<SearchDialog />
				</div>
			</main>
		</>
	);
}
