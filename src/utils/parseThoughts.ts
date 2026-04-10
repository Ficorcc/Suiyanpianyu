import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '../types';

const thoughtsDirectory = path.join(process.cwd(), 'md', 'thoughts');

export default function getSortedThoughtsData(): Post[] {
    if (!fs.existsSync(thoughtsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(thoughtsDirectory);
    const allThoughtsData = fileNames.map(fileName => {
        const id = fileName.replace(/\.md$/, '');
        const filePath = path.join(thoughtsDirectory, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const matterResult = matter(fileContent);

        // 片语没有标题，使用内容摘要
        const content = matterResult.content.trim();
        const preview = content.length > 100 ? content.substring(0, 100) + '...' : content;

        // 确保时间字段是字符串类型
        const thoughtData: Post = {
            id,
            ...matterResult.data,
            content,
            preview,
            type: 'thought',
        };

        // 处理时间字段
        if (thoughtData.time && typeof thoughtData.time !== 'string') {
            thoughtData.time = String(thoughtData.time);
        } else if (thoughtData.time === undefined) {
            // 如果没有time字段，使用timestamp字段
            if (thoughtData.timestamp) {
                thoughtData.time = typeof thoughtData.timestamp === 'string' ? thoughtData.timestamp : String(thoughtData.timestamp);
                // 删除timestamp字段
                delete thoughtData.timestamp;
            } else {
                thoughtData.time = '';
            }
        } else if (thoughtData.timestamp) {
            // 如果同时有time和timestamp字段，删除timestamp字段
            delete thoughtData.timestamp;
        }

        return thoughtData;
    });

    return allThoughtsData.sort((a: Post, b: Post) => {
        if (!a.time || !b.time) {
            return 0;
        }
        return new Date(b.time).getTime() - new Date(a.time).getTime();
    });
}

export function getThoughtById(id: string): Post | null {
    if (!fs.existsSync(thoughtsDirectory)) {
        return null;
    }

    const filePath = path.join(thoughtsDirectory, `${id}.md`);
    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContent);

    // 确保时间字段是字符串类型
    const thoughtData: Post = {
        id,
        ...matterResult.data,
        content: matterResult.content,
        type: 'thought',
    };

    // 处理时间字段
    if (thoughtData.time && typeof thoughtData.time !== 'string') {
        thoughtData.time = String(thoughtData.time);
    } else if (thoughtData.time === undefined) {
        // 如果没有time字段，使用timestamp字段
        if (thoughtData.timestamp) {
            thoughtData.time = typeof thoughtData.timestamp === 'string' ? thoughtData.timestamp : String(thoughtData.timestamp);
            // 删除timestamp字段
            delete thoughtData.timestamp;
        } else {
            thoughtData.time = '';
        }
    } else if (thoughtData.timestamp) {
        // 如果同时有time和timestamp字段，删除timestamp字段
        delete thoughtData.timestamp;
    }

    return thoughtData;
}