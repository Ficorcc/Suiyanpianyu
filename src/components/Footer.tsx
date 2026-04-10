import Link from './Link';
import config from '@/config';
import SnsIcons from './SnsIcons';

export default function Footer() {
    return (
        <footer className="my-8">
            <div className="flex flex-col items-center gap-4">

                {/* SNS 图标 */}
                <SnsIcons />
                {/* 版权信息 */}
                <p className="m-0 text-center text-sm">
                    &copy; 2008 - 2026 {config.BLOG_NAME_EN} |&nbsp;
                    <Link
                        underline={true}
                        href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
                        target="_blank"
                        rel="license noopener noreferrer"
                        className="text-primary hover:text-primary-hover rainbow_hover"
                      >CC BY-NC-SA 4.0
                    </Link>
                </p>

                {/* 博客程序和主题信息 */}
                <p className="m-0 text-center text-sm">
                    <Link
                        underline={true}
                        href="https://nextjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-hover"
                      >Next.js
                    </Link>
                    {' · '}
                    <Link
                        underline={true}
                        href="https://github.com/bosichong/suiyanblog"
                        className="text-primary hover:text-primary-hover"
                      >柒色墨笺主题
                    </Link>
                </p>
            </div>
            <script data-goatcounter="https://suiyan.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
        </footer>
    );
}