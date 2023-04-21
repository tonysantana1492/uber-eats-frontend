import { FC, } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { graphql } from '../../gql';
import { Helmet } from 'react-helmet-async';

const CATEGORY_QUERY = graphql(`
	query categoryPageQuery($input: CategoryInput!) {
		category(input: $input) {
			ok
			error
			totalPages
			totalResults
            restaurants {
                ...RestaurantParts
            }
			category {
				...CategoryParts
			}
		}
	}
`);

type ICategoryParams = {
	slug: string;
};

export const Category: FC = () => {
	const params = useParams<ICategoryParams>();
	const { data } = useQuery(CATEGORY_QUERY, {
		variables: {
			input: {
				page: 1,
				slug: String(params.slug),
			},
		},
	});

	return (
		<div>
			<Helmet>
				<title>Category | Uber Eats</title>
			</Helmet>
			<div>{data?.category.category?.name}</div>
		</div>
	);
};
