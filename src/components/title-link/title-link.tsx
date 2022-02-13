import React from 'react';

import { Link } from 'gatsby';

import * as styles from './title-link.module.css';

type Props = {
	href: string;
	text: string;
	as?: string;
	className?: string;
};

function TitleLink({ href, text, as, className }: Props) {
	const Name = as ?? 'h3';
	return (
		<Link to={href} className={`${styles.titleLink} ${className ? className : ''}`}>
			{/* @ts-ignore */}
			<Name>{text}</Name>
		</Link>
	);
}

export default TitleLink;
