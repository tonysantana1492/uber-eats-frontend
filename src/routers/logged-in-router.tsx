import { Route, Routes } from 'react-router-dom';
import { Restaurants } from '../pages/client/restaurants';
import { UserRole } from '../gql/graphql';
import { NotFound } from '../pages/404';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { Search } from '../pages/client/search';
import { Category } from '../pages/client/category';
import { Restaurant } from '../pages/client/restaurant';

const clientRoutes = [
	{
		path: '/',
		component: <Restaurants />,
	},
	{
		path: '/search',
		component: <Search />,
	},
	{
		path: '/category/:slug',
		component: <Category />,
	},
	{
		path: '/restaurant/:id',
		component: <Restaurant />
	}
];

const commonRoutes = [
	{ path: '/confirm', component: <ConfirmEmail /> },
	{ path: '/edit-profile', component: <EditProfile /> },
	{ path: '*', component: <NotFound /> },
];

export const LoggedInRouter = () => {
	const { data, error, loading } = useMe();

	if (!data || loading || error) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<span className='font-medium text-lg tracking-wide'>Loading...</span>
			</div>
		);
	}

	return (
		<div className='h-screen flex flex-col'>
			<Header />
			<Routes>
				{data.me.role === UserRole.Client &&
					clientRoutes.map(route => <Route path={route.path} key={route.path} element={route.component} />)}

				{commonRoutes.map(route => (
					<Route path={route.path} key={route.path} element={route.component} />
				))}
			</Routes>
		</div>
	);
};
