import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { SubmitHandler, useForm } from 'react-hook-form';
import { gql, useApolloClient, useMutation } from '@apollo/client';

import { graphql } from '../../gql';
import { EditProfileMutation } from '../../gql/graphql';

import { Button } from '../../components/button';
import { useMe } from '../../hooks/useMe';

interface IFormProps {
	email?: string;
	password?: string;
}

const EDIT_PROFILE_MUTATION = graphql(`
	mutation editProfile($input: EditProfileInput!) {
		editProfile(input: $input) {
			error
			ok
		}
	}
`);

export const EditProfile: FC = () => {
	const client = useApolloClient();
	const { data: userData } = useMe();

	const {
		register,
		handleSubmit,
		getValues,
		formState: { isValid },
	} = useForm<IFormProps>({
		defaultValues: {
			email: userData?.me.email,
		},
	});

	const onCompleted = (data: EditProfileMutation) => {
		const { editProfile } = data;

		if (editProfile.ok && userData) {
			const { email: newEmail } = getValues();

			if (userData.me.email !== newEmail) {
				client.writeFragment({
					id: `User:${userData.me.id}`,
					fragment: gql`
						fragment EditedUser on User {
							verified
							email
						}
					`,
					data: {
						email: newEmail,
						verified: false,
					},
				});
			}
		} else {
			alert(editProfile.error);
		}
	};

	const [editProfile, { loading }] = useMutation(EDIT_PROFILE_MUTATION, {
		onCompleted,
	});

	const onSubmit: SubmitHandler<IFormProps> = ({ email, password }) => {
		editProfile({
			variables: {
				input: {
					email,
					...(password !== '' && { password }),
				},
			},
		});
	};

	return (
		<div className='mt-52 flex flex-col justify-center items-center'>
			<Helmet>
				<title>Edit Profile | Uber Eats</title>
			</Helmet>
			<h4 className='font-semibold text-2xl mb-3'>Edit Profile</h4>
			<form noValidate onSubmit={handleSubmit(onSubmit)} className='grid max-w-screen-sm gap-3 mt-5 w-full mb-5'>
				<input
					className='input'
					placeholder='email'
					type='email'
					{...register('email', {
                        required: 'Email is required',
						pattern:
							/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
					})}
				/>
				<input className='input' placeholder='password' type='password' {...register('password')} />
				<Button canClick={isValid} loading={loading} actionText='Save Profile' />
			</form>
		</div>
	);
};
