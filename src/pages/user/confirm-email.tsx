import { gql, useApolloClient, useMutation } from '@apollo/client';
import { graphql } from '../../gql';
import { VerifyEmailMutation } from '../../gql/graphql';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMe } from '../../hooks/useMe';

const VERIFY_EMAIL_MUTATION = graphql(`
	mutation verifyEmail($input: VerifyEmailInput!) {
		verifyEmail(input: $input) {
			ok
			error
		}
	}
`);

export const ConfirmEmail = () => {	
	const navigate = useNavigate();
	const client = useApolloClient();
	const { data: userData } = useMe();

	const onCompleted = (data: VerifyEmailMutation) => {
		const {
			verifyEmail: { ok, error },
		} = data;

		// Un fragment es un pedazo de un type al cual accedo mediante su id
		// id = User es el tipo de los datos devueltos: id del usuario
		// lo puedo ver en apollo tooling en la pestaña cache
		if (ok && userData?.me.id) {
			client.writeFragment({
				id: `User:${userData.me.id}`,
				fragment: gql`
					fragment VerifiedUser on User {
						verified
					}
				`,
				data: {
					verified: true,
				},
			});

			navigate('/');
		}else{
            alert(error);
        }
	};

	const [verifyEmail] = useMutation(VERIFY_EMAIL_MUTATION, {
		onCompleted,
	});

	const [searchParam] = useSearchParams();

	useEffect(() => {
		
		const code = searchParam.get('code');

		if (code) {
			verifyEmail({
				variables: {
					input: {
						code,
					},
				},
			});
		}
	}, []);

	return (
		<div className='mt-52 flex flex-col items-center justify-center'>
			<Helmet>
				<title>Verify Email | Uber Eats</title>
			</Helmet>
			<h2 className='text-lg mb-1 font-medium'>Confirming email...</h2>
			<h4 className='text-gray-700 text-sm'>{"Please wait, don't close this page..."}</h4>
		</div>
	);
};
