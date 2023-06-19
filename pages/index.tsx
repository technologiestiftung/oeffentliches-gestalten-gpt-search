import Head from "next/head";
import { SearchDialog } from "../components/SearchDialog";
import { GetServerSideProps, InferGetServerSidePropsType } from "next/types";
import React from "react";
import { MobileSidebar } from "../components/sidebars/MobileSidebar";
import { EnvError } from "../lib/errors";
import { useChatbotStore } from "../store";
import { DesktopSidebar } from "../components/sidebars/DesktopSidebar";
import Script from "next/script";
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const token = context.res.req.headers["x-csrf-token"] as string;
	return { props: { csrf: token } };
};

const Home: React.FC<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrf }) => {
	const setCsrfToken = useChatbotStore((state) => state.setCsrfToken);
	setCsrfToken(csrf);

	if (NEXT_PUBLIC_SUPABASE_ANON_KEY === undefined)
		throw new EnvError("NEXT_PUBLIC_SUPABASE_ANON_KEY");

	return (
		<>
			<Head>
				<title>Handbuch GPT Suche</title>
				<meta name="description" content="Chatbot Öffentliches Gestalten" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<div
					className="flex w-screen h-screen"
					style={{
						maxHeight: "-webkit-fill-available",
						maxWidth: "-webkit-fill-available",
					}}
				>
					<MobileSidebar />
					<DesktopSidebar />
					<SearchDialog />
				</div>
			</main>

			<Script src="/matomo.js" />
		</>
	);
};

export default Home;
