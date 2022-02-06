import Link from 'next/link';

import TitleLink from '../title-link/title-link';

import styles from './header.module.css';

function Header() {
	return (
		<header className={styles.header}>
			<TitleLink
				as="h2"
				href="/"
				className={styles.title}
				text="Paquitosoft's corner"
			/>
		</header>
	);
}

export default Header;
