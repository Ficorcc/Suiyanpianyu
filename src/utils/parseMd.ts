import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '../types';

const postsDirectory = path.join(process.cwd(), 'md');

// 解析单个Markdown文件的函数
function parsePostFile(filePath: string, fileName: string): Post | null {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const matterResult = matter(fileContent);
        
        // 优先使用 frontmatter 中的 id 字段，否则使用文件名
        const id = matterResult.data.id || fileName.replace(/\.md$/, '');

        // 截断 description 字段（SEO最佳实践：150字符）
        let description = matterResult.data.description;
        if (description && typeof description === 'string' && description.length > 150) {
            description = description.substring(0, 150) + '...';
        }
        // 确保 description 不是 undefined
        if (description === undefined) {
            description = null;
        }

        // 获取 ai_label 属性，默认为 0
        const aiLabel = matterResult.data.ai_label !== undefined ? parseInt(matterResult.data.ai_label) : 0;

        // 确保所有日期字段都是字符串
        // 处理标签字段，确保它是一个字符串
        let tagValue = matterResult.data.tag;
        if (!tagValue && matterResult.data.tags) {
            if (Array.isArray(matterResult.data.tags)) {
                tagValue = matterResult.data.tags.join(',');
            } else {
                tagValue = matterResult.data.tags;
            }
        }
        // 确保 tagValue 不是 undefined
        if (tagValue === undefined) {
            tagValue = '';
        }
        
        const postData = {
            id, // 添加 id 属性
            ...matterResult.data,
            tag: tagValue, // 确保标签字段存在且是字符串
            description,
            content: matterResult.content,
            ai_label: aiLabel,
        } as Post;

        // 确保时间字段是字符串类型
        if (postData.time && typeof postData.time !== 'string') {
            postData.time = String(postData.time);
        } else if (postData.time === undefined) {
            // 如果没有time字段，使用timestamp字段
            if (postData.timestamp && typeof postData.timestamp === 'string') {
                postData.time = postData.timestamp;
            } else {
                postData.time = '';
            }
        }
        if (postData.date && typeof postData.date !== 'string') {
            postData.date = String(postData.date);
        } else if (postData.date === undefined) {
            postData.date = '';
        }
        if (postData.timestamp && typeof postData.timestamp !== 'string') {
            postData.timestamp = String(postData.timestamp);
        } else if (postData.timestamp === undefined) {
            postData.timestamp = '';
        }
        // 确保author字段是字符串类型
        if (postData.author && typeof postData.author !== 'string') {
            postData.author = String(postData.author);
        } else if (postData.author === undefined) {
            postData.author = '';
        }

        return postData;
    } catch (error) {
        console.error('Error processing file:', filePath, error);
        return null;
    }
}

export default function getSortedPostsData(): Post[] {
    console.log('Posts directory:', postsDirectory);
    console.log('Posts directory exists:', fs.existsSync(postsDirectory));
    
    const fileNames = fs.readdirSync(postsDirectory);
    console.log('Files in md directory:', fileNames);
    
    const allPostsData = fileNames.map(fileName => {
        // 排除 thoughts 目录和 about.md 文件
        if (fileName === 'thoughts' || fileName === 'about.md') {
            return null;
        }

        const filePath = path.join(postsDirectory, fileName);
        console.log('Processing file:', filePath);
        
        return parsePostFile(filePath, fileName);
    }).filter((post): post is Post => post !== null);
    return allPostsData.sort((a: Post, b: Post) => {
        // 确保time字段存在且是有效的日期格式
        if (!a.time || !b.time) {
            return 0; // 或者根据你的需求处理错误
        }
        return new Date(b.time).getTime() - new Date(a.time).getTime(); // 颠倒排序
    });
}

// 获取单个文章，包括about.md
export function getPostById(id: string): Post | null {
    const filePath = path.join(postsDirectory, `${id}.md`);
    
    if (!fs.existsSync(filePath)) {
        return null;
    }
    
    return parsePostFile(filePath, `${id}.md`);
}

// 递归扫描目录中的所有Markdown文件
function scanDirectory(directory: string): Post[] {
    let posts: Post[] = [];
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
            // 递归扫描子目录
            posts = posts.concat(scanDirectory(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            // 处理Markdown文件
            console.log('Processing file:', fullPath);
            const post = parsePostFile(fullPath, entry.name);
            if (post) {
                posts.push(post);
            }
        }
    }
    
    return posts;
}

// 获取所有文章，包括about.md和thoughts目录中的文章（用于标签扫描）
export function getAllPostsData(): Post[] {
    console.log('Posts directory:', postsDirectory);
    console.log('Posts directory exists:', fs.existsSync(postsDirectory));
    
    // 递归扫描所有目录
    const allPostsData = scanDirectory(postsDirectory);
    
    return allPostsData.sort((a: Post, b: Post) => {
        // 确保time字段存在且是有效的日期格式
        if (!a.time || !b.time) {
            return 0; // 或者根据你的需求处理错误
        }
        return new Date(b.time).getTime() - new Date(a.time).getTime(); // 颠倒排序
    });
}