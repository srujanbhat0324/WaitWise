import { useEffect, useState } from 'react';

const useNotifications = () => {
    const [permission, setPermission] = useState(Notification.permission);

    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(perm => {
                setPermission(perm);
            });
        }
    }, []);

    const showNotification = (title, options = {}) => {
        if (permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        }
    };

    return { permission, showNotification };
};

export default useNotifications;
