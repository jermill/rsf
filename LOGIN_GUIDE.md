# Ready Set Fit - Login Guide

## 🔐 Authentication System Overview

The application now has **THREE login options**:
1. **🚀 Dev Login** - Quick access to test accounts (Development only)
2. **Client Login** - For gym members and clients
3. **Admin Login** - For administrators and staff

---

## 🚀 Dev Login (RECOMMENDED FOR TESTING)

### Access URL
```
http://localhost:5173/dev-login
```

### Quick Access
- **Floating Button**: Look for the purple "Dev Login" button in the bottom-right corner of any page
- Just click it to access the dev login page!

### Features
- ✅ **One-Click Login** - No need to remember credentials
- ✅ **Auto-Account Creation** - Creates accounts automatically if they don't exist
- ✅ **3 Pre-configured Accounts**:
  - **Client Account** - Pro member with full features
  - **Admin Account** - Full administrative access
  - **New User** - Fresh account for onboarding testing
- ✅ **Auto-Redirect** - Takes you straight to the right page
- ✅ **Beautiful UI** - Shows all credentials on cards

### Test Accounts

#### 1. Client Account (Pro Member)
```
Email: rsf.client.test@gmail.com
Password: TestClient123!
Role: Client
Redirects to: /dashboard
Features:
- Pro membership tier
- Access to coach messaging
- Full dashboard features
```

#### 2. Admin Account
```
Email: rsf.admin.test@gmail.com
Password: TestAdmin123!
Role: Admin
Redirects to: /admin/dashboard
Features:
- Full admin access
- User management
- System settings
```

#### 3. New User (Onboarding)
```
Email: rsf.newuser.test@gmail.com
Password: TestNew123!
Role: New User
Redirects to: /onboarding
Features:
- Fresh account
- Goes to onboarding flow
- No existing data
```

### How to Use
1. Navigate to `/dev-login` or click the floating button
2. Click "Quick Login" on any account card
3. Wait for automatic sign in (1-2 seconds)
4. You'll be redirected to the appropriate page

### Setup in Supabase (Optional)
If you want to set up the accounts manually in Supabase, run:
```sql
-- See: supabase/setup_test_accounts.sql
```

---

## 👥 Client Login

### Access URL
```
http://localhost:5173/sign-in
```

### Features
- Sign In (existing users)
- Sign Up (new users)
- Automatic redirect to onboarding after sign up
- Automatic redirect to dashboard after sign in
- Password validation:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one number
- Show/hide password toggle
- Beautiful gradient UI with RSF branding

### Test Client Account
```
Email: rsf.client.test@gmail.com
Password: TestClient123!
```

### After Login
- New users → Redirected to `/onboarding`
- Existing users → Redirected to `/dashboard`

---

## 🛡️ Admin Login

### Access URL
```
http://localhost:5173/admin/login
```

### Features
- Admin-only authentication
- Role-based access control
- Security warnings and monitoring notices
- Shield icon branding
- Link to client login

### Allowed Roles
- `superadmin`
- `admin`
- `site_manager`

### Test Admin Account
To create an admin account, you need to:

1. **Sign up as a regular user first**
2. **Update the user's role in Supabase**:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your-admin@email.com';
   ```

### After Login
- Admin users → Redirected to `/admin/dashboard`
- Non-admin users → Error message: "You do not have permission to access the admin dashboard"

---

## 🔗 Navigation Between Portals

### Client → Admin
- At the bottom of the Client Login page: "Admin Login →"

### Admin → Client
- At the bottom of the Admin Login page: "← Client Login"

---

## 📱 Access Points

### From Main Website
1. Click **"Sign In"** button in header → Client Login
2. Click **"Join Now"** button in header → Onboarding (requires sign in first)

### Direct URLs
- Client Login: `/sign-in`
- Admin Login: `/admin/login`
- Dashboard: `/dashboard` (requires authentication)
- Admin Dashboard: `/admin/dashboard` (requires admin role)

---

## 🚨 Security Features

### Client Portal
- Email validation
- Strong password requirements
- Password confirmation on sign up
- Error messages for invalid credentials

### Admin Portal
- Role-based access control (RLS in Supabase)
- Profile role verification
- Security monitoring notice
- Restricted to authorized personnel only

---

## 🆘 Troubleshooting

### "Please sign in to view your dashboard"
- You're not logged in
- Go to `/sign-in` and log in with your credentials

### "You do not have permission to access the admin dashboard"
- Your account doesn't have admin role
- Check your role in Supabase `profiles` table
- Contact a superadmin to grant admin access

### Infinite loading spinner
- Check browser console for errors
- Verify Supabase connection
- Check if user profile exists in database

### Can't sign in
- Verify email and password are correct
- Check if account exists (try sign up if new)
- Ensure Supabase is running and accessible

---

## 👨‍💻 Development Notes

### File Structure
```
src/
├── pages/
│   ├── ClientSignInPage.tsx       # Client login/signup page
│   ├── SimpleDashboardPage.tsx    # Client dashboard
│   ├── SettingsPage.tsx           # Profile & payment settings
│   ├── MessageCoachPage.tsx       # Coach messaging (tier-restricted)
│   └── admin/
│       └── AdminLoginPage.tsx     # Admin login page
```

### Routes
```typescript
// Public
/sign-in              → ClientSignInPage
/admin/login          → AdminLoginPage

// Protected (Client)
/dashboard            → SimpleDashboardPage
/dashboard/settings   → SettingsPage
/dashboard/messages   → MessageCoachPage
/dashboard/sessions   → SessionsSection
/dashboard/progress   → ProgressSection
/dashboard/plan       → PlanSection
/dashboard/schedule   → ScheduleSection
/dashboard/billing    → BillingSection

// Protected (Admin)
/admin/dashboard      → AdminDashboardPage
/admin/users          → AdminUsersPage
/admin/onboarding     → OnboardingDashboardPage
// ... other admin routes
```

---

## 🎨 Design System

Both login pages use:
- Gradient backgrounds (`from-gray-900 via-black to-gray-900`)
- Glassmorphism cards
- Primary green accent color (`#6AFFB7`)
- Consistent button styles
- Icon-based UI (Lucide React)
- Responsive design (mobile-first)

---

## 📊 Database Schema

### Required Tables
```sql
-- profiles table needs:
- id (UUID, references auth.users)
- email (TEXT)
- role (TEXT) -- 'user', 'admin', 'superadmin', 'site_manager'
- first_name (TEXT)
- last_name (TEXT)
- onboarding_completed_at (TIMESTAMP)
- subscription_package (TEXT)
-- ... other profile fields
```

### RLS Policies
- Users can read/update their own profile
- Admins can read all profiles
- Superadmins can update any profile

---

## 🔄 User Flow

### New Client
1. Homepage → Click "Join Now"
2. Redirected to `/sign-in` (auto-switch to sign-up mode coming soon)
3. Create account with email/password
4. Redirected to `/onboarding`
5. Complete 10-step onboarding
6. Redirected to `/dashboard`

### Returning Client
1. Homepage → Click "Sign In"
2. Enter credentials
3. Redirected to `/dashboard`
4. Access all dashboard features

### Admin
1. Navigate to `/admin/login`
2. Enter admin credentials
3. System verifies admin role
4. Redirected to `/admin/dashboard`
5. Access admin features

---

## 📝 Notes

- No modal authentication anymore - all full-page forms
- Header "Sign In" button now navigates to `/sign-in`
- "Join Now" button navigates to `/onboarding` (will prompt login)
- Admin login is completely separate from client login
- Both portals have beautiful, modern UI
- Mobile-responsive design

