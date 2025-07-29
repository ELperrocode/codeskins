# 🎨 CodeSkins - Premium Web Template Marketplace

> **A modern, full-stack web template marketplace** built with Next.js 14, Fastify, MongoDB, and Stripe payments. Designed for developers, designers, and businesses to buy and sell premium website templates.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.0-green?style=for-the-badge&logo=fastify)](https://fastify.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?style=for-the-badge&logo=stripe)](https://stripe.com/)

## 🌟 Features

### 🛒 **E-commerce & Payments**
- **Secure Payment Processing** - Stripe integration with webhook support
- **Shopping Cart System** - Real-time cart management with session persistence
- **Order Management** - Complete order lifecycle with status tracking
- **License System** - Flexible licensing with download limits and usage rights

### 👥 **User Management**
- **Multi-Role Authentication** - Customer, Admin roles with role-based access
- **User Profiles** - Personal information and purchase history
- **Favorites System** - Save and manage favorite templates
- **Download Tracking** - Monitor template usage and download limits

### 🎨 **Template Management**
- **Template Marketplace** - Browse, search, and filter templates
- **Advanced Search** - Category, tags, price range, and keyword search
- **Template Previews** - Multiple preview images and live demo links
- **Review System** - User ratings and verified purchase reviews
- **Admin Dashboard** - Complete template management for administrators

### 🎯 **User Experience**
- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Internationalization** - Multi-language support (English/Spanish)
- **Modern UI/UX** - Beautiful animations with Framer Motion
- **Performance Optimized** - Server-side rendering and image optimization
- **Accessibility** - WCAG compliant with Radix UI components

### 🔧 **Developer Experience**
- **TypeScript** - Full type safety across the stack
- **Monorepo Structure** - Organized with pnpm workspaces
- **Testing Suite** - Jest for unit tests, Playwright for E2E
- **CI/CD Pipeline** - Automated testing and deployment
- **Code Quality** - ESLint, Prettier, and conventional commits

## 🏗️ Architecture

```
codeskins/
├── frontend/                 # Next.js 14 React application
│   ├── app/                 # App Router (Next.js 14)
│   │   ├── [lang]/         # Internationalized routes
│   │   ├── api/            # Next.js API routes
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── templates/     # Template-specific components
│   │   ├── cart/          # Shopping cart components
│   │   └── marketplace/   # Marketplace components
│   ├── lib/               # Utilities and configurations
│   └── types/             # TypeScript definitions
├── backend/                # Fastify API server
│   ├── src/
│   │   ├── config/        # Database and app configuration
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Custom middleware
│   │   └── services/      # Business logic
│   ├── scripts/           # Database scripts and utilities
│   └── tests/             # Backend test suite
├── shared/                 # Shared types and utilities
├── .github/               # CI/CD workflows and templates
└── docker/                # Docker configurations
```

## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and developer experience
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

### **Backend**
- **[Fastify](https://fastify.io/)** - High-performance web framework
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **[JWT](https://jwt.io/)** - Authentication and session management
- **[Stripe](https://stripe.com/)** - Payment processing
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js/)** - Password hashing

### **DevOps & Testing**
- **[Docker](https://www.docker.com/)** - Containerization
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container orchestration
- **[Jest](https://jestjs.io/)** - Testing framework
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipeline
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

## 🚀 Quick Start

### **Prerequisites**
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose
- MongoDB (or use Docker)

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd codeskins
```

### **2. Install Dependencies**
```bash
# Install all dependencies (frontend, backend, shared)
pnpm install:all
```

### **3. Environment Setup**
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
# Required: MongoDB URI, Stripe keys, JWT secret
```

### **4. Start Development Environment**
```bash
# Start backend and MongoDB in Docker
pnpm docker:up

# Start frontend development server
cd frontend && pnpm dev
```

### **5. Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **MongoDB**: localhost:27017

## 📦 Available Scripts

### **Root Level Commands**
```bash
pnpm dev              # Start both frontend and backend in development
pnpm build            # Build both frontend and backend for production
pnpm start            # Start both frontend and backend in production
pnpm test             # Run all tests (backend + frontend)
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage reports
pnpm test:e2e         # Run end-to-end tests
pnpm lint             # Lint all code
pnpm type-check       # Type check all code
pnpm docker:up        # Start all Docker services
pnpm docker:down      # Stop all Docker services
```

### **Frontend Commands**
```bash
cd frontend
pnpm dev              # Start development server (port 3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run unit tests
pnpm test:e2e         # Run Playwright E2E tests
pnpm lint             # Lint code with ESLint
```

### **Backend Commands**
```bash
cd backend
pnpm dev              # Start development server (port 3001)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests with Jest
pnpm lint             # Lint code with ESLint
```

## 🔐 Environment Variables

### **Backend (.env)**
```env
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Database
MONGODB_URI=mongodb://admin:password123@localhost:27017/codeskins?authSource=admin

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SESSION_SECRET=your-session-secret-key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Logging
LOG_LEVEL=info
```

### **Frontend (.env.local)**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 🧪 Testing

### **Backend Testing**
```bash
# Run all backend tests
pnpm --filter backend test

# Run tests in watch mode
pnpm --filter backend test:watch

# Generate coverage report
pnpm --filter backend test:coverage
```

### **Frontend Testing**
```bash
# Run unit tests
pnpm --filter frontend test

# Run tests in watch mode
pnpm --filter frontend test:watch

# Generate coverage report
pnpm --filter frontend test:coverage

# Run E2E tests
pnpm --filter frontend test:e2e
```

### **All Tests**
```bash
# Run complete test suite
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate comprehensive coverage reports
pnpm test:coverage
```

## 📚 API Documentation

### **Authentication Endpoints**
```http
POST /api/auth/register     # Register new user
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user profile
POST /api/auth/logout      # User logout
```

### **Template Endpoints**
```http
GET    /api/templates      # List all templates (with pagination)
POST   /api/templates      # Create new template (Admin only)
GET    /api/templates/:id  # Get template details
PUT    /api/templates/:id  # Update template (Owner/Admin)
DELETE /api/templates/:id  # Delete template (Owner/Admin)
```

### **Cart & Orders**
```http
GET    /api/cart           # Get user cart
POST   /api/cart/add       # Add item to cart
PUT    /api/cart/update    # Update cart item
DELETE /api/cart/remove    # Remove item from cart
DELETE /api/cart/clear     # Clear entire cart

POST   /api/orders         # Create new order
GET    /api/orders         # List user orders
GET    /api/orders/:id     # Get order details
```

### **Stripe Integration**
```http
POST /api/stripe/create-checkout-session  # Create payment session
POST /api/stripe/webhook                  # Handle Stripe webhooks
```

## 🎨 UI Components

### **Core Components**
- **Button** - Primary, secondary, outline, and ghost variants
- **Card** - Content containers with header, content, and footer
- **Input** - Form inputs with validation states
- **Select** - Dropdown select components
- **Modal** - Overlay dialogs and confirmations
- **Pagination** - Page navigation with info display

### **Specialized Components**
- **TemplateCard** - Template preview cards
- **TemplateGallery** - Image gallery with thumbnails
- **CartItem** - Shopping cart item display
- **ReviewSection** - User reviews and ratings
- **HeroParallax** - Landing page hero section

## 🔄 CI/CD Pipeline

### **Automated Workflows**

#### **🧪 CI Pipeline** (`.github/workflows/ci.yml`)
- **Triggered on**: Push to `main`/`develop` branches and Pull Requests
- **Jobs**:
  - **Backend**: Type checking, linting, testing with MongoDB service, and build
  - **Frontend**: Type checking, linting, testing, and build

### **📋 Quality Gates**
- ✅ All tests must pass
- ✅ Linting standards met
- ✅ Type checking successful
- ✅ Build process successful

## 🚀 Deployment

### **Production Build**
```bash
# Build all applications
pnpm build

# Start production servers
pnpm start
```

### **Docker Deployment**
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d
```

### **Environment Variables for Production**
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-mongodb-uri
STRIPE_SECRET_KEY=sk_live_your_production_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-domain.com
```

## 🤝 Contributing

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes following the coding standards
4. **Add** tests for new functionality
5. **Ensure** all tests pass (`pnpm test`)
6. **Run** linting (`pnpm lint`)
7. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
8. **Push** to the branch (`git push origin feature/amazing-feature`)
9. **Open** a Pull Request

### **Code Quality Standards**
- ✅ Follow TypeScript best practices
- ✅ Maintain test coverage above 80%
- ✅ Use conventional commit messages
- ✅ Follow ESLint rules
- ✅ Add JSDoc comments for complex functions
- ✅ Ensure accessibility compliance

### **Conventional Commits**
```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding or updating tests
chore: maintenance tasks
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### **Getting Help**
- 📧 **Email**: support@codeskins.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

### **Documentation**
- 📖 **API Docs**: `/api/docs` (when running)
- 🎨 **Component Library**: See `frontend/components/ui/README.md`
- 🧪 **Testing Guide**: See test files in `backend/tests/` and `frontend/__tests__/`

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Fastify Team** - For the high-performance web framework
- **TailwindCSS** - For the utility-first CSS framework
- **Stripe** - For secure payment processing
- **MongoDB** - For the flexible NoSQL database

---

<div align="center">

**Made with ❤️ by the CodeSkins Team**

[![GitHub stars](https://img.shields.io/github/stars/your-repo/codeskins?style=social)](https://github.com/your-repo/codeskins)
[![GitHub forks](https://img.shields.io/github/forks/your-repo/codeskins?style=social)](https://github.com/your-repo/codeskins)
[![GitHub issues](https://img.shields.io/github/issues/your-repo/codeskins)](https://github.com/your-repo/codeskins/issues)

</div>
