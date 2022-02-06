import Link from "next/link";

import styles from './title-link.module.css';

type Props = {
	href: string;
	text: string;
	as?: string;
	className?: string;
};

function TitleLink({ href, text, as, className }: Props) {
	const Name = as ?? 'h3';
	return (
		<Link href={href}>
			<a className={`${styles.titleLink} ${className ? className : ''}`}>
				{/* @ts-ignore */}
				<Name>{text}</Name>
			</a>
		</Link>
	);
}

export default TitleLink;
