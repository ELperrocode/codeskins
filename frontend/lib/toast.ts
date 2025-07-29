import { toast } from 'sonner';

// Toast types for different scenarios
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

// Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: 'var(--background)',
    color: 'var(--foreground)',
    border: '1px solid var(--border)',
  },
};

// Success toasts
export const showSuccess = (message: string, title?: string) => {
  toast.success(title || 'Success', {
    description: message,
    ...toastConfig,
  });
};

// Error toasts
export const showError = (message: string, title?: string) => {
  toast.error(title || 'Error', {
    description: message,
    ...toastConfig,
    duration: 6000, // Longer duration for errors
  });
};

// Warning toasts
export const showWarning = (message: string, title?: string) => {
  toast.warning(title || 'Warning', {
    description: message,
    ...toastConfig,
  });
};

// Info toasts
export const showInfo = (message: string, title?: string) => {
  toast.info(title || 'Info', {
    description: message,
    ...toastConfig,
  });
};

// Loading toasts (returns a promise that resolves when dismissed)
export const showLoading = (message: string, title?: string) => {
  return toast.promise(
    new Promise((resolve) => {
      // This will be resolved by the calling function
      setTimeout(resolve, 100);
    }),
    {
      loading: title || 'Loading...',
      success: message,
      error: 'Something went wrong',
    }
  );
};

// API response handler
export const handleApiResponse = (
  response: { success: boolean; message: string; data?: any },
  successMessage?: string,
  errorTitle?: string
) => {
  if (response.success) {
    showSuccess(successMessage || response.message || 'Operation completed successfully');
    return true;
  } else {
    showError(response.message || 'An error occurred', errorTitle);
    return false;
  }
};

// Network error handler
export const handleNetworkError = (error: any, customMessage?: string) => {
  console.error('Network error:', error);
  
  let message = customMessage || 'Network error occurred';
  
  if (error?.message) {
    if (error.message.includes('fetch')) {
      message = 'Unable to connect to server. Please check your internet connection.';
    } else if (error.message.includes('401')) {
      message = 'You are not authorized to perform this action. Please log in again.';
    } else if (error.message.includes('403')) {
      message = 'You do not have permission to perform this action.';
    } else if (error.message.includes('404')) {
      message = 'The requested resource was not found.';
    } else if (error.message.includes('500')) {
      message = 'Server error occurred. Please try again later.';
    } else {
      message = error.message;
    }
  }
  
  showError(message, 'Connection Error');
};

// Validation error handler
export const handleValidationError = (errors: any) => {
  if (typeof errors === 'string') {
    showError(errors, 'Validation Error');
    return;
  }
  
  if (Array.isArray(errors)) {
    errors.forEach(error => {
      showError(error, 'Validation Error');
    });
    return;
  }
  
  if (typeof errors === 'object') {
    Object.values(errors).forEach(error => {
      if (error) {
        showError(error as string, 'Validation Error');
      }
    });
    return;
  }
  
  showError('Please check your input and try again.', 'Validation Error');
};

// Cart-specific toasts
export const showCartSuccess = (templateName: string) => {
  showSuccess(`${templateName} has been added to your cart!`, 'Added to Cart');
};

export const showCartError = (message: string) => {
  showError(message, 'Cart Error');
};

export const showCartUpdate = (message: string) => {
  showInfo(message, 'Cart Updated');
};

// Auth-specific toasts
export const showLoginSuccess = (username: string) => {
  showSuccess(`Welcome back, ${username}!`, 'Login Successful');
};

export const showLoginError = (message: string) => {
  showError(message, 'Login Failed');
};

export const showLogoutSuccess = () => {
  showInfo('You have been logged out successfully.', 'Logout Successful');
};

export const showRegisterSuccess = (username: string) => {
  showSuccess(`Account created successfully! Welcome, ${username}!`, 'Registration Successful');
};

export const showRegisterError = (message: string) => {
  showError(message, 'Registration Failed');
};

// Template-specific toasts
export const showTemplateCreated = (templateName: string) => {
  showSuccess(`${templateName} has been created successfully!`, 'Template Created');
};

export const showTemplateUpdated = (templateName: string) => {
  showSuccess(`${templateName} has been updated successfully!`, 'Template Updated');
};

export const showTemplateDeleted = (templateName: string) => {
  showSuccess(`${templateName} has been deleted successfully!`, 'Template Deleted');
};

export const showTemplateError = (message: string) => {
  showError(message, 'Template Error');
};

// Download-specific toasts
export const showDownloadSuccess = (templateName: string) => {
  showSuccess(`${templateName} is ready for download!`, 'Download Ready');
};

export const showDownloadError = (message: string) => {
  showError(message, 'Download Error');
};

export const showDownloadLimitReached = (templateName: string, maxDownloads: number) => {
  showWarning(
    `You've reached the download limit for ${templateName} (${maxDownloads} downloads).`,
    'Download Limit Reached'
  );
};

// Payment-specific toasts
export const showPaymentSuccess = (amount: string) => {
  showSuccess(`Payment of ${amount} completed successfully!`, 'Payment Successful');
};

export const showPaymentError = (message: string) => {
  showError(message, 'Payment Failed');
};

// Generic operation toasts
export const showOperationSuccess = (operation: string) => {
  showSuccess(`${operation} completed successfully!`, 'Success');
};

export const showOperationError = (operation: string, message?: string) => {
  showError(message || `${operation} failed. Please try again.`, 'Operation Failed');
};

// Confirmation toasts
export const showConfirmAction = (message: string, onConfirm: () => void) => {
  toast(message, {
    action: {
      label: 'Confirm',
      onClick: onConfirm,
    },
    cancel: {
      label: 'Cancel',
      onClick: () => {},
    },
    ...toastConfig,
  });
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Export the toast instance for custom usage
export { toast }; 