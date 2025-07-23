# 🚀 NestJS Enterprise Template

A production-ready NestJS template with modern architecture patterns, robust authentication, and comprehensive API documentation. This template follows enterprise-grade best practices and can be used as a foundation for building scalable backend applications.

## ✨ Features

### 🏗️ **Architecture & Patterns**

- **Repository Pattern** - Clean data access layer with TypeORM
- **Result Pattern** - Structured error handling and service responses
- **DTO Validation** - Request/response validation with class-validator
- **Dependency Injection** - NestJS IoC container for loose coupling
- **Modular Structure** - Feature-based module organization

### 🔐 **Authentication & Security**

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with configurable salt rounds
- **Role-Based Access Control** - Guards and decorators for permissions
- **Protected Routes** - Automatic JWT validation for secured endpoints

### 📊 **Database & ORM**

- **TypeORM Integration** - Full-featured ORM with PostgreSQL
- **Entity Relationships** - Proper database modeling
- **Migrations** - Database schema versioning
- **Connection Pooling** - Optimized database connections

### 📚 **API Documentation**

- **Swagger/OpenAPI** - Interactive API documentation
- **Request/Response Schemas** - Detailed endpoint documentation
- **Authentication Examples** - JWT bearer token examples
- **Try It Out** - Built-in API testing interface

### 🛡️ **Error Handling & Validation**

- **Global Exception Filter** - Centralized error handling
- **Custom Exceptions** - Domain-specific error types
- **Input Validation** - Automatic request validation
- **Structured Responses** - Consistent API response format

### 🏥 **Health Monitoring**

- **Simple Health Check** - Basic application status endpoint
- **Uptime Tracking** - Application runtime information
- **Environment Info** - Development/production environment details

## 🛠️ **Technology Stack**

| Category            | Technology       |
| ------------------- | ---------------- |
| **Framework**       | NestJS (Node.js) |
| **Language**        | TypeScript       |
| **Database**        | PostgreSQL       |
| **ORM**             | TypeORM          |
| **Authentication**  | JWT + Bcrypt     |
| **Validation**      | class-validator  |
| **Documentation**   | Swagger/OpenAPI  |
| **Package Manager** | npm              |

## 📁 **Project Structure**

```
src/
├── common/                 # Shared utilities and components
│   ├── decorators/        # Custom decorators (roles, user, etc.)
│   ├── dto/              # Base DTOs and response models
│   ├── entities/         # Base entities
│   ├── enums/            # Application enums
│   ├── exceptions/       # Custom exception classes
│   ├── filters/          # Global exception filters
│   ├── guards/           # Authentication and authorization guards
│   ├── interfaces/       # TypeScript interfaces
│   ├── repositories/     # Base repository patterns
│   └── types/            # Custom types and result patterns
├── config/                # Configuration files
│   ├── database.config.ts # Database connection config
│   ├── jwt.config.ts     # JWT configuration
│   └── swagger.config.ts  # API documentation config
├── modules/               # Feature modules
│   ├── auth/             # Authentication module
│   │   ├── dto/          # Login/register DTOs
│   │   ├── strategies/   # JWT strategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   └── users/            # User management module
│       ├── dto/          # User DTOs
│       ├── entities/     # User entity
│       ├── repositories/ # User repository
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── users.module.ts
├── shared/               # Shared services
│   └── health/           # Health check module
└── main.ts              # Application entry point
```

## 🚀 **Quick Start**

### 1. **Clone the Template**

```bash
git clone <this-repository> my-new-project
cd my-new-project
rm -rf .git  # Remove git history to start fresh
git init     # Initialize new git repository
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Environment Setup**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h

# Application
NODE_ENV=development
PORT=3000
```

### 4. **Database Setup**

```bash
# Start PostgreSQL (using Docker)
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# Or use the provided docker-compose
docker-compose up -d
```

### 5. **Run the Application**

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### 6. **Access the Application**

- **API Base URL**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health

## 🔄 **Template Reusability**

This template is designed to be reused for multiple projects. Here's how to customize it:

### **1. Project Customization**

```bash
# Update package.json
npm pkg set name="your-project-name"
npm pkg set description="Your project description"
npm pkg set version="1.0.0"

# Update main files
# - Update src/config/swagger.config.ts with your API info
# - Modify src/main.ts if needed
# - Update docker-compose.yml database names
```

### **2. Add New Features**

```bash
# Generate new module
nest generate module features/products
nest generate controller features/products
nest generate service features/products

# Generate DTOs
nest generate class features/products/dto/create-product.dto --no-spec
```

### **3. Database Customization**

```bash
# Generate new entity
nest generate class features/products/entities/product.entity --no-spec

# Generate migration
npm run migration:generate -- src/database/migrations/CreateProducts

# Run migration
npm run migration:run
```

### **4. Authentication Customization**

- **Add new roles**: Update `src/common/enums/user-role.enum.ts`
- **Add permissions**: Update `src/common/enums/permissions.enum.ts`
- **Modify JWT payload**: Update `src/modules/auth/auth.service.ts`

## 🔐 **Authentication Flow**

### **Registration**

```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### **Login**

```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### **Using Protected Endpoints**

```bash
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

## 🧪 **Testing**

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📦 **Available Scripts**

```bash
npm run start          # Start the application
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debug mode
npm run start:prod     # Start production build

npm run build          # Build the application
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint

npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run end-to-end tests

npm run migration:generate  # Generate new migration
npm run migration:run       # Run pending migrations
```

## 🔧 **Customization Guide**

### **Adding New Modules**

1. Create module structure under `src/modules/`
2. Follow the existing pattern (controller, service, module, DTOs, entities)
3. Import the new module in `src/app.module.ts`
4. Add Swagger tags in `src/config/swagger.config.ts`

### **Database Changes**

1. Modify entities in `src/modules/*/entities/`
2. Generate migrations: `npm run migration:generate`
3. Run migrations: `npm run migration:run`

### **Adding Authentication to New Routes**

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
async protectedEndpoint() {
  // Your protected logic here
}
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 **License**

This template is open source and available under the [MIT License](LICENSE).

## 🆘 **Support**

If you encounter any issues or have questions:

1. Check the [NestJS Documentation](https://docs.nestjs.com)
2. Review the Swagger API docs at `/api/docs`
3. Check existing issues or create a new one
4. Refer to the TypeORM [documentation](https://typeorm.io)

---

**Happy coding! 🎉**

Built with ❤️ using NestJS, TypeScript, and modern development practices.
