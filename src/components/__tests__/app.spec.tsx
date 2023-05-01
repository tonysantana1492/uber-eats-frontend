import { render, waitFor } from '@testing-library/react';

import { App } from '../app';
import { isLoggedInVar } from '../../apollo';
import * as apollo from '@apollo/client';

jest.mock('../../routers/logged-out-router', () => {
	return {
		LoggedOutRouter: () => <span>logged-out</span>,
	};
});

jest.mock('../../routers/logged-in-router', () => {
	return {
		LoggedInRouter: () => <span>logged-in</span>,
	};
});

describe('<App />', () => {
	it('renders LoggedOutRouter', () => {
		jest.spyOn(apollo, 'useReactiveVar').mockImplementation(() => false);

		const { getByText } = render(<App />);
		expect(getByText('logged-out')).toBeInTheDocument();
	});

	it('renders LoggedInRouter', async () => {
		jest.spyOn(apollo, 'useReactiveVar').mockImplementation(() => true);

		const { getByText } = render(<App />);
		expect(getByText('logged-in')).toBeInTheDocument();
	});

	it('change from LoggedOutRouter to LoggedInRouter', async () => {
		jest.spyOn(apollo, 'useReactiveVar').mockRestore();

		const { getByText, findByText } = render(<App />);

		expect(getByText('logged-out')).toBeInTheDocument();

		await waitFor(() => {
			isLoggedInVar(true);
		});

		expect(await findByText('logged-in')).toBeInTheDocument();
	});
});
