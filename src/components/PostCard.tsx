import { PostCardProps } from '../types';
import PostListItem from './PostListItem';

const homeFormatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
        const parts = dateString.split('T')[0];
        const datePart = parts || dateString.substring(0, 10);
        const [year, month, day] = datePart.split('-');
        if (year && month && day) {
            return `${year}/${month}/${day}`;
        }
        return '';
    } catch (error) {
        return '';
    }
};

export default function PostCard({ post }: PostCardProps) {
    return (
        <article className="post-card">
            <PostListItem
                id={post.id}
                title={post.title || ''}
                time={post.time || ''}
                formatDate={homeFormatDate}
            />
        </article>
    );
}