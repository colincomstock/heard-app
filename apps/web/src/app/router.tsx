import { createBrowserRouter } from 'react-router-dom';
import  App from './AppShell';
import QueueFeed from '../pages/queue/QueueFeed';
import Profile from '../pages/profile/Profile';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import PrivateRoute from './PrivateRoute';
import Saved from '../pages/saved/Saved';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: (
                    <PrivateRoute>
                        <QueueFeed />
                    </PrivateRoute>
                ),
                handle: { title: 'queue' },
            },
            {
                path: '/signin',
                element: <SignIn />,
                handle: { title: 'heard' },
            },
            {
                path: '/signup',
                element: <SignUp />,
                handle: { title: 'heard' },
            },
            {
                path: '/discover',
                element: (
                    <PrivateRoute>
                        <div>Discover Page</div>
                    </PrivateRoute>
                ),
                handle: { title: 'discover' },
            },
            {
                path: '/saved',
                element: (
                    <PrivateRoute>
                        <Saved />
                    </PrivateRoute>
                ),
                handle: { title: 'saved' },
            },
            {
                path: '/profile',
                element: (
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                ),
                handle: { title: 'profile' },
            },
        ],
    },
]);
