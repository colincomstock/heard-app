import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function PrivateRoute({ children }: { children: React.ReactElement }) {
    const { isAuthLoading, isAuthenticated } = useAuth();

    if (isAuthLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }
    return <>{children}</>;
};