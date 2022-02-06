import Head from "next/head";
import Card from "../../components/card/card";
import { getAllPosts, getPost } from "../../lib/posts-repository";
import Post from "../../types/post";

type Props = {
	post: Post;
}

function PostDetail({ post }: Props) {
	return (
		<div>
			<Head>
				<title>{post.title}</title>
				<meta name="date" content={post.creationDate.toISOString()} />
				<meta name="keywords" content={post.keywords} />
			</Head>
			<Card>
				<Card.Header>
					<h3>{post.title}</h3>
				</Card.Header>
				<Card.Body>
					<span dangerouslySetInnerHTML={{ __html: post.content }}></span>
				</Card.Body>
				<Card.Footer>
					<div>Published: {post.creationDate.toLocaleDateString()}</div>
				</Card.Footer>
			</Card>
		</div>
	);
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	return {
		paths: posts.map(post => ({ params: { slug: post.slug } })),
		fallback: false
	};
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
	const post = await getPost(params.slug);

	return {
		props: { post }
	};
}

export default PostDetail;
