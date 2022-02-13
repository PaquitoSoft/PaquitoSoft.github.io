import React from 'react';

import GitHubIcon from '../icons/github-icon';
import TwitterIcon from '../icons/twitter-icon';
import LinkedInIcon from '../icons/linkedin-icon';

import avatarImg from '../../images/gravatar.jpg';
import * as styles from './about-me.module.css';

function AboutMe() {
	return (
		<article className={styles.aboutMeContainer}>
			<header className={styles.title}>About me</header>
			<div>
				<img 
					className={styles.avatar} 
					src={avatarImg} 
					alt="Paquitosoft avatar" 
					height={150} 
					width={150} 
				/>
			</div>
			<footer className={styles.footer}>
				<ul>
					<li className={styles.profileLink}>
						<a href="https://github.com/PaquitoSoft" target="_blank" rel="noreferrer">
							<GitHubIcon />
						</a>
					</li>
					<li className={styles.profileLink}>
						<a href="https://twitter.com/telemaco82" target="_blank" rel="noreferrer">
							<TwitterIcon />
						</a>
					</li>
					<li className={styles.profileLink}>
						<a href="hhtps://www.linkedin.com/in/carlos-martínez-cortizas-81763b2b" target="_blank" rel="noreferrer">
							<LinkedInIcon />
						</a>
					</li>
				</ul>
			</footer>
		</article>
	);
}

export default AboutMe;
