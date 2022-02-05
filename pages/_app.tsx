import type { AppProps } from 'next/app';

import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import AboutMe from '../components/about-me/about-me';

import '../styles/pico.min.css';
import '../styles/app.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Header />
			<main className="container">
				<div className="grid">
					<section>
						<Component {...pageProps} />
					</section>
					<aside>
						<AboutMe />
					</aside>
				</div>
			</main>
			<Footer />
		</>
	);
}

export default MyApp
