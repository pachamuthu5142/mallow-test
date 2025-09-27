import React from "react";
import { CreditCard as Edit, Trash2 } from "lucide-react";
import { User } from "../types";
import Button from "./ui/Button";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 group relative">
      <div className="flex flex-col items-center space-x-4">
        <img
          src={user.avatar}
          alt={`${user.first_name} ${user.last_name}`}
          className="w-24 h-24 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=3b82f6&color=fff`;
          }}
        />
        <h3 className="text-2xl font-semibold text-gray-900">
          {user.first_name} {user.last_name}
        </h3>
        <p className="text-xl text-gray-400 hover:text-gray-600 transition-colors duration-200">
          {user.email}
        </p>
      </div>

      <div className="flex justify-center items-center space-x-2 mt-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute h-full w-full bottom-0 left-0 bg-white bg-opacity-75 rounded-lg p-6">
        <Button
          size="sm"
          onClick={() => onEdit(user)}
          className="flex items-center space-x-1 h-fit"
          style={{
            borderRadius: "50px",
            padding: "1.3rem",
          }}
        >
          <Edit size={16} />
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(user)}
          className="flex items-center space-x-1 h-fit"
          style={{
            borderRadius: "50px",
            padding: "1.3rem",
          }}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
