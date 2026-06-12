import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from './context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactElement }) { 
    const { session } = UserAuth()!;

    if (session === undefined) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/signin" />;
    }
    return <>{children}</>;
};