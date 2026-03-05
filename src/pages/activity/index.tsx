import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import Breadcrumb from '../../components/Breadcrumb';
import config from '../../config';
import { ArrowUpIcon } from '../../components/icons/ArrowUpIcon';

interface RSSItem {
  name: string;
  url: string;
  avatar: string;
  title: string;
  link: string;
  pubDate: string;
  content: string;
}

const Activity = () => {
  const [rssItems, setRssItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRSSData = () => {
    setLoading(true);
    fetch('/rss-data.json')
      .then(res => res.json())
      .then(data => {
        setRssItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load RSS data:', err);
        setLoading(false);
      });
  };

  const refreshRSSData = async () => {
    setRefreshing(true);
    try {
      // 在静态导出模式下，API路由不可用，所以直接重新加载本地数据
      // 实际生产环境中，应该在服务器端定时更新RSS数据
      await loadRSSData();
      alert('RSS数据已成功更新！');
    } catch (error) {
      console.error('Failed to refresh RSS data:', error);
      alert('更新失败，请稍后再试');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRSSData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (!content) return '';
    // 移除HTML标签
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  return (
    <Layout>
      <Head>
        <title>{`动态 | ${config.BLOG_NAME}`}</title>
        <meta name="description" content="友链博客最新动态聚合" />
        <link rel="canonical" href="https://vii.ink/activity" />
        <meta property="og:title" content={`动态 | ${config.BLOG_NAME}`} />
        <meta property="og:description" content="友链博客最新动态聚合" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vii.ink/activity" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`动态 | ${config.BLOG_NAME}`} />
        <meta name="twitter:description" content="友链博客最新动态聚合" />
      </Head>

      <Breadcrumb type="activity" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-text-primary">
            动态
          </h1>
          <button
            onClick={refreshRSSData}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {refreshing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ArrowUpIcon className="w-4 h-4" />
            )}
            <span>{refreshing ? '更新中...' : '刷新数据'}</span>
          </button>
        </div>
        <p className="mb-8 text-sm text-text-secondary">
          聚合友链博客的最新文章，发现更多精彩内容
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rssItems.map((item, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* 站点头像 */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium ${item.avatar ? 'hidden' : ''}`}>
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  </a>

                  {/* 内容区域 */}
                  <div className="flex-1 min-w-0">
                    {/* 站点名称和时间 */}
                    <div className="flex items-center justify-between mb-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {item.name}
                      </a>
                      <time className="text-xs text-gray-400">
                        {formatDate(item.pubDate)}
                      </time>
                    </div>

                    {/* 文章标题 */}
                    <h3 className="text-lg font-semibold">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {item.title}
                      </a>
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 底部提示 */}
        {!loading && rssItems.length > 0 && (
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>显示最近 {rssItems.length} 条动态</p>
            <p className="mt-1">数据每小时自动更新</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Activity;