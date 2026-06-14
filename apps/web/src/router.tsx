import { createBrowserRouter } from 'react-router-dom';
import  App from './App';
import QueueFeed from './components/queue/QueueFeed';
import Profile from './components/profile/Profile';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import PrivateRoute from './PrivateRoute';

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
                path: '/new-post',
                element: (
                    <PrivateRoute>
                        <div>New Post Page</div>
                    </PrivateRoute>
                ),
                handle: { title: 'new post' },
            },
            {
                path: '/saved',
                element: (
                    <PrivateRoute>
                        <div>Saved Page</div>
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
