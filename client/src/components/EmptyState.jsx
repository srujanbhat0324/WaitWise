const EmptyState = ({ icon: Icon, title, description, actionText, actionLink }) => {
    return (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <Icon size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 mb-4 max-w-sm mx-auto">{description}</p>
            {actionText && actionLink && (
                <a
                    href={actionLink}
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {actionText}
                </a>
            )}
        </div>
    );
};

export default EmptyState;
