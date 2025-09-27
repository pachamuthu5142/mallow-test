import React, { useEffect, useState } from "react";
import { Grid2x2 as Grid, List, Search, Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchUsers,
  setSearchTerm,
  setCurrentPage,
  deleteUser,
} from "../store/slices/usersSlice";
import { User } from "../types";
import Header from "../components/Layout/Header";
import UserTable from "../components/UserTable";
import UserCard from "../components/UserCard";
import UserModal from "../components/UserModal";
import Pagination from "../components/Pagination";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    users,
    filteredUsers,
    loading,
    error,
    searchTerm,
    currentPage,
    itemsPerPage,
  } = useAppSelector((state) => state.users);

  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);

  useEffect(() => {
    if (users.length === 0) {
      // Load multiple pages to have more data for demonstration
      dispatch(fetchUsers(1));
      dispatch(fetchUsers(2));
    }
  }, [dispatch, users.length]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const clearSearch = () => {
    dispatch(setSearchTerm(""));
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setDeleteConfirm(user);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await dispatch(deleteUser(deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  // Pagination logic for filtered users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
 
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <LoadingSpinner text="Loading users..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
              Users
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Input search text"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <Button
                onClick={handleCreateUser}
                className="flex items-center space-x-2"
              >
                <Plus size={16} className="mr-2" />
                Create User
              </Button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 mb-6">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                viewMode === "table"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <List size={16} />
              <span>Table</span>
            </button>

            <button
              onClick={() => setViewMode("card")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                viewMode === "card"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Grid size={16} />
              <span>Card</span>
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* No Results */}
          {filteredUsers.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            </div>
          )}

          {/* Users List */}
          {filteredUsers.length > 0 && (
            <>
              <div className="rounded-lg overflow-hidden">
                {viewMode === "table" ? (
                  <UserTable
                    users={currentUsers}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentUsers.map((user) => (
                        <UserCard
                          key={user.id}
                          user={user}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {/* User Modal */}
          <UserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={selectedUser}
          />

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                  onClick={() => setDeleteConfirm(null)}
                ></div>

                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Confirm Delete
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete {deleteConfirm.first_name}{" "}
                    {deleteConfirm.last_name}? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="secondary"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
