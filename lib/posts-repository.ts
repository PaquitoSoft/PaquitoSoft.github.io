import { readFile, readdir } from 'fs/promises';
import { join, resolve } from 'path';
import { loadFront } from 'yaml-front-matter';
import MarkdownIt from 'markdown-it';
import Post from '../types/post';

const POSTS_DIRECTORY_PATH = './resources';
const md = new MarkdownIt();

export async function getAllPosts(): Promise<Post[]> {
	// const postsDirectoryPath = join(__dirname, POSTS_DIRECTORY_PATH);
	const postsDirectoryPath = resolve(POSTS_DIRECTORY_PATH);
	const files = await readdir(postsDirectoryPath);
	const mdFiles = files.filter(file => file.endsWith('.md'));
	const md = new MarkdownIt();
	const postsMetadata = await Promise.all(mdFiles.map(async file => {
		// const filePath = `${POSTS_DIRECTORY_PATH}/${file}`;
		// const fileContent = await readFile(filePath, 'utf8');
		// const meta = loadFront(fileContent);
		// return {
		// 	slug: file.replace('.md', ''),
		// 	title: meta.title,
		// 	creationDate: new Date(meta.creationDate),
		// 	status: meta.status,
		// 	content: md.render(meta.__content),
		// };
		const post = await getPost(file.replace('.md', ''));
		return post;
	}));
	
	return postsMetadata;
}

export async function getPost(slug: string): Promise<Post> {
	// const postFilePath = `${POSTS_DIRECTORY_PATH}/${slug}.md`;
	const postFilePath = resolve(join(POSTS_DIRECTORY_PATH, `${slug}.md`));
	const fileContent = await readFile(postFilePath, 'utf8');
	const meta = loadFront(fileContent);
	return {
		slug,
		title: meta.title,
		creationDate: new Date(meta.creationDate),
		status: meta.status,
		content: md.render(meta.__content),
	};
}
