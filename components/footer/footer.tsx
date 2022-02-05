import styles from './footer.module.css';

function Footer() {
	return (
		<footer className={styles.footer}>
			Developed using 
			<a href="https://nextjs.org" target="_blank" rel="noreferrer">Next.js</a> and 
			<a href="https://picocss.com/" target="_blank" rel="noreferrer">PicoCSS</a>
		</footer>
	);
}
export default Footer;
