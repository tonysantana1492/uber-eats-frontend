import { Helmet } from 'react-helmet-async';
import { graphql } from '../../gql';
import { useQuery } from '@apollo/client';
import { Restaurant } from '../../components/restaurant';
import { Link } from 'react-router-dom';

const MY_RESTAURANTS_QUERY = graphql(`
	query myRestaurants {
		myRestaurants {
			ok
			error
			restaurants {
				...RestaurantParts
			}
		}
	}
`);
export const MyRestaurants = () => {
	const { data } = useQuery(MY_RESTAURANTS_QUERY);

	if (!data?.myRestaurants.restaurants) {
		return <h2>Something went wrong!!!</h2>;
	}

	return (
		<div>
			<Helmet>
				<title>My Restaurants | Nuber Eats</title>
			</Helmet>
			<div className='max-w-screen-2xl mx-auto mt-24'>
				<h2 className='text-4xl font-medium mb-10'>My Restaurants</h2>
				{data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
					<>
						<h4 className='text-xl mb-5'>You have no restaurants.</h4>
						<Link className='text-lime-600 hover:underline' to='/add-restaurant'>
							Create one &rarr;
						</Link>
					</>
				) : (
					<div className='grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10'>
						{data?.myRestaurants.restaurants.map(restaurant => (
							<Restaurant
								key={restaurant.id}
								id={restaurant.id + ''}
								coverImg={restaurant.coverImg}
								name={restaurant.name}
								categoryName={restaurant.category?.name}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
