import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserDropdown from './UserDropdown';

const Navigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-transparent py-6 fixed w-full z-50 top-0 backdrop-blur-lg bg-gray-900/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              HealthAI
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
