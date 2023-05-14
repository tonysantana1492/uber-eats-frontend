import { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import { graphql } from '../../gql';
import { Restaurant } from '../../components/restaurant';

const SEARCH_QUERY = graphql(`
	query searchPageQuery($input: SearchRestaurantInput!) {
		searchRestaurant(input: $input) {
			ok
			error
			totalPages
			totalResults
			results {
				...RestaurantParts
			}
		}
	}
`);

export const Search: FC = () => {
	const navigate = useNavigate();
	const [searchParam] = useSearchParams();
	const query = searchParam.get('term');

	const [callQuery, { loading, data }] = useLazyQuery(SEARCH_QUERY);

	useEffect(() => {
		if (!query) {
			return navigate('/', { replace: true });
		}

		callQuery({
			variables: {
				input: {
					page: 1,
					query,
				},
			},
		});
	}, [query, navigate]);

	return (
		<div>
			<Helmet>
				<title>Search | Uber Eats</title>
			</Helmet>
			<div className='container pb-20 mt-8'>
				<h3 className='font-semibold text-lg'>Search Page</h3>
				{loading ? (
					<div className='grid mt-16 px-1 md:grid-cols-3 gap-x-5 gap-y-10'>
						{data?.searchRestaurant.results?.map(restaurant => (
							<Restaurant
								key={restaurant.id}
								id={restaurant.id + ''}
								coverImg={restaurant.coverImg}
								name={restaurant.name}
								categoryName={restaurant.category?.name}
							/>
						))}
					</div>
				) : (
					<div className='h-screen flex justify-center items-center text-xl font-bold '>Loading...</div>
				)}
			</div>
		</div>
	);
};
