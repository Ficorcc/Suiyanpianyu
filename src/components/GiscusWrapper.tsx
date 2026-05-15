import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class GiscusWrapper extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        if (error.message.includes('giscus')) {
            console.warn('Giscus 加载失败:', error.message);
        }
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="text-center py-8 text-gray-500">
                    评论加载失败
                </div>
            );
        }

        return this.props.children;
    }
}
