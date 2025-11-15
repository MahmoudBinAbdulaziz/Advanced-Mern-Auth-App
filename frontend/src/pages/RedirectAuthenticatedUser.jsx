import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore.js';
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();
	console.log("RedirectAuthenticatedUser - isAuthenticated:", isAuthenticated);
	console.log("RedirectAuthenticatedUser - user:", user);
	if (isAuthenticated && user?.isVerified && user?.resetPasswordToken == null) {
		return <Navigate to='/' replace />;
	}

	return children;
};

export default RedirectAuthenticatedUser;
