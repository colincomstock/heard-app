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
                element: <QueueFeed />,
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
                element: <div>New Post Page</div>,
                handle: { title: 'new post' },
            },
            {
                path: '/saved',
                element: <div>Saved Page</div>,
                handle: { title: 'saved' },
            },
            {
                path: '/profile',
                element: <Profile />,
                handle: { title: 'profile' },
            },
        ],
    },
]);