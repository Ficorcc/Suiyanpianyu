import { useEffect, useRef } from 'react';
import type { WalineInstance } from '@waline/client';
import { WALINE_SITE_URL, walineConfig } from '@/walineConfig';

interface WalineCommentsProps {
    path: string;
}

const normalizePath = (path: string) => {
    const cleanPath = path.trim() || '/';
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

    return `${WALINE_SITE_URL}${normalizedPath}`;
};

export default function WalineComments({ path }: WalineCommentsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let instance: WalineInstance | null = null;
        let mounted = true;

        import('@waline/client')
            .then(({ init }) => {
                if (!mounted || !containerRef.current) return;

                instance = init({
                    el: containerRef.current,
                    ...walineConfig,
                    path: normalizePath(path),
                });
            })
            .catch((error) => {
                console.warn('Waline 加载失败:', error);
            });

        return () => {
            mounted = false;
            instance?.destroy();

            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [path]);

    return (
        <div className="mt-6">
            <div ref={containerRef} />
        </div>
    );
}
