const LoadingSkeleton = ({ type = 'card' }) => {
    if (type === 'card') {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
            </div>
        );
    }

    if (type === 'list') {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'text') {
        return (
            <div className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            </div>
        );
    }

    return null;
};

export default LoadingSkeleton;
