import { Route, Routes } from 'react-router-dom';

import { Login } from '../pages/login';
import { CreateAccount } from '../pages/create-account';

export const LoggedOutRouter = () => {
	return (
		<Routes>
			<Route path='/create-account' element={<CreateAccount />} />
			<Route path='/' element={<Login />} />
		</Routes>
	);
};
