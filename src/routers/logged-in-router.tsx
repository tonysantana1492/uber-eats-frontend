import { useRoutes } from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { clientRoutes, commonRoutes, driverRoutes, ownerRoutes } from './routes';

const routes = [...commonRoutes, ...clientRoutes, ...ownerRoutes, ...driverRoutes];

export const LoggedInRouter = () => {
	const { data, error, loading } = useMe();

	const authorizedRoutes = routes.filter(({ roles }) => {
		if (roles.length === 0) return true;
		if (!data) return false;

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
