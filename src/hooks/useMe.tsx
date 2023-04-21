import { useQuery } from '@apollo/client';
import { graphql } from '../gql';

export const ME_QUERY = graphql(`
	query me {
		me {
			id
			email
			role
			verified
		}
	}
`);

export const useMe = () => {
	return useQuery(ME_QUERY);
};
