/* eslint-disable @next/next/no-img-element */
import styles from './about-me.module.css';

import GitHubIcon from '../icons/github-icon';
import TwitterIcon from '../icons/twitter-icon';
import LinkedInIcon from '../icons/linkedin-icon';

function AboutMe() {
	return (
		<article className={styles.aboutMeContainer}>
			<header className={styles.title}>About me</header>
			<div>
				<img 
					className={styles.avatar} 
					src="/images/gravatar.jpg" 
					alt="Paquitosoft avatar" 
					height={150} 
					width={150} 
				/>
			</div>
			<footer className={styles.footer}>
				<ul>
					<li className={styles.profileLink}>
						<a href="/" target="_blank" rel="noreferrer">
							<GitHubIcon />
						</a>
					</li>
					<li className={styles.profileLink}>
						<a href="/" target="_blank" rel="noreferrer">
							<TwitterIcon />
						</a>
					</li>
					<li className={styles.profileLink}>
						<a href="/" target="_blank" rel="noreferrer">
							<LinkedInIcon />
						</a>
					</li>
				</ul>
			</footer>
		</article>
	);
}

export default AboutMe;
