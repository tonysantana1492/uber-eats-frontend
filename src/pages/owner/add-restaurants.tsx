import { Helmet } from 'react-helmet-async';
import { graphql } from '../../gql';
import { useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { APP_API_UPLOAD } from '../../constants';
import { useState } from 'react';
import { CreateRestaurantMutation } from '../../gql/graphql';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';
import { useNavigate } from 'react-router-dom';

const CREATE_RESTAURANT_MUTATION = graphql(`
	mutation createRestaurant($input: CreateRestaurantInput!) {
		createRestaurant(input: $input) {
			ok
			error
			restaurantId
		}
	}
`);

interface IFormProp {
	name: 'string';
	address: 'string';
	categoryName: 'string';
	file: FileList;
}

export const AddRestaurant = () => {
	const [uploading, setUploading] = useState(false);
	const navigate = useNavigate();

	const onCompleted = (data: CreateRestaurantMutation) => {
		const {
			createRestaurant: { ok },
		} = data;

		if (ok) {
			setUploading(false);
			navigate('/');
		}
	};

	const [createRestaurantMutation, { data }] = useMutation(CREATE_RESTAURANT_MUTATION, {
		onCompleted,
		refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
	});

	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm<IFormProp>({
		mode: 'onChange',
	});

	const onSubmit: SubmitHandler<IFormProp> = async ({ name, address, categoryName, file }) => {
		try {
			setUploading(true);
			const actualFile = file[0];
			const formBody = new FormData();
			formBody.append('file', actualFile);

			const response = await fetch(APP_API_UPLOAD, {
				method: 'POST',
				body: formBody,
			});

			const { url: coverImg } = await response.json();

			createRestaurantMutation({
				variables: {
					input: {
						name,
						address,
						categoryName,
						coverImg,
					},
				},
			});
		} catch (error) {
			alert('Ops... something is wrong');
			console.log(error);
		}
	};

	return (
		<div className='container flex flex-col items-center mt-36'>
			<Helmet>
				<title>Add Restaurant | Uber Eats</title>
			</Helmet>
			<h4 className='font-semibold text-2xl mb-3'>Add Restaurant</h4>
			<form className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5' noValidate onSubmit={handleSubmit(onSubmit)}>
				<input
					type='text'
					className='input'
					placeholder='Name'
					{...register('name', {
						required: 'Name is required',
					})}
				/>
				<input
					type='text'
					className='input'
					placeholder='Address'
					{...register('address', {
						required: 'Address is required',
					})}
				/>
				<input
					type='text'
					className='input'
					placeholder='Category Name'
					{...register('categoryName', {
						required: 'Category Name is required',
					})}
				/>

				<input
					type='file'
					accept='image/*'
					{...register('file', {
						required: true,
					})}
				/>
				<Button actionText='Create Restaurant' canClick={isValid} loading={uploading} />
				{data?.createRestaurant.error && <FormError errorMessage={data.createRestaurant.error} />}
			</form>
		</div>
	);
};
