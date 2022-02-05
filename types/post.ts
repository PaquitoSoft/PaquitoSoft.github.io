type Post = {
	slug: string;
	title: string;
	creationDate: Date;
	status: 'published' | 'draft';
	content: string;
}

export default Post;
