import { useRoutes } from 'react-router-dom';
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
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { AddRestaurant } from '../pages/owner/add-restaurants';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';
import { Order } from '../pages/order';

const routes = [
	// Common
	{ path: '/confirm', element: <ConfirmEmail />, roles: [] },
	{ path: '/edit-profile', element: <EditProfile />, roles: [] },
	{ path: '*', element: <NotFound />, roles: [] },
	{ path: '/order/:id', element: <Order />, roles: [] },
	// Client
	{
		path: '/',
		element: <Restaurants />,
		roles: [UserRole.Client],
	},
	{
		path: '/search',
		element: <Search />,
		roles: [UserRole.Client],
	},
	{
		path: '/category/:slug',
		element: <Category />,
		roles: [UserRole.Client],
	},
	{
		path: '/restaurant/:id',
		element: <Restaurant />,
		roles: [UserRole.Client],
	},
	// Owner
	{
		path: '/',
		element: <MyRestaurants />,
		roles: [UserRole.Owner],
	},
	{
		path: 'restaurant/:id',
		element: <MyRestaurant />,
		roles: [UserRole.Owner],
	},
	{
		path: '/add-restaurant',
		element: <AddRestaurant />,
		roles: [UserRole.Owner]
	},
	{
		path: '/restaurant/:restaurantId/add-dish',
		element: <AddDish />,
		roles: [UserRole.Owner]
	}
];

export const LoggedInRouter = () => {
	const { data, error, loading } = useMe();

	const authorizedRoutes = routes.filter(({ roles }) => {
		if (roles.length === 0) return true;
		if(!data) return false;

		return roles.includes(data.me.role);
	});
	
	const elements = useRoutes(authorizedRoutes);

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
			{elements}
		</div>
	);
};
