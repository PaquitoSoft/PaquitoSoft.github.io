import React from 'react';

import Header from '../header/header';
import AboutMe from '../about-me/about-me';
import Footer from '../footer/footer';

import '../../styles/pico.min.css';
import '../../styles/app.css';

function Layout({ children }) {
	return (
		<>
			<Header />
			<main className="container main-content">
				<div className="grid">
					<section>
						{children}
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

export default Layout;
