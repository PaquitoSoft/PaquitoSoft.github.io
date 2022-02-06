import Link from 'next/link';
import Post from '../../types/post';

import Card from '../card/card';
import TitleLink from '../title-link/title-link';

import styles from './post-summary.module.css';

type Props = {
	post: Post;
};

function PostSummary_back({ post }: Props) {
	return (
		<article className={styles.postSummary}>
			<header className={styles.title}>
				<h3>{post.title}</h3>
			</header>
			<div className={styles.postSummaryContent}>
				<span dangerouslySetInnerHTML={{ __html: post.excerpt }}></span>
				{
					post.excerpt.length < post.content.length &&
					<Link href={`/post/${post.slug}`}>
						<a>Read more...</a>
					</Link>
				}
			</div>
			<footer>
				<div>Published: {post.creationDate.toLocaleDateString()}</div>
			</footer>
		</article>
  );
}

function PostSummary({ post }: Props) {
	return (
		<Card>
			<Card.Header>
				<TitleLink
					href={`/post/${post.slug}`}
					text={post.title}
				></TitleLink>
			</Card.Header>
			<Card.Body>
				<span dangerouslySetInnerHTML={{ __html: post.excerpt }}></span>
				{
					post.excerpt.length < post.content.length &&
					<Link href={`/post/${post.slug}`}>
						<a>Read more...</a>
					</Link>
				}
			</Card.Body>
			<Card.Footer>
				<div>Published: {post.creationDate.toLocaleDateString()}</div>
			</Card.Footer>
		</Card>
  );
}

export default PostSummary;
