describe('Edit Profile', () => {
	beforeEach(() => {
		cy.login('client@gmail.com', '123456');
	});

	it('can go to /edit-profile using the header', () => {
		cy.get('a[href="/edit-profile"]').click();
		cy.title().should('eq', 'Edit Profile | Uber Eats');
	});

	it('can change email', () => {
		cy.intercept('POST', 'http://localhost:4000/graphql', req => {
            // we intercept the request
			if (req.body?.operationName === 'editProfile') {
				req.body.variables.input.email = 'client@gmail.com';
			}
		});

		cy.visit('/edit-profile');
		cy.findByPlaceholderText(/email/i).clear().type('newclient@gmail.com');
        cy.findByRole('button').click();
	});
});
