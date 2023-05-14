import { ApolloClient, InMemoryCache, createHttpLink, makeVar, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { APP_API, APP_API_WS, APP_TOKEN_NAME } from './constants';
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem(APP_TOKEN_NAME);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({ uri: APP_API });

const wsLink = new WebSocketLink({
	uri: APP_API_WS,
	options: {
	  reconnect: true,
	  connectionParams: {
		"x-jwt": authTokenVar() || "",
	  },
	},
  });

const authLink = setContext((_, { headers }) => {
	return {
		headers: {
			...headers,
			'x-jwt': authTokenVar() || '',
		},
	};
});

const splitLink = split(
	({ query }) => {
	  const definition = getMainDefinition(query);
	  return (
		definition.kind === "OperationDefinition" &&
		definition.operation === "subscription"
	  );
	},
	wsLink,
	authLink.concat(httpLink)
  );

export const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache({
		typePolicies: {
			// Define local fields (fields that are not in the schema of your server)
			// Query: {
			// 	fields: {
			// 		isLoggedIn: {
			// 			read() {
			// 				return isLoggedInVar();
			// 			},
			// 		},
			// 		token: {
			// 			read() {
			// 				return authTokenVar();
			// 			},
			// 		},
			// 	},
			// },
		},
	}),
});
