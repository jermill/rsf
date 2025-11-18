# RSF Fitness - Complete Fitness Management Platform

A modern, full-stack fitness coaching and gym management platform built with React, TypeScript, and Supabase.

## 🎯 Features

### For Members
- 📊 **Personal Dashboard** - Track progress, goals, and workouts
- 🏋️ **Workout Logging** - Log exercises and view history
- 🍽️ **Meal Plans** - Custom nutrition plans with macro tracking
- 📅 **Booking System** - Schedule personal training and services
- 📸 **Progress Gallery** - Before/after photo tracking
- 💪 **Challenges** - Join community fitness challenges
- 💬 **Coach Messaging** - Direct communication with trainers

### For Admins
- 👥 **User Management** - Manage members and roles
- 📅 **Scheduling** - Calendar-based booking management
- 🍽️ **Meal Plan Builder** - Create custom nutrition plans
- 💰 **Financial Tracking** - Revenue analytics and reports
- 🎨 **CMS System** - Full content management without code
- 📝 **Page Builder** - Visual block-based editor
- 🖼️ **Media Library** - Centralized file management
- 🎨 **Theme Customizer** - Brand and design controls

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd RSF
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**

Go to your Supabase SQL Editor and run:
```sql
-- Copy and paste the contents of COMPLETE_BACKEND_SETUP.sql
```

See [BACKEND_SETUP_GUIDE.md](./BACKEND_SETUP_GUIDE.md) for detailed instructions.

5. **Create storage bucket**

In Supabase Dashboard:
- Go to Storage → Create bucket named `public`
- Make it public
- Add storage policies (see BACKEND_SETUP_GUIDE.md)

6. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

### Create Admin Account

1. Sign up through the app
2. Run this SQL in Supabase:
```sql
UPDATE profiles 
SET role = 'superadmin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

See [src/test/README.md](./src/test/README.md) for testing guide.

## 📦 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Recharts** - Data visualization

### Backend
- **Supabase** - PostgreSQL database
- **Supabase Auth** - Authentication
- **Supabase Storage** - File uploads
- **Row Level Security** - Data protection

### Testing
- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **Testing Library User Event** - User interaction testing

## 📁 Project Structure

```
RSF/
├── src/
│   ├── components/        # React components
│   │   ├── admin/        # Admin-only components
│   │   ├── auth/         # Authentication components
│   │   ├── cms/          # CMS block components
│   │   ├── dashboard/    # User dashboard components
│   │   ├── layout/       # Layout components
│   │   ├── sections/     # Page sections
│   │   └── ui/           # Reusable UI components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   │   └── admin/        # Admin pages
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── test/             # Testing utilities
│   └── lib/              # Third-party configs
├── supabase/
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🎨 Subscription Plans

- **Basic** - $99/month - Community access, basic tracking
- **Pro** - $149/month - Personalized plans, priority support
- **Elite** - $249/month - Personal coaching, custom meal plans

## 🔐 Security

- Row Level Security (RLS) on all tables
- Role-based access control (user/admin/superadmin)
- Secure file uploads with validation
- Protected admin routes
- Environment variable protection

## 📚 Documentation

- [Backend Setup Guide](./BACKEND_SETUP_GUIDE.md) - Database and Supabase setup
- [CMS Implementation](./CMS_IMPLEMENTATION_SUMMARY.md) - Content management system
- [CMS User Guide](./CMS_README.md) - How to use the CMS
- [Migrations Overview](./MIGRATIONS_OVERVIEW.md) - Database schema details
- [Netlify Setup](./NETLIFY_SETUP.md) - Deployment guide

## 🚀 Deployment

### Deploy to Netlify

1. **Connect repository** to Netlify
2. **Set build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Add environment variables** in Netlify dashboard
4. **Deploy!**

See [NETLIFY_SETUP.md](./NETLIFY_SETUP.md) for details.

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run build:check  # Type-check and build
npm run preview      # Preview production build
npm run lint         # Lint code
npm test             # Run tests
npm run test:ui      # Tests with UI
npm run test:coverage # Coverage report
```

### Key Dependencies

```json
{
  "@supabase/supabase-js": "^2.39.7",
  "react": "^18.2.0",
  "react-router-dom": "^6.22.2",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^11.0.8",
  "recharts": "^2.12.2"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 🆘 Support

For issues or questions:
1. Check existing documentation
2. Review [BACKEND_SETUP_GUIDE.md](./BACKEND_SETUP_GUIDE.md)
3. Check Supabase logs for backend issues
4. Review browser console for frontend errors

## 🎯 Roadmap

- [x] Core user dashboard
- [x] Admin panel
- [x] Booking system
- [x] Meal planning
- [x] CMS system
- [x] Testing infrastructure
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support

## 📊 Project Stats

- **Lines of Code:** 4,500+
- **Components:** 30+
- **Database Tables:** 25+
- **Admin Features:** 10+
- **User Features:** 15+

---

**Built with ❤️ for RSF Fitness | 2025**

For detailed setup instructions, see [BACKEND_SETUP_GUIDE.md](./BACKEND_SETUP_GUIDE.md)

