const MastodonIcon = ({ className = '' }: { className?: string }) => {
    return (
        <svg
            className={className}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M21.5 8.1c0-4.2-2.8-5.6-2.8-5.6C17.4 1.9 15.1 1.6 12 1.6s-5.4.3-6.7.9c0 0-2.8 1.4-2.8 5.6 0 1-.1 2.2 0 3.4.2 4.2 1 8.2 4.8 9.2 1.8.5 3.5.6 4.7.5 2.4-.1 3.8-.8 3.8-.8" />
            <path d="M6.5 14V8.7c0-1.4 1-2.4 2.4-2.4 1.2 0 2.1.7 2.7 1.8l.4.8.4-.8c.6-1.1 1.5-1.8 2.7-1.8 1.4 0 2.4 1 2.4 2.4V14" />
            <path d="M12 14V9.7" />
        </svg>
    );
};

export default MastodonIcon;
