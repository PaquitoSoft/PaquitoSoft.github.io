import React from 'react';

import * as styles from './card.module.css';

function CardHeader({ children }: { children: React.ReactNode }) {
	return (
		<header className={styles.title}>
			{children}
		</header>
	);
};

function CardBody({ children }: { children: React.ReactNode }) {
	return (
		<div>
			{children}
		</div>
	);
}

function CardFooter({ children }: { children: React.ReactNode }) {
	return (
		<footer className={styles.footer}>{children}</footer>
	);
}

function Card({ children }: { children: React.ReactNode }) {
	return (
		<article className={styles.card}>
			{children}
		</article>
	);
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
