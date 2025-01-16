import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RefreshHandler({ setIsAuthenticated, children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setIsAuthenticated(true);

            const restrictedPaths = ['/', '/login', '/signup'];
            if (restrictedPaths.includes(location.pathname)) {
                localStorage.setItem("currentPath", "/dashboard")
                navigate('/dashboard', { replace: true });
            }
        }
        setIsLoading(false); // Allow rendering once logic is done
    }, [location.pathname, navigate, setIsAuthenticated]);

    // Show nothing or a loader until the logic completes
    if (isLoading) {
        return null;
    }

    return <>{children}</>;
}

export default RefreshHandler;
