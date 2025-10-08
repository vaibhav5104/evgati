# EvGati Frontend

A modern React application for electric vehicle charging station booking and management.

## 🚀 Features

- **User Authentication**: Register, login with email/password or Google OAuth
- **Station Discovery**: Find and browse charging stations with map view
- **Booking System**: Reserve charging slots and manage bookings
- **Real-time Updates**: Live status updates for stations and bookings
- **Role-based Access**: Different interfaces for users, station owners, and admins
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## 🏗️ Architecture

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── booking/        # Booking-related components
│   ├── common/         # Common shared components
│   ├── station/        # Station-related components
│   ├── admin/          # Admin panel components
│   ├── owner/          # Owner dashboard components
│   ├── comment/        # Comment system components
│   └── ui/             # Base UI components
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   └── owner/          # Owner pages
├── layouts/            # Layout components
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── context/            # React context providers
├── utils/              # Utility functions and constants
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

### Key Technologies

- **React 18**: Modern React with hooks and concurrent features
- **React Router v6**: Client-side routing with nested routes
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API requests
- **React Leaflet**: Interactive maps for station locations
- **React Toastify**: Toast notifications
- **Google OAuth**: Social authentication

## 🛠️ Development

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses Prettier for code formatting and ESLint for linting. Configuration files:

- `.prettierrc` - Prettier configuration
- `eslint.config.js` - ESLint configuration

## 🎨 UI Components

### Base Components (`components/ui/`)

- **Button**: Configurable button with variants and sizes
- **Input**: Form input with validation states
- **Card**: Container component with header/footer
- **Badge**: Status indicators and labels
- **Modal**: Modal dialogs and overlays

### Feature Components

- **StationCard**: Display station information
- **StationMap**: Interactive map with station markers
- **ProtectedRoute**: Route protection with role checks
- **LoadingSpinner**: Loading states

## 🔐 Authentication

The app supports multiple authentication methods:

1. **Email/Password**: Standard registration and login
2. **Google OAuth**: Social login integration

User roles:
- **User**: Can browse and book charging stations
- **Owner**: Can manage their own stations and bookings
- **Admin**: Full platform administration access

## 🗺️ Routing

The application uses nested routing with different layouts:

- **MainLayout**: Public pages (home, stations)
- **AuthLayout**: Authentication pages (login, register)  
- **DashboardLayout**: Protected user pages

Route protection is handled by the `ProtectedRoute` component with role-based access control.

## 📱 Responsive Design

The UI is built mobile-first with responsive breakpoints:

- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+

## 🚦 State Management

The application uses React Context for global state:

- **AuthContext**: User authentication and profile data
- **React Router**: URL and navigation state
- **Component State**: Local component state with hooks

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL`: Backend API base URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `VITE_APP_NAME`: Application name

### Tailwind Configuration

Custom theme extensions in `tailwind.config.js`:
- Custom color palette
- Extended spacing scale
- Custom animations
- Component-specific styling

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Environment Setup

Ensure production environment variables are configured:

```env
VITE_API_URL=https://your-api.com
VITE_GOOGLE_CLIENT_ID=your-production-client-id
```

## 🧪 Testing

Testing setup and guidelines:

- Unit tests: Component testing with React Testing Library
- Integration tests: Page-level functionality testing
- E2E tests: Full user journey testing

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: support@evgati.com
- GitHub Issues: [Create an issue](https://github.com/your-org/evgati-frontend/issues)
