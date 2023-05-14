import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { ApolloProvider } from '@apollo/client';
import userEvent from '@testing-library/user-event';

import { screen, render, waitFor } from '../../utils/test-utils';
import { LOGIN_MUTATION, Login } from '../login';
import { APP_TOKEN_NAME } from '../../constants';

describe('<Login />', () => {
	let mockedClient: MockApolloClient;

	beforeEach(() => {
		mockedClient = createMockClient();
		render(
			<ApolloProvider client={mockedClient}>
				<Login />
			</ApolloProvider>,
		);
	});

	it('renders OK with props', async () => {
		await waitFor(() => {
			expect(document.title).toBe('Login | Uber Eats');
		});
	});

	it('display email validation errors', async () => {
		const email = screen.getByPlaceholderText(/email/i);

		await userEvent.type(email, 'this@wont');
		let errorMessage = await screen.getByRole('alert');
		expect(errorMessage).toHaveTextContent(/please enter a valid email/i);

		await userEvent.clear(email);
		errorMessage = await screen.getByRole('alert');
		expect(errorMessage).toHaveTextContent(/email is required/i);
	});

	it('display password validation errors', async () => {
		const password = screen.getByPlaceholderText(/password/i);

		await userEvent.type(password, '1234');
		await userEvent.clear(password);

		const errorMessage = await screen.getByRole('alert');
		expect(errorMessage).toHaveTextContent(/password is required/i);
	});

	it('submits form and calls mutation', async () => {
		const formData = {
			email: 'test@gmail.com',
			password: '123456',
		};

		const tokenMutation = 'someToken';

		const mockedMutationResponse = jest
			.fn()
			.mockResolvedValue({ data: { login: { ok: true, error: null, token: tokenMutation } } });

		mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
		jest.spyOn(Storage.prototype, 'setItem');
		// localStorage.__proto__.setItem = jest.fn();

		const email = screen.getByPlaceholderText(/email/i);
		const password = screen.getByPlaceholderText(/password/i);
		const submitBtn = screen.getByRole('button');

		await userEvent.type(email, formData.email);
		await userEvent.type(password, formData.password);

		await userEvent.click(submitBtn);

		expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
		expect(mockedMutationResponse).toHaveBeenCalledWith({
			loginInput: {
				email: formData.email,
				password: formData.password,
			},
		});

		expect(localStorage.setItem).toHaveBeenCalledTimes(1);
		expect(localStorage.setItem).toHaveBeenCalledWith(APP_TOKEN_NAME, tokenMutation);
	});

	it('show errors on calls mutation', async () => {
		const formData = {
			email: 'test@gmail.com',
			password: '123456',
		};

		const mockedMutationResponse = jest
			.fn()
			.mockResolvedValue({ data: { login: { ok: false, error: 'mutation-error', token: null } } });

		mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

		const email = screen.getByPlaceholderText(/email/i);
		const password = screen.getByPlaceholderText(/password/i);
		const submitBtn = screen.getByRole('button');

		await userEvent.type(email, formData.email);
		await userEvent.type(password, formData.password);

		await userEvent.click(submitBtn);

		const errorMessage = await screen.findByRole('alert');
		expect(errorMessage).toHaveTextContent(/mutation-error/i);
	});
});
