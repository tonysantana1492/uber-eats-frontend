import { FC } from 'react';

import { useMe } from '../hooks/useMe';
import nuberLogo from '../images/logo.svg';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export const Header: FC = () => {
	const { data } = useMe();

	return (
		<>
			{!data?.me.verified && (
				<div className='bg-red-500 p-3 text-center text-base text-white'>
					<span>Please verify your email.</span>
				</div>
			)}
			<header className='py-4'>
				<div className='w-full px-5 xl:px-2 max-w-screen-xl mx-auto flex justify-between items-center'>
					<Link to='/'>
						<img src={nuberLogo} className='w-44' alt='Uber Eats' />
					</Link>
					<span className='text-xs'>
						<Link to='/edit-profile'>
							<FontAwesomeIcon icon={faUser} className='text-2xl' />
						</Link>
					</span>
				</div>
			</header>
		</>
	);
};
