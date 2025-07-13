# CodeSkins - Web Template Marketplace

A modern web template marketplace built with Next.js, Fastify, MongoDB, and Stripe payments.

## 🚀 Features

- **Authentication System**: JWT-based auth with role-based access (Customer, Seller, Admin)
- **Template Management**: Upload, manage, and sell web templates
- **Payment Processing**: Stripe integration for secure payments
- **Responsive Design**: Modern UI with TailwindCSS and yellow theme
- **Real-time Updates**: WebSocket support for live notifications
- **Testing**: Comprehensive test suite with Jest and Playwright

## 🏗️ Architecture

```
codeskins/
├── frontend/          # Next.js 14 React app
├── backend/           # Fastify API server
├── shared/            # Shared types and utilities
├── docker/            # Docker configurations
├── nginx/             # Nginx reverse proxy
├── scripts/           # Build and deployment scripts
└── e2e/              # End-to-end tests
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Radix UI** - Accessible components
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Fastify** - High-performance web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy
- **Jest** - Testing framework
- **Playwright** - E2E testing

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose
- MongoDB (or use Docker)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codeskins
   ```

2. **Install dependencies**
   ```bash
   pnpm install:all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development environment**
   ```bash
   # Start backend and MongoDB in Docker
   pnpm docker:up
   
   # Start frontend locally (for hot reload)
   cd frontend && pnpm dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pnpm --filter backend test

# Run tests in watch mode
pnpm --filter backend test:watch

# Generate coverage report
pnpm --filter backend test:coverage
```

### Frontend Tests
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

### All Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage reports
pnpm test:coverage
```

## 🚀 Development

### Available Scripts

#### Root Level
```bash
pnpm dev              # Start both frontend and backend in development
pnpm build            # Build both frontend and backend
pnpm start            # Start both frontend and backend in production
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage reports
pnpm test:e2e         # Run E2E tests
pnpm lint             # Lint all code
pnpm type-check       # Type check all code
```

#### Frontend
```bash
cd frontend
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests
pnpm lint             # Lint code
```

#### Backend
```bash
cd backend
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests
pnpm lint             # Lint code
```

### Docker Commands
```bash
pnpm docker:up        # Start all services
pnpm docker:down      # Stop all services
pnpm docker:build     # Build all images
pnpm docker:logs      # View logs
```

## 📁 Project Structure

### Frontend Structure
```
frontend/
├── app/              # Next.js 14 app directory
│   ├── (auth)/       # Authentication pages
│   ├── dashboard/    # Dashboard pages
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── auth/        # Authentication components
├── lib/             # Utilities and configurations
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── __tests__/       # Test files
└── e2e/            # End-to-end tests
```

### Backend Structure
```
backend/
├── src/
│   ├── config/      # Configuration files
│   ├── controllers/ # Route controllers
│   ├── middleware/  # Custom middleware
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── services/    # Business logic
│   ├── utils/       # Utility functions
│   ├── validators/  # Request validation
│   └── errors/      # Error handling
├── tests/           # Test files
└── dist/           # Build output
```

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Database
MONGODB_URI=mongodb://admin:password123@localhost:27017/codeskins?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 🚀 Deployment

### Production Build
```bash
# Build all applications
pnpm build

# Start production servers
pnpm start
```

### Docker Deployment
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

### Template Endpoints
- `GET /api/templates` - List all templates
- `POST /api/templates` - Create new template (Seller/Admin)
- `GET /api/templates/:id` - Get template details
- `PUT /api/templates/:id` - Update template (Owner/Admin)
- `DELETE /api/templates/:id` - Delete template (Owner/Admin)

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@codeskins.com or create an issue in the repository.
