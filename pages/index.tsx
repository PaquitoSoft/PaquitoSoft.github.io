import type { NextPage } from 'next'
import Head from 'next/head'

import Post from '../types/post';
import { getAllPosts } from '../lib/posts-repository';

import PostSummary from '../components/post-summary/post-summary';

import styles from '../styles/Home.module.css'

type Props = {
	posts: Post[];
}

const Home: NextPage<Props> = ({ posts }) => {
	return (
		<div>
			<Head>
				<title>PaquitoSoft&apos;s corner</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
		
			<div className={styles.postsList}>
			{posts.map(post => (
				<PostSummary key={post.slug} post={post} />
			))}
			</div>
			
		</div>
	);
}

export async function getStaticProps() {
	const posts = await getAllPosts();
	
	return {
		props: { posts }
	};
}

export default Home
