import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

// reacti
export const isLoggedInVar = makeVar(false);

export const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	cache: new InMemoryCache({
		typePolicies: {
			// Define local fields (fields that are not in the schema of your server)
			Query: {
				fields: {
					isLoggedIn: {
						read() {
							return isLoggedInVar();
						},
					},
				},
			},
		},
	}),
});
