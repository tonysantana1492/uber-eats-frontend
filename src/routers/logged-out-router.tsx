import { Navigate, useRoutes } from 'react-router-dom';

import { Login } from '../pages/login';
import { CreateAccount } from '../pages/create-account';

const routes = [
	{
		path: '/create-account',
		element: <CreateAccount />,
	},
	{
		path: '/',
		element: <Login />,
	},
	{
		path: '*',
		element: <Navigate to='/' />,
	},
];

export const LoggedOutRouter = () => {
	const elements = useRoutes(routes);

	return <>{elements}</>;
};
