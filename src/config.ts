import { Config } from './types';
import linksConfig from './data/links';

/**
 * 项目配置文件
 * 包含了项目的各种配置信息，如开发模式、博客名称、作者、描述等
 */
const config: Config = {
    // 博客名称
    "BLOG_NAME": "柒色墨笺",
    // 博客英文名称
    "BLOG_NAME_EN": "vii·ink·life",
    // 博客作者
    "BLOG_AUTHOR": "Ficor",
    // 博客英文描述
    "BLOG_DESCRIPTION_EN": "You see see you , This one day day di.",
    // 关于我简介
    "ABOUT_ME": "一纸墨笺，载七色人间",
    "POSTS_PER_PAGE": 15,
    // 元描述，用于搜索引擎优化
    "META_DESCRIPTION": "柒色入墨，落笔成诗",
    // 元关键词，用于搜索引擎优化
    "META_KEYWORDS": "Python,JavaScript,学习笔记,碎言,哲学,人生,成长",
    // 头像图片路径
    "PROFILE_IMAGE": "assets/images/avatar.png",

    'menuItems' : [
        {name:'标签',href:'/tags',iconComponent:'TagsIcon'},
        {name:'链接',href:'/friends',iconComponent:'FriendsIcon'},
        {name:'关于',href:'/about',iconComponent:'AboutIcon'},
        {name:'搜索',href:'/search',iconComponent:'SearchIcon'},
    ],

        // 片语页面标题
    "THOUGHTS_PAGE_TITLE": "片语",
    // 片语页面描述
    "THOUGHTS_PAGE_DESCRIPTION": "柒色墨笺的片语，记录日常的短小想法和瞬间感悟。",
    // 友链页面标题
    "FRIENDS_PAGE_TITLE": "链接",
    // 友链页面描述
    "FRIENDS_PAGE_DESCRIPTION": "如果你想了解一个博客和他的主人，就去看看他的链接。",
    // 博客聚合标题
    "BLOG_AGGREGATION_TITLE": "博客聚合",
    // 博客聚合描述
    "BLOG_AGGREGATION_DESCRIPTION": "一些优秀的博客聚合平台，可以发现更多有趣的独立博客。",

    "snsLinks": linksConfig.snsLinks
};

export default config;