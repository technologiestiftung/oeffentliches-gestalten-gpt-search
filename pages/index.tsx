import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { SearchDialog } from "@/components/SearchDialog";

const inter = Inter({ subsets: ["latin"] });

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
				<div className={styles.center}>
					<SearchDialog />
				</div>
			</main>
		</>
	);
}
