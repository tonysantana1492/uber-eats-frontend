import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { graphql } from '../../gql';
import { useQuery } from '@apollo/client';

type IRestaurantParams = {
	id: string;
};

const RESTAURANT_QUERY = graphql(`
	query restaurant($input: RestaurantInput!) {
		restaurant(input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
			}
		}
	}
`);

export const Restaurant: FC = () => {
	const params = useParams<IRestaurantParams>();

	const { data } = useQuery(RESTAURANT_QUERY, {
		variables: {
			input: {
				restaurantId: Number(params.id),
			},
		},
	});

	return (
		<div>
			<Helmet>
				<title>{data?.restaurant.restaurant?.name || ''} | Uber Eats</title>
			</Helmet>
			<div
				className=' bg-gray-800 bg-center bg-cover py-48'
				style={{
					backgroundImage: `url(/restaurants/${data?.restaurant.restaurant?.coverImg})`,
				}}
			>
				<div className='bg-white xl:w-3/12 py-8 pl-16'>
					<h4 className='text-4xl mb-3'>{data?.restaurant.restaurant?.name}</h4>
					<h5 className='text-sm font-light mb-2'>{data?.restaurant.restaurant?.category?.name}</h5>
					<h6 className='text-sm font-light'>{data?.restaurant.restaurant?.address}</h6>
				</div>
			</div>
			<div className='container pb-32 flex flex-col items-end mt-20'>y</div>
		</div>
	);
};
