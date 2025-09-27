import React from 'react';
import { LogOut } from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">Elon Musk</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut size={16} />  
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;