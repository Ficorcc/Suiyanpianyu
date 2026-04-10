import Link from './Link';

interface LinkCardProps {
    name: string;
    url: string;
    description: string;
    avatar?: string;
    is_active?: boolean;
}

const LinkCard = ({ name, url, description, avatar, is_active = true }: LinkCardProps) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <Link
                href={url}
                target='_blank'
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 mb-2"
            >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                        src={avatar || 'https://cravatar.cn/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                        alt={`${name} logo`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://cravatar.cn/avatar/00000000000000000000000000000000?d=mp&f=y';
                        }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                        is_active === false
                            ? 'text-neutral-500'
                            : 'text-neutral-700'
                    }`}>
                        {name}
                    </span>
                    {is_active === false && (
                        <span className="text-xs text-neutral-500">链接失效</span>
                    )}
                    {is_active !== false && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    )}
                </div>
            </Link>
            <p className={`text-sm line-clamp-2 leading-relaxed ${
                is_active === false ? 'text-neutral-500 line-through' : 'text-neutral-600'
            }`}>
                {description}
            </p>
        </div>
    );
};

export default LinkCard;