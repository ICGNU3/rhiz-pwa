# Rhiz - Intelligent Relationship Engine

> **Contributing?** Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for our feature-branch workflow, testing, and code quality guidelines.

## Branching Model (Summary)
- **main**: Integration branch for all features. Only merge tested, stable features here.
- **feature/relationship-tracking**: Relationship tracking features (health scoring, behavioral tracking, contextual suggestions, etc.)
- **feature/auth-profiles**: User authentication and profile management (OAuth, onboarding, upgrade prompts, etc.)
- **feature/contact-management**: Contact management features (bulk ops, templates, advanced search, etc.)
- **feature/analytics-intelligence**: Analytics and intelligence features (network analytics, AI suggestions, etc.)
- **feature/pwa-infra**: PWA, performance, and infrastructure improvements (code splitting, offline support, security, etc.)

> Transform your scattered contacts into an intelligent relationship engine with trust scores, goal-driven matching, and AI assistance.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50.2-green.svg)](https://supabase.com/)

## 🚀 Features

### Core Functionality
- **Contact Management** - Intelligent contact storage with trust scoring
- **Goal Tracking** - Set and track relationship-based goals
- **Network Visualization** - Interactive relationship graph
- **AI Assistant** - Intelligent insights and recommendations
- **Trust Analytics** - Relationship strength and engagement tracking
- **Settings Management** - Comprehensive user preferences

### Technical Features
- **Progressive Web App (PWA)** - Installable, offline-capable
- **Real-time Updates** - Live data synchronization
- **Responsive Design** - Mobile-first approach
- **TypeScript** - Full type safety
- **Modern Stack** - React 18, Vite, Tailwind CSS
- **Supabase Backend** - Authentication, database, real-time

## 📋 Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Supabase Account** (free tier works)
- **Git**

## 🛠️ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/rhiz-pwa.git
cd rhiz-pwa
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the Supabase migrations:
```bash
npx supabase db push
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 🏗️ Project Structure

```
rhiz-pwa/
├── src/
│   ├── api/              # API functions and Supabase client
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base UI components
│   │   ├── contacts/    # Contact-specific components
│   │   ├── goals/       # Goal-specific components
│   │   └── ...
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── supabase/
│   ├── functions/       # Edge functions
│   └── migrations/      # Database migrations
├── public/              # Static assets
└── dev-dist/            # PWA service worker files
```

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run analyze` - Analyze bundle size

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_APP_ENV` | Environment (development/production) | No |
| `VITE_APP_VERSION` | App version for tracking | No |

### PWA Configuration

The app is configured as a Progressive Web App with:
- Service worker for offline functionality
- Web app manifest for installability
- Automatic updates
- Background sync capabilities

## 🗄️ Database Schema

### Core Tables
- **contacts** - User contact information with trust scores
- **goals** - User goals and objectives
- **user_settings** - User preferences and configuration
- **user_activities** - Activity log for dashboard
- **ai_chat_history** - AI assistant conversation history
- **trust_insights** - Trust score calculations and history

### Security
- Row Level Security (RLS) enabled on all tables
- User-specific data access policies
- Secure authentication via Supabase Auth

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 📱 PWA Features

- **Installable** - Add to home screen
- **Offline Support** - Basic offline functionality
- **Push Notifications** - Real-time updates (coming soon)
- **Background Sync** - Data synchronization
- **App-like Experience** - Native feel

## 🔒 Security

- **Authentication** - Supabase Auth with email/password
- **Authorization** - Row Level Security policies
- **Data Validation** - Input sanitization and validation
- **HTTPS Only** - Secure connections required
- **CORS Protection** - Cross-origin request protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Follow the existing code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation** - [Wiki](https://github.com/your-org/rhiz-pwa/wiki)
- **Issues** - [GitHub Issues](https://github.com/your-org/rhiz-pwa/issues)
- **Discussions** - [GitHub Discussions](https://github.com/your-org/rhiz-pwa/discussions)
- **Email** - support@rhiz.com

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Core contact management
- [x] Goal tracking
- [x] Basic AI assistant
- [x] PWA functionality
- [ ] Search functionality
- [ ] Real-time notifications

### Phase 2 (Next)
- [ ] Advanced analytics
- [ ] Team collaboration
- [ ] Calendar integration
- [ ] Email templates
- [ ] Mobile app

### Phase 3 (Future)
- [ ] Enterprise features
- [ ] Advanced AI insights
- [ ] Marketplace integrations
- [ ] White-label options

---

**Built with ❤️ by the Rhiz Team**
