import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { Header } from '../header';
import { BrowserRouter } from 'react-router-dom';
import { ME_QUERY } from '../../hooks/useMe';

describe('<Header />', () => {
	it('renders OK with props', () => {
		const { getByText } = render(
			<MockedProvider
				mocks={[
					{
						request: {
							query: ME_QUERY,
						},
						result: {
							data: {
								me: {
									id: 1,
									email: '',
									role: '',
									verified: true,
								},
							},
						},
					},
				]}
			>
				<BrowserRouter>
					<Header />
				</BrowserRouter>
				,
			</MockedProvider>,
		);

		getByText('');
	});
});
