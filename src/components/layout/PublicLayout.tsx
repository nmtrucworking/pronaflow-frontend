import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
	return (
		<div className="token-page-shell min-h-screen">
			<main className="min-h-screen">
				<Outlet />
			</main>
		</div>
	);
};
