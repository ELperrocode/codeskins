export const en = {
  auth: {
    login: {
      title: "Welcome back to CodeSkins",
      subtitle: "Sign in to your account",
      username: "Username",
      password: "Password",
      submit: "Sign in",
      loading: "Signing in...",
      error: "Invalid username or password",
      noAccount: "Don't have an account?",
      signUp: "Sign up"
    },
    register: {
      title: "Join CodeSkins",
      subtitle: "Create your account to get started",
      email: "Email address",
      password: "Password",
      confirmPassword: "Confirm Password",
      role: "Account Type",
      customer: "Customer - Buy templates",
      seller: "Seller - Sell templates",
      submit: "Create account",
      loading: "Creating account...",
      error: "Registration failed. Please try again.",
      passwordMismatch: "Passwords do not match",
      hasAccount: "Already have an account?",
      signIn: "Sign in"
    },
    logout: "Logout"
  },
  dashboard: {
    title: "Welcome to CodeSkins Dashboard",
    accountStatus: "Account Status",
    role: "Role",
    memberSince: "Member Since",
    customer: {
      title: "Customer Dashboard",
      description: "Browse and purchase web templates from our marketplace.",
      features: [
        "View available templates",
        "Purchase templates", 
        "Download your purchases",
        "Manage your orders"
      ]
    },
    seller: {
      title: "Seller Dashboard", 
      description: "Upload and manage your web templates for sale.",
      features: [
        "Upload new templates",
        "Manage your listings",
        "View sales analytics", 
        "Process payments"
      ]
    },
    admin: {
      title: "Admin Dashboard",
      description: "Manage the entire CodeSkins marketplace.",
      features: [
        "Manage users",
        "Review templates",
        "Monitor transactions",
        "System settings"
      ]
    }
  },
  errors: {
    generic: "Something went wrong",
    network: "Network error. Please try again.",
    validation: "Please check your input and try again.",
    unauthorized: "You are not authorized to perform this action.",
    notFound: "The requested resource was not found."
  },
  ui: {
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    open: "Open",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    refresh: "Refresh",
    download: "Download",
    upload: "Upload",
    select: "Select",
    required: "Required",
    optional: "Optional"
  }
} as const; 