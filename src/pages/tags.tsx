import getSortedPostsData, { getAllPostsData } from '../utils/parseMd';
import Head from 'next/head';
import Layout from '../components/Layout';
import Breadcrumb from '../components/Breadcrumb';
import CustomLink from '../components/Link';
import { Post } from '../types';
import config from '../config';

interface TagData {
    tag: string;
    originalTag: string;
    data: Post[];
}

function createTagsData(blogData: Post[]): TagData[] {
    const tagDict: { [key: string]: TagData } = {};
    blogData.forEach(item => {
        const tmpTags = item.tag ? (typeof item.tag === 'string' ? item.tag.split(",") : item.tag) : [];
        tmpTags.forEach((tag: any) => {
            const originalTag = tag.toString().trim();
            const optimizedTag = originalTag.toLowerCase().replace(/\s+/g, '');
            if (!tagDict[optimizedTag]) {
                tagDict[optimizedTag] = { tag: optimizedTag, originalTag, data: [] };
            }
            tagDict[optimizedTag].data.push({ id: item.id });
        });
    });
    return Object.values(tagDict);
}

export async function getStaticProps() {
    const allPostsData = getAllPostsData();
    const tagsData = createTagsData(allPostsData);
    return {
        props: {
            tagsData,
        },
        revalidate: false,
    };
}

const Tags = ({ tagsData }: { tagsData: TagData[] }) => {
    return (
        <Layout>
            <Head>
                <title>{`标签 | 柒色墨笺`}</title>
                <meta name="description" content={`柒色墨笺的文章分类标签，按主题分类的技术文章和随笔`} />
                <meta name="keywords" content="文章标签,博客分类,技术标签,主题分类" />
                <link rel="canonical" href={`https://vii.ink/tags`} />
                <meta property="og:title" content={`标签 | 柒色墨笺`} />
                <meta property="og:description" content={`柒色墨笺的文章分类标签，按主题分类的技术文章和随笔`} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://vii.ink/tags`} />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={`标签 | 柒色墨笺`} />
                <meta name="twitter:description" content={`柒色墨笺的文章分类标签，按主题分类的技术文章和随笔`} />
            </Head>
            <Breadcrumb type="tags" />
            <div className="w-full">
                <h1 className="text-2xl font-semibold mb-4 text-text-primary">
                    标签
                    </h1>
                <p className="mb-8 text-sm text-text-secondary">
                    共有标签：<span className="text-text-primary">{tagsData.length}</span> 个
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {tagsData.map((tagObj) => (
                        <CustomLink
                            key={tagObj.tag}
                            href={`/tags/${tagObj.tag}`}
                            className=""
                        >
                            <span className="truncate flex-1 min-w-0">
                               # {tagObj.originalTag} ({tagObj.data.length})
                            </span>
                        </CustomLink>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Tags;