export const WALINE_SERVER_URL = 'https://waline.ficor.cc';
export const WALINE_SITE_URL = 'https://suiyanpianyu.pages.dev';

export const walineConfig = {
    serverURL: WALINE_SERVER_URL,
    lang: 'zh-CN',
    pageview: false,
    dark: 'html.dark',
    commentSorting: 'latest',
} as const;
