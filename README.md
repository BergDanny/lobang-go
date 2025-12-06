# Lobang Go 🎮

A modern campus quest platform where students can post and accept quests for errands, deliveries, and help around campus. Earn XP, complete quests, and help your fellow students!

![Lobang Go Banner](./frontend/src/assets/hero-sprite.png)

## 🌟 Features

### For Quest Posters (Clients)
- **Post Quests**: Create quests with details, rewards, and deadlines
- **Track Progress**: Monitor quest status and completion
- **Earn Credits**: Use credits for future quests or services
- **Rate Runners**: Provide feedback on quest completion

### For Quest Runners (Heroes)
- **Accept Quests**: Browse and accept available quests
- **Earn XP & Credits**: Gain experience points and rewards
- **Build Reputation**: Complete quests to improve your hero rating
- **Flexible Schedule**: Choose quests that fit your availability

### Platform Features
- **Real-time Dashboard**: Overview of active quests, earnings, and progress
- **Quest Categories**: Delivery, Queue management, Printing, and more
- **Secure Authentication**: JWT-based authentication with Laravel Sanctum
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Pixel Art Theme**: Retro gaming aesthetic with modern functionality

## 🏗️ Architecture

This application follows a modern full-stack architecture:

```
├── 🖥️  Frontend (React + TypeScript)
│   ├── React 18 with Vite
│   ├── TypeScript for type safety
│   ├── Zustand for state management
│   ├── React Query for data fetching
│   ├── Radix UI + Tailwind CSS for styling
│   └── Pixel art theme with custom components
│
└── 🔧 Backend (Laravel + PHP)
    ├── Laravel 11 framework
    ├── Laravel Sanctum for authentication
    ├── Spatie Laravel Permission for role management
    ├── RESTful API with proper validation
    └── Database migrations and seeders
```

## 🚀 Quick Start

### Prerequisites

- **PHP 8.2+** with Composer
- **Node.js 18+** with npm
- **MySQL 8.0+** or compatible database
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/lobang-go.git
cd lobang-go
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=lobang_go
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations and seeders
php artisan migrate:fresh --seed

# Start the Laravel development server
php artisan serve
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install Node.js dependencies
npm install

# Create environment file (if not exists)
echo "VITE_API_BASE_URL=http://localhost:8000/api/v1" > .env

# Start the Vite development server
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## 📁 Project Structure

```
lobang-go/
├── backend/                    # Laravel Backend API
│   ├── app/
│   │   ├── Http/Controllers/   # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   ├── Policies/          # Authorization Policies
│   │   └── Providers/         # Service Providers
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/          # Database Seeders
│   ├── routes/api.php         # API Routes
│   └── composer.json          # PHP Dependencies
│
├── frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── components/        # Reusable UI Components
│   │   ├── pages/            # Page Components
│   │   ├── store/            # Zustand State Management
│   │   ├── services/         # API Service Functions
│   │   ├── types/            # TypeScript Type Definitions
│   │   ├── lib/              # Utility Functions
│   │   └── assets/           # Images and Icons
│   ├── package.json           # Node.js Dependencies
│   └── vite.config.ts         # Vite Configuration
│
└── README.md                  # Project Documentation
```

## 🎯 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `DELETE /api/v1/auth/logout` - User logout

### Quests
- `GET /api/v1/quests` - List all quests
- `POST /api/v1/quests` - Create new quest
- `GET /api/v1/quests/{id}` - Get quest details
- `PUT /api/v1/quests/{id}` - Update quest
- `DELETE /api/v1/quests/{id}` - Delete quest
- `GET /api/v1/quests/posted` - User's posted quests
- `GET /api/v1/quests/taken` - User's taken quests

## 🗄️ Database Schema

### Users Table
- `id` - Primary key (UUID)
- `name` - User's display name
- `email` - Email address (unique)
- `password` - Hashed password
- `created_at`, `updated_at` - Timestamps

### Quests Table
- `id` - Primary key (UUID)
- `title` - Quest title
- `description` - Quest description
- `category` - Quest category (delivery, queue, printing, etc.)
- `location_from` - Pickup location (nullable)
- `location_to` - Delivery destination
- `bounty` - Reward amount
- `deadline` - Completion deadline
- `status` - Quest status (open, in_progress, completed)
- `poster_id` - Foreign key to users (quest creator)
- `runner_id` - Foreign key to users (quest accepter)
- `created_at`, `updated_at` - Timestamps

## 🔐 Authentication & Authorization

The application uses **Laravel Sanctum** for API authentication:

- **Token-based authentication** with Bearer tokens
- **Protected routes** require authentication
- **Role-based permissions** using Spatie Laravel Permission
- **Secure password hashing** with bcrypt

## 🎨 Frontend Features

### UI Components
- **Pixel Art Theme**: Custom CSS with retro gaming aesthetics
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Hover effects, animations, and transitions
- **Form Validation**: React Hook Form with Zod schemas

### State Management
- **Zustand Stores**: Lightweight state management for auth and quests
- **React Query**: Efficient data fetching and caching
- **Optimistic Updates**: Immediate UI feedback for user actions

### Key Pages
- **Dashboard**: Overview of quests, activities, and insights
- **Quest Board**: Browse and filter available quests
- **Quest Details**: Complete quest information and actions
- **Post Quest**: Form to create new quests
- **Profile**: User stats, achievements, and settings

## 🧪 Testing

### Backend Testing
```bash
cd backend
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 🚢 Deployment

### Backend Deployment
1. Configure production environment variables
2. Run database migrations
3. Set up web server (Apache/Nginx) with PHP-FPM
4. Configure SSL certificates
5. Set up process manager (Supervisor) for queues

### Frontend Deployment
1. Build the production bundle:
```bash
cd frontend
npm run build
```
2. Serve static files from `dist/` directory
3. Configure reverse proxy for API calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Backend**: Follow PSR-12 standards and Laravel conventions
- **Frontend**: Use ESLint configuration and Prettier formatting
- **Commits**: Use conventional commit format

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Laravel Framework** - The PHP framework that powers the backend
- **React** - The JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide Icons** - Beautiful icon library

## 📞 Support

If you have any questions or need help:

- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the maintainers

---

**Made with ❤️ for the campus community**