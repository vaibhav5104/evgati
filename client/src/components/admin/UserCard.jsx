import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';

const UserCard = ({ 
  user, 
  onUpdateRole, 
  onDeleteUser, 
  className = '' 
}) => {
  const { user: currentUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const roleOptions = [
    { value: 'user', label: 'User', color: 'secondary' },
    { value: 'owner', label: 'Station Owner', color: 'primary' },
    { value: 'admin', label: 'Admin', color: 'danger' }
  ];

  const handleUpdateRole = async () => {
    try {
      await onUpdateRole(user._id, selectedRole);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update user role', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await onDeleteUser(user._id);
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  // Prevent editing/deleting current user or other admins
  const canModify = 
    currentUser.role === 'admin' && 
    currentUser._id !== user._id && 
    user.role !== 'admin';

  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <img 
          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
          alt={user.name} 
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Role</h4>
            <Badge variant={
              user.role === 'admin' ? 'danger' : 
              user.role === 'owner' ? 'primary' : 
              'secondary'
            }>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
          
          {canModify && (
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setIsEditModalOpen(true)}
              >
                Change Role
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => setIsDeleteConfirmOpen(true)}
              >
                Delete User
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">User Stats</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-lg font-semibold">{user.totalBookings || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-sm text-gray-600">Owned Stations</p>
              <p className="text-lg font-semibold">
                {user.role === 'owner' ? (user.ownedStations?.length || 0) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Change User Role"
        footer={
          <div className="flex space-x-2 w-full">
            <Button 
              variant="secondary" 
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleUpdateRole}
              className="flex-1"
            >
              Update Role
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">
            Select a new role for {user.name}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {roleOptions.map(role => (
              <label 
                key={role.value} 
                className={`
                  border rounded-lg p-4 cursor-pointer 
                  ${selectedRole === role.value 
                    ? `bg-${role.color}-50 border-${role.color}-500` 
                    : 'border-gray-200 hover:bg-gray-50'}
                `}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={selectedRole === role.value}
                  onChange={() => setSelectedRole(role.value)}
                  className="hidden"
                />
                <div className="text-center">
                  <Badge variant={role.color}>{role.label}</Badge>
                </div>
              </label>
            ))}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user ${user.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default UserCard;

