import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';

import { graphql } from '../../gql';
import { CreateDishMutation } from '../../gql/graphql';
import { MY_RESTAURANT_QUERY } from './my-restaurant';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';

type IParams = {
	restaurantId: string;
};

interface IFormData {
	name: string;
	price: string;
	description: string;
	[key: string]: string | null; // Esto es para poder tener los names generados dinamicamente y typescript no se me queje
}

const CREATE_DISH_MUTATION = graphql(`
	mutation createDish($input: CreateDishInput!) {
		createDish(input: $input) {
			error
			ok
		}
	}
`);

export const AddDish = () => {
	const { restaurantId } = useParams<IParams>();
	const navigate = useNavigate();
	const [optionsNumber, setOptionsNumber] = useState<number[]>([]);

	const onCompleted = ({ createDish }: CreateDishMutation) => {
		if (createDish.error) {
			alert('Bad Request');
		}

		if (createDish.ok) {
			navigate(`restaurant/${restaurantId}`, { replace: true });
		}
	};

	const [createDishMutation, { loading }] = useMutation(CREATE_DISH_MUTATION, {
		refetchQueries: [
			{
				query: MY_RESTAURANT_QUERY,
				variables: {
					input: {
						id: +(restaurantId as string),
					},
				},
			},
		],
		onCompleted,
	});

	const {
		register,
		handleSubmit,
		formState: { isValid, errors },
		unregister,
	} = useForm<IFormData>({
		mode: 'onChange',
	});

	const onAddOptionClick = () => {
		setOptionsNumber(current => [Date.now(), ...current]);
	};

	const onDeleteClick = (idToDelete: number) => {
		setOptionsNumber(current => current.filter(id => id !== idToDelete));
		unregister(`${idToDelete}-optionName`);
		unregister(`${idToDelete}-optionExtra`);
	};

	const onSubmit: SubmitHandler<IFormData> = data => {
		const { description, name, price, ...rest } = data;

		const optionObjects = optionsNumber.map(id => ({
			name: rest[`${id}-optionName`] as string,
			extra: +(rest[`${id}-optionExtra`] as string),
		}));

		createDishMutation({
			variables: {
				input: {
					description,
					name,
					price: +price,
					restaurantId: +(restaurantId as string),
					options: optionObjects,
				},
			},
		});
	};

	return (
		<div className='container flex flex-col items-center mt-40'>
			<Helmet>
				<title>Add Dish | Uber Eats</title>
			</Helmet>
			<h4 className='font-semibold text-2xl mb-3'>Add Dish</h4>
			<form className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5' noValidate onSubmit={handleSubmit(onSubmit)}>
				<input
					className='input'
					type='text'
					placeholder='Name'
					{...register('name', 
                    { required: 'Name is required.', 
                    minLength: { 
                        value: 5, 
                        message: 'The name must contain at least 5 characters'
                    } 
                })}
				/>
				{errors.name?.message && <FormError errorMessage={errors.name?.message} />}
				<input
					className='input'
					type='number'
					min={0}
					placeholder='Price'
					{...register('price', {
						required: 'Price is required.',
					})}
				/>
				<input
					className='input'
					type='text'
					placeholder='Description'
					{...register('description', { required: 'Description is required.' })}
				/>

				<div className='my-10'>
					<h4 className='font-medium  mb-3 text-lg'>Dish Options</h4>
					<span
						onClick={onAddOptionClick}
						className='cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-'
					>
						Add Dish Option
					</span>
					{optionsNumber.length !== 0 &&
						optionsNumber.map(id => (
							<div key={id} className='mt-5'>
								<input
									{...register(`${id}-optionName`)}
									className='py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2'
									type='text'
									placeholder='Option Name'
								/>
								<input
									{...register(`${id}-optionExtra`)}
									className='py-2 px-4 focus:outline-none focus:border-gray-600 border-2'
									type='number'
									min={0}
                                    defaultValue={0}
									placeholder='Option Extra'
								/>
								<span
									className='cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5 bg-'
									onClick={() => onDeleteClick(id)}
								>
									Delete Option
								</span>
							</div>
						))}
				</div>
				<Button loading={loading} canClick={isValid} actionText='Create Dish' />
			</form>
		</div>
	);
};
