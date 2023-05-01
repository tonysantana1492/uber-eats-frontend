import { ApolloProvider } from '@apollo/client';
import { MockApolloClient, createMockClient } from 'mock-apollo-client';

import { render, screen, waitFor } from '../../utils/test-utils';
import { CREATE_ACCOUNT_MUTATION, CreateAccount } from '../create-account';
import userEvent from '@testing-library/user-event';
import { UserRole } from '../../gql/graphql';

// Importante que esta variable comience con mock para poder ser accedida desde jest.mock en los test  
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
	const realModule = jest.requireActual('react-router-dom');
	return {
		...realModule,
		useNavigate: () => {
			const navigate = mockNavigate;
			return navigate;
		},
	};
});

describe('<CreateAccount />', () => {
	afterAll(() => {
		jest.clearAllMocks();
	});

	let mockedClient: MockApolloClient;

	beforeEach(() => {
		mockedClient = createMockClient();

		render(
			<ApolloProvider client={mockedClient}>
				<CreateAccount />
			</ApolloProvider>,
		);
	});

	it('renders OK with props', async () => {
		await waitFor(() => {
			expect(document.title).toBe('Create Account | Uber Eats');
		});
	});

	it('renders validation errors', async () => {
		const email = await screen.findByPlaceholderText(/email/i);
		const password = await screen.findByPlaceholderText(/password/i);

		await userEvent.type(email, 'badEmail');
		let errorMessage = screen.getByRole('alert');
		expect(errorMessage).toHaveTextContent(/please enter a valid email/i);

		await userEvent.clear(email);
		errorMessage = screen.getByRole('alert');
		expect(errorMessage).toHaveTextContent(/email is required/i);

		await userEvent.type(email, 'goodemail@gmail.com');
		await userEvent.type(password, '123456');
		await userEvent.clear(password);
		errorMessage = screen.getByRole('alert');
		expect(errorMessage).toHaveTextContent(/password is required/i);
	});

	it('submits mutation with form values', async () => {
		const formData = {
			email: 'test@gmail.com',
			password: '123456',
			role: UserRole.Client,
		};

		const mockedMutationResponse = jest
			.fn()
			.mockResolvedValue({ data: { createAccount: { ok: true, error: null } } });

		mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedMutationResponse);

		const email = await screen.findByPlaceholderText(/email/i);
		const password = await screen.findByPlaceholderText(/password/i);
		const button = await screen.findByRole('button');

		jest.spyOn(window, 'alert').mockImplementation(() => null);

		await userEvent.type(email, formData.email);
		await userEvent.type(password, formData.password);
		await userEvent.click(button);

		expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
		expect(mockedMutationResponse).toHaveBeenCalledWith({
			createAccountInput: {
				email: formData.email,
				password: formData.password,
				role: formData.role,
			},
		});

		expect(window.alert).toHaveBeenCalledTimes(1);
		expect(window.alert).toHaveBeenCalledWith('Account Created! Log in now!');

		expect(mockNavigate).toHaveBeenCalledWith('/');
	});

	it('show errors on calls mutation', async () => {
		const formData = {
			email: 'test@gmail.com',
			password: '123456',
		};

		const MUTATION_ERROR = 'mutation-error';

		const mockedMutationResponse = jest
			.fn()
			.mockResolvedValue({ data: { createAccount: { ok: false, error: MUTATION_ERROR } } });

		mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedMutationResponse);

		const email = screen.getByPlaceholderText(/email/i);
		const password = screen.getByPlaceholderText(/password/i);
		const submitBtn = screen.getByRole('button');

		await userEvent.type(email, formData.email);
		await userEvent.type(password, formData.password);
		await userEvent.click(submitBtn);

		const errorMessage = await screen.findByRole('alert');
		expect(errorMessage).toHaveTextContent(MUTATION_ERROR);
	});
});
