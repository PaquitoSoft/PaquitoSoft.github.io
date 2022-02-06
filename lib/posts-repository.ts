import { readFile, readdir } from 'fs/promises';
import { join, resolve } from 'path';
import { loadFront } from 'yaml-front-matter';
import MarkdownIt from 'markdown-it';
import Post from '../types/post';

const POSTS_DIRECTORY_PATH = './resources';
const POST_EXCERPT_MARK = '<!-- more -->';
const md = new MarkdownIt({ html: false });

export async function getAllPosts(): Promise<Post[]> {
	const postsDirectoryPath = resolve(POSTS_DIRECTORY_PATH);
	const files = await readdir(postsDirectoryPath);
	const mdFiles = files.filter(file => file.endsWith('.md'));
	const posts = await Promise.all(mdFiles.map(async file => {
		const post = await getPost(file.replace('.md', ''));
		return post;
	}));
	
	posts.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime());
	
	return posts;
}

export async function getPost(slug: string): Promise<Post> {
	const postFilePath = resolve(join(POSTS_DIRECTORY_PATH, `${slug}.md`));
	const fileContent = await readFile(postFilePath, 'utf8');
	const meta = loadFront(fileContent);
	const [summary, rest] = meta.__content.split(POST_EXCERPT_MARK);

	return {
		slug,
		title: meta.title,
		creationDate: new Date(meta.creationDate),
		keywords: meta.keywords,
		status: meta.status,
		excerpt: md.render(summary),
		content: md.render([summary, rest].join(''))
	};
}
