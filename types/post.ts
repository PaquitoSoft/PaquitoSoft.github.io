type Post = {
	slug: string;
	title: string;
	creationDate: Date;
	keywords: string;
	status: 'published' | 'draft';
	excerpt: string;
	content: string;
}

export default Post;
