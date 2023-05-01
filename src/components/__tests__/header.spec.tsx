import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { Header } from '../header';
import { BrowserRouter } from 'react-router-dom';
import { ME_QUERY } from '../../hooks/useMe';

describe('<Header />', () => {
	it('renders verify banner', async () => {
		const { queryByText } = render(
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
									verified: false,
								},
							},
						},
					},
				]}
			>
				<BrowserRouter>
					<Header />
				</BrowserRouter>
			</MockedProvider>,
		);

		await waitForElementToBeRemoved(() => queryByText('Loading...'));
		expect(queryByText('Please verify your email.')).toBeInTheDocument();
	});

	it('renders without verify banner', async () => {
		const { queryByText } = render(
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
			</MockedProvider>,
		);

		await waitForElementToBeRemoved(() => queryByText('Loading...'));
		expect(queryByText('Please verify your email.')).not.toBeInTheDocument();

	});
});
