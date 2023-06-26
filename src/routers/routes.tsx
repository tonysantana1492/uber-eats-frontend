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
import { Dashboard } from '../pages/driver/dashboard';
import { Restaurants } from '../pages/client/restaurants';
import { UserRole } from '../gql/graphql';
import { NotFound } from '../pages/404';

export const commonRoutes = [
	{ path: '/confirm', element: <ConfirmEmail />, roles: [] },
	{ path: '/edit-profile', element: <EditProfile />, roles: [] },
	{ path: '*', element: <NotFound />, roles: [] },
	{ path: '/orders/:id', element: <Order />, roles: [] },
];

export const clientRoutes = [
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
];

export const ownerRoutes = [
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
		roles: [UserRole.Owner],
	},
	{
		path: '/restaurant/:restaurantId/add-dish',
		element: <AddDish />,
		roles: [UserRole.Owner],
	},
];

export const driverRoutes = [
	{
		path: '',
		element: <Dashboard />,
		roles: [UserRole.Delivery],
	},
];