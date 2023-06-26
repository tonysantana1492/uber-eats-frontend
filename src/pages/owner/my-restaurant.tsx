/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
	VictoryAxis,
	VictoryChart,
	VictoryLabel,
	VictoryLine,
	VictoryTheme,
	VictoryTooltip,
	VictoryVoronoiContainer,
} from 'victory';

import { graphql } from '../../gql';
import { Dish } from '../../components/dish';
import { useMe } from '../../hooks/useMe';
import { CreatePaymentMutation } from '../../gql/graphql';
import { useEffect } from 'react';

type IParams = {
	id: string;
};

export const MY_RESTAURANT_QUERY = graphql(`
	query myRestaurant($input: MyRestaurantInput!) {
		myRestaurant(input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
				menu {
					...DishParts
				}
				orders {
					...OrderParts
				}
			}
		}
	}
`);

export const CREATE_PAYMENT_MUTATION = graphql(`
	mutation CreatePayment($input: CreatePaymentInput!) {
		createPayment(input: $input) {
			ok
			error
		}
	}
`);

export const PENDING_ORDER_SUBSCRIPTION = graphql(`
	subscription pendingOrders {
		pendingOrders {
			...FullOrderParts
		}
	}
`);

export const MyRestaurant = () => {
	const { id } = useParams<IParams>();
	const navigate = useNavigate();
	const { data: dataUser } = useMe();

	const onCompleted = (data: CreatePaymentMutation) => {
		if (data.createPayment.ok) {
			alert('Your restaurant is being promoted');
		}
	};

	const { data } = useQuery(MY_RESTAURANT_QUERY, {
		variables: {
			input: {
				id: Number(id),
			},
		},
	});

	const [createPaymentMutation] = useMutation(CREATE_PAYMENT_MUTATION, {
		onCompleted,
	});

	const triggerPaddle = async () => {
		if (dataUser?.me.email) {
			// /const client = new PaddleSDK('169111', 'your-unique-api-key', 'your-public-key', { sandbox: true });

			// try {
				// const custom = await client.generatePayLink({
				// 	// eslint-disable-next-line camelcase
				// 	product_id: 829055,
				// 	// eslint-disable-next-line camelcase
				// 	customer_email: dataUser.me.email,
				// });

			// 	console.log(custom);
				

			// 	// createPaymentMutation({
			// 	// 	variables: {
			// 	// 		input: {
			// 	// 			restaurantId: +(id as string),
			// 	// 			transactionId: data.checkout.id,
			// 	// 		},
			// 	// 	},
			// 	// });
			// } catch (error) {
			// 	console.log(error);
			// }

			// @ts-ignore
			// window.Paddle.Environment.set('sandbox');
			// @ts-ignore
			window.Paddle.Setup({ vendor: 169111 });
			// @ts-ignore
			window.Paddle.Checkout.open({
				product: 829055,
				email: dataUser.me.email,
				successCallback: (data: { checkout: { id: number } }) => {
					createPaymentMutation({
						variables: {
							input: {
								restaurantId: +(id as string),
								transactionId: data.checkout.id,
							},
						},
					});
				},
			});
		}
	};

	const { data: subscriptionData } = useSubscription(PENDING_ORDER_SUBSCRIPTION);

	useEffect(() => {
		if (subscriptionData?.pendingOrders.id) {
			navigate(`/orders/${subscriptionData.pendingOrders.id}`);
		}
	}, [subscriptionData]);

	return (
		<div>
			<Helmet>
				<title>{data?.myRestaurant.restaurant?.name || 'Loading...'} | Uber Eats</title>
				<script src='https://cdn.paddle.com/paddle/paddle.js'></script>
			</Helmet>
			<div className='checkout-container'></div>
			<div
				className='  bg-gray-700  py-28 bg-center bg-cover'
				style={{
					backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
				}}
			></div>
			<div className='container mt-10'>
				<h2 className='text-4xl font-medium mb-10'>{data?.myRestaurant.restaurant?.name || 'Loading...'}</h2>
				<Link to={`/restaurant/${id}/add-dish`} className=' mr-8 text-white bg-gray-800 py-3 px-10'>
					Add Dish &rarr;
				</Link>
				<span onClick={triggerPaddle} className=' cursor-pointer text-white bg-lime-700 py-3 px-10'>
					Buy Promotion &rarr;
				</span>
				<div className='mt-10'>
					{data?.myRestaurant.restaurant?.menu?.length === 0 ? (
						<h4 className='text-xl mb-5'>Please upload a dish!</h4>
					) : (
						<div className='grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10'>
							{data?.myRestaurant.restaurant?.menu?.map(dish => (
								<Dish
									key={dish.id}
									name={dish.name}
									description={dish.description}
									price={dish.price}
								/>
							))}
						</div>
					)}
				</div>
				<div className='mt-20 mb-10'>
					<h4 className='text-center text-2xl font-medium'>Sales</h4>
					<div className='mt-10'>
						<VictoryChart
							height={500}
							theme={VictoryTheme.material}
							width={window.innerWidth}
							domainPadding={50}
							containerComponent={<VictoryVoronoiContainer />}
						>
							{data?.myRestaurant.restaurant?.orders && (
								<VictoryLine
									labels={({ datum }) => `$${datum.y}`}
									labelComponent={<VictoryTooltip style={{ fontSize: 18 }} renderInPortal dy={-20} />}
									data={data?.myRestaurant.restaurant?.orders.map(order => ({
										x: order.createdAt,
										y: order.total,
									}))}
									interpolation='natural'
									style={{
										data: {
											strokeWidth: 5,
										},
									}}
								/>
							)}

							{/* <VictoryAxis
								dependentAxis								
								tickFormat={tick => `$${tick}`}
								style={{
									tickLabels: {
										fontSize: 18,
										fill: '#4D7C0F'
									},
								}}
							/> */}

							<VictoryAxis
								tickLabelComponent={<VictoryLabel renderInPortal />}
								style={{
									tickLabels: {
										fontSize: 20,
									},
								}}
								tickFormat={tick => new Date(tick).toLocaleDateString('en')}
							/>
						</VictoryChart>
					</div>
				</div>
			</div>
		</div>
	);
};
