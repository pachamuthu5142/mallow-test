import React from 'react';
import { CreditCard as Edit, Trash2 } from 'lucide-react';
import { User } from '../types';
import Button from './ui/Button';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={`${user.first_name} ${user.last_name}`}
          className="w-16 h-16 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=3b82f6&color=fff`;
          }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            {user.email}
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
        <Button
          size="sm"
          onClick={() => onEdit(user)}
          className="flex items-center space-x-1"
        >
          <Edit size={16} />
          <span>Edit</span>
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(user)}
          className="flex items-center space-x-1"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
};

export default UserCard;