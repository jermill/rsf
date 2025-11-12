# Database Migrations Overview

## 📋 All 29 Migrations Explained

### Core System (April 2025)
1. **20250422003427_super_oasis.sql**
   - Initial profiles table
   - User authentication setup
   - Basic RLS policies

2. **20250422003805_restless_morning.sql**
   - Services table
   - Service categories
   - Pricing structure

3. **20250422004622_navy_morning.sql**
   - Bookings table
   - Appointment scheduling
   - Booking status tracking

4. **20250422004941_delicate_recipe.sql**
   - Payment methods table
   - User payment info storage
   - Payment security

5. **20250422005150_blue_leaf.sql**
   - Subscriptions table
   - Membership plans
   - Subscription status

6. **20250422135336_bright_heart.sql**
   - Enhanced profiles
   - User preferences
   - Profile metadata

7. **20250422141748_navy_bar.sql**
   - Workouts table
   - Exercise tracking
   - Workout history

### Schema Refinements (May 2025)
8. **20250501150000_summer_glade.sql**
   - Major schema updates
   - Relationship improvements
   - Index optimizations

9-20. **20250505142504_restless_grass.sql** through **20250505232539_holy_frog.sql**
   - Progressive improvements
   - Bug fixes
   - Performance optimizations
   - **20250505215000_snake_case_schema.sql** - Critical: Enforces snake_case naming

### Advanced Features (May 2025)
21. **20250506080000_add_reminders_table.sql**
   - User reminders
   - Notification system
   - Scheduled alerts

22. **20250506095000_meal_planning_schema.sql**
   - Meal plans structure
   - Nutrition tracking
   - Diet management

23. **20250506095800_meal_plans.sql**
   - Meal plan details
   - Recipe storage
   - Shopping lists

### CMS System (May 2025)
24. **20250512000000_cms_system.sql** ⭐
   - Complete CMS infrastructure
   - 8 new tables
   - Page management
   - Media library
   - Version control
   - Navigation system
   - Site settings
   - Content blocks

---

## 🗄️ Complete Database Schema

### Authentication & Users
- `auth.users` (Supabase built-in)
- `profiles` - Extended user data with roles

### Fitness Features
- `workouts` - Exercise sessions
- `workout_logs` - User workout history
- `exercises` - Exercise library

### Business Operations
- `services` - Available services
- `bookings` - Appointment bookings
- `subscriptions` - Membership plans
- `payment_methods` - User payment info

### Meal Planning
- `meal_plans` - Meal plan templates
- `meal_plan_items` - Individual meals
- `nutrition_targets` - User nutrition goals
- `recipes` - Recipe database

### Reminders & Notifications
- `reminders` - User reminders
- `notifications` - System notifications

### CMS (Content Management System)
- `site_settings` - Global configuration
- `pages` - Website pages
- `content_blocks` - Page sections
- `media_library` - File uploads
- `navigation_menus` - Site navigation
- `navigation_items` - Menu links
- `content_templates` - Reusable templates
- `page_versions` - Version history

---

## 🔐 Security Features

### Row Level Security (RLS)
Every table has policies for:
- **Public access** - What anyone can see
- **User access** - What authenticated users can do
- **Admin access** - Full management capabilities

### User Roles
- `user` - Regular members
- `admin` - Staff members
- `superadmin` - Full system access

### Storage Security
- Public read for published content
- Authenticated write for uploads
- User-specific file management

---

## 📊 Key Features by Table

| Table | Purpose | Key Features |
|-------|---------|--------------|
| profiles | User data | Roles, preferences, metadata |
| bookings | Scheduling | Status tracking, calendar integration |
| meal_plans | Nutrition | Custom plans, macro tracking |
| content_blocks | CMS | JSONB content, positioning, visibility |
| media_library | Files | Upload, tagging, metadata |
| page_versions | History | Snapshots, rollback capability |
| site_settings | Config | Key-value store, categories |

---

## 🔄 Migration Order Matters!

The migrations MUST run in order because:
1. Later migrations reference earlier tables
2. Foreign keys depend on parent tables existing
3. Policies reference functions from earlier migrations
4. Default data insertion requires table structure

**The consolidated script maintains the correct order automatically.**

---

## 📈 Database Growth Estimate

After all migrations:
- **Tables:** 25+
- **Views:** 5+
- **Functions:** 10+
- **Triggers:** 15+
- **Policies:** 50+
- **Indexes:** 30+

---

## 🎯 Critical Migrations

### Must-Have for Basic Functionality
1. ✅ Profiles setup (20250422003427)
2. ✅ Services & bookings (20250422004622)
3. ✅ Snake case standardization (20250505215000)

### Must-Have for CMS
1. ✅ Complete CMS system (20250512000000)

### Recommended for Full Features
1. ✅ Meal planning (20250506095000, 20250506095800)
2. ✅ Reminders (20250506080000)

---

## 🔍 Inspecting Your Database

### List All Tables
```sql
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Check Table Sizes
```sql
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### View All Policies
```sql
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 💡 Pro Tips

1. **Run all at once** - Use COMPLETE_BACKEND_SETUP.sql
2. **Check errors** - Review any error messages carefully
3. **Verify policies** - Ensure RLS is enabled on sensitive tables
4. **Test permissions** - Try accessing data as different user roles
5. **Backup regularly** - Use Supabase's backup features

---

## 🎓 Learning Resources

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

---

**Your database is enterprise-grade with production-ready features!** 🚀

