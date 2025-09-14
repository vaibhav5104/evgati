import React from 'react';
import Modal from './Modal';
import Button from '../ui/Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const footer = (
    <div className="flex space-x-2 w-full">
      <Button 
        variant="secondary" 
        onClick={onClose} 
        className="flex-1"
      >
        {cancelText}
      </Button>
      <Button 
        variant={variant} 
        onClick={handleConfirm} 
        className="flex-1"
      >
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
    >
      <div className="flex items-center space-x-4">
        <div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-12 w-12 ${
              variant === 'danger' 
                ? 'text-red-500' 
                : variant === 'warning' 
                  ? 'text-yellow-500' 
                  : 'text-blue-500'
            }`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 011 1v3a1 1 0 11-2 0V6a1 1 0 011-1z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

