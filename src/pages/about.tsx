import React from 'react';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import getSortedPostsData, { getPostById } from "../utils/parseMd";
import { sanitizeHtml } from "../utils/sanitizeHtml";
import Layout from "../components/Layout";
import Head from "next/head";
import Breadcrumb from '@/components/Breadcrumb';
import readingTime from 'reading-time';
import type { Post } from '../types';
import CustomLink from '@/components/Link';
import config from '@/config';

export async function getStaticProps() {
  const aboutPost = getPostById('about');

  if (!aboutPost) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post: aboutPost,
    },
    revalidate: false,
  };
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    // 简单处理ISO格式的日期
    if (dateString.includes('T')) {
      return dateString.split('T')[0].replace(/-/g, '/');
    }
    // 处理普通日期格式
    if (dateString.includes('-')) {
      return dateString.substring(0, 10).replace(/-/g, '/');
    }
    return dateString;
  } catch (error) {
    return dateString;
  }
};

export default function About({ post }: { post: Post }) {
  const stats = readingTime(post.content || '');
  const sanitizedContent = sanitizeHtml(post.content || '');

  return (
    <Layout>
      <Head>
        <title>{`${post.title} | ${config.BLOG_NAME}`}</title>
        <meta name="description" content={post.description} />
        <meta name="author" content={post.author} />
        <link rel="canonical" href="https://vii.ink/about" />
        <meta property="og:title" content={`${post.title} | ${config.BLOG_NAME}`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://vii.ink/about" />
        <meta property="article:published_time" content={post.time} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${post.title} | ${config.BLOG_NAME}`} />
        <meta name="twitter:description" content={post.description} />
      </Head>

      <article className="w-full">
        <Breadcrumb
          type="about"
          title="关于"
        />

        <h1 className="text-2xl font-semibold mb-4 text-text-primary">
          关于
        </h1>

        <div className="prose prose-base prose-slate">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ href, children }) => (
                <CustomLink className="break-words" href={href || ''}>
                  {children}
                </CustomLink>
              ),
              table: ({ children }: any) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full max-w-full">{children}</table>
                </div>
              ),
              th: ({ children }: any) => (
                <th className="px-4 py-2 border bg-gray-50 font-semibold text-left whitespace-nowrap">{children}</th>
              ),
              td: ({ children }: any) => (
                <td className="px-4 py-2 border max-w-xs break-all">{children}</td>
              ),
              code: ({ children, className }: any) => {
                const isInline = !className;
                if (isInline) {
                  return <code className="px-1.5 py-0.5 rounded text-sm break-all">{children}</code>;
                }
                return <code className={className}>{children}</code>;
              },
              pre: ({ children }: any) => (
                <pre className="overflow-x-auto">{children}</pre>
              ),
            }}
          >
            {sanitizedContent}
          </ReactMarkdown>
        </div>
      </article>
    </Layout>
  );
}
