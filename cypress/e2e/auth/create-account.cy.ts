describe('Create Account', () => {
	it('should see email/password validation errors', () => {
		cy.visit('/');

		cy.findByText(/create an account/i).click();

		cy.findAllByPlaceholderText(/email/i).type('bad-email');
		cy.findByRole('alert').should('have.text', 'Please enter a valid email');

		cy.findAllByPlaceholderText(/email/i).clear();
		cy.findByRole('alert').should('have.text', 'Email is required');

		cy.findAllByPlaceholderText(/email/i).type('test@gmail.com');
		cy.findAllByPlaceholderText(/password/i)
			.type('1')
			.clear();
		cy.findByRole('alert').should('have.text', 'Password is required');
	});

	it('should be able to create account and login', () => {
		cy.intercept('http://localhost:4000/graphql', req => {
			const { operationName } = req.body;

			if (operationName && operationName === 'createAccount') {
				req.reply(res => {
					res.send({
						fixture: 'auth/create-account.json'
					});
				});
			}
		});
		cy.visit('/create-account');

		cy.findAllByPlaceholderText(/email/i).type('test@gmail.com');
		cy.findAllByPlaceholderText(/password/i).type('123456');
		cy.findByRole('button').click();

		cy.wait(3000);
		cy.title().should('eq', 'Login | Uber Eats');

		// TODO cree esto como un comando de cypress ver ../support/commands.ts
		cy.login('client@gmail.com', '123456');
	});
});
