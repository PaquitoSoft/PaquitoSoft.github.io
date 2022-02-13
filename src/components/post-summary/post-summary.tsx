import React from 'react';
import { Link } from 'gatsby';
import Post from '../../types/post';

import Card from '../card/card';
import TitleLink from '../title-link/title-link';

import styles from './post-summary.module.css';

type Props = {
	post: Post;
};

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
					<Link to={`/post/${post.slug}`}>
						Read more...
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
