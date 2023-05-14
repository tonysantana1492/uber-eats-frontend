import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@apollo/client';

import { graphql } from '../../gql';
import { Restaurant } from '../../components/restaurant';

const RESTAURANTS_QUERY = graphql(`
	query restaurantsPageQuery($input: RestaurantsInput!) {
		allCategories {
			error
			ok
			categories {
				...CategoryParts
			}
		}
		restaurants(input: $input) {
			error
			ok
			totalPages
			totalResults
			results {
				id
				name
				coverImg
				category {
					name
				}
				address
				isPromoted
			}
		}
	}
`);

interface IFormData {
	searchTerm: string;
}

export const Restaurants: FC = () => {
	const [page, setPage] = useState(1);
	const navigate = useNavigate();

	const onNextPageClick = () => setPage(current => current + 1);
	const onPrevPageClick = () => setPage(current => current - 1);

	const { data, loading } = useQuery(RESTAURANTS_QUERY, {
		variables: {
			input: {
				page,
			},
		},
	});
	const { register, handleSubmit } = useForm<IFormData>();

	const onSearchSubmit: SubmitHandler<IFormData> = ({ searchTerm }) => {
		navigate(`/search?term=${searchTerm}`);
	};

	return (
		<div>
			<Helmet>
				<title>Home | Nuber Eats</title>
			</Helmet>
			<form
				noValidate		
				// style={{
				// 	backgroundImage: 'url("restaurants/pngwing.com (5).png")',
				// 	backgroundRepeat: 'no-repeat',
				// 	backgroundSize: 'contain',
				// 	backgroundPositionX: 'right'
				// }}		
				className=' bg-gray-800 w-full py-36 flex items-center justify-center'
				onSubmit={handleSubmit(onSearchSubmit)}
			>
				<input
					className='input rounded-md border-0 w-3/4 md:w-3/12'
					type='search'
					placeholder='Search restaurants...'
					{...register('searchTerm', {
						required: true,
						min: 3,
					})}
				/>
			</form>
			{!loading && (
				<div className='container pb-20 mt-8'>
					<div className='flex justify-center space-x-10 mx-auto '>
						{data?.allCategories.categories?.map(category => (
							<Link key={category.id} to={`/category/${category.slug}`}>
								<div className='flex flex-col group items-center cursor-pointer'>
									<div
										className='w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full'
										style={{ backgroundImage: `url(${category.coverImg})` }}
									></div>
									<span className='mt-1 text-sm text-center font-medium'>{category.name}</span>
								</div>
							</Link>
						))}
					</div>
					<div className='grid mt-16 px-1 md:grid-cols-3 gap-x-5 gap-y-10'>
						{data?.restaurants.results?.map(restaurant => (
							<Restaurant
								key={restaurant.id}
								id={String(restaurant.id)}
								coverImg={restaurant.coverImg}
								name={restaurant.name}
								categoryName={restaurant.category?.name}
							/>
						))}
					</div>
					<div className='grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10'>
						{page > 1 ? (
							<button onClick={onPrevPageClick} className='focus:outline-none font-medium text-2xl'>
								&larr;
							</button>
						) : (
							<div></div>
						)}
						<span>
							Page {page} of {data?.restaurants.totalPages}
						</span>
						{page !== data?.restaurants.totalPages ? (
							<button onClick={onNextPageClick} className='focus:outline-none font-medium text-2xl'>
								&rarr;
							</button>
						) : (
							<div></div>
						)}
					</div>
				</div>
			)}
			<div></div>
		</div>
	);
};
