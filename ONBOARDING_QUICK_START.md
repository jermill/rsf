# 🚀 Enhanced Onboarding System - Quick Start

## What You Got

Your RSF Fitness app now has a **professional onboarding system** that automatically tracks new member progress and helps them get started!

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Run Database Migration

1. Open your Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT/sql
   ```

2. Copy & paste the entire contents of:
   ```
   supabase/migrations/20250518000000_enhanced_onboarding.sql
   ```

3. Click **Run**

4. You should see: ✅ "Enhanced onboarding system created successfully!"

### Step 2: Verify Setup

Run this query to check tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'onboarding%';
```

You should see 4 tables:
- ✅ `onboarding_progress`
- ✅ `onboarding_checklist`
- ✅ `onboarding_recommendations`
- ✅ `onboarding_journey`

### Step 3: Test with New User

1. Create a test user account in your app
2. Onboarding progress and checklist should be auto-created
3. View at `/admin/onboarding` (admin only)

---

## 🎯 What Users See

### 1. **Onboarding Checklist**
When a new user logs in, they see a checklist with items like:
- ✓ Complete Your Profile
- ✓ Set Your Fitness Goals
- ✓ Complete Fitness Assessment
- ✓ Upload Progress Photo (optional)
- ✓ Book Your First Session
- ✓ Explore the App (optional)
- ✓ Join the Community (optional)

### 2. **Progress Tracking**
- Visual progress bar showing % complete
- Required vs optional items marked
- Completion timestamps

### 3. **Personalized Recommendations**
Based on their goals, users get suggestions like:
- "Weight Loss Meal Plan"
- "Muscle Building Program"
- "Beginner-Friendly Personal Trainer"
- "Book Your Intro Session"

---

## 👨‍💼 What Admins See

### Admin Onboarding Dashboard
**Location:** `/admin/onboarding`

**Features:**
- 📊 **Statistics**
  - Total users
  - In progress count
  - Completion rate (%)
  - Average time to complete
  - Stuck users (>3 days inactive)

- 📋 **User List**
  - See all users and their progress
  - Filter by: All / In Progress / Stuck / Completed
  - Search by name or email
  - View progress bars
  - Export to CSV

- ⚠️ **Alerts**
  - Identifies users who need attention
  - Shows users stuck > 3 days

---

## 💻 Using in Your Code

### Display Checklist in Dashboard

```typescript
import { useOnboarding } from '../hooks/useOnboarding';
import { OnboardingChecklist } from '../components/onboarding/OnboardingChecklist';

const DashboardPage = () => {
  const { checklist, completeChecklistItem, getCompletionPercentage } = useOnboarding();

  return (
    <div>
      <h2>Get Started ({getCompletionPercentage()}%)</h2>
      <OnboardingChecklist
        items={checklist}
        onItemClick={(item) => {
          // Navigate to appropriate page
          navigate(item.action_url);
        }}
        onComplete={completeChecklistItem}
      />
    </div>
  );
};
```

### Show Personalized Recommendations

```typescript
import { useOnboarding } from '../hooks/useOnboarding';
import { PersonalizedRecommendations } from '../components/onboarding/PersonalizedRecommendations';

const DashboardPage = () => {
  const { recommendations, acceptRecommendation, dismissRecommendation } = useOnboarding();

  return (
    <PersonalizedRecommendations
      recommendations={recommendations}
      onAccept={acceptRecommendation}
      onDismiss={dismissRecommendation}
    />
  );
};
```

### Update Progress When User Completes a Step

```typescript
const { updateStep } = useOnboarding();

// After user fills out profile
await updateStep('personal_info', {
  first_name: 'John',
  last_name: 'Doe',
});

// After fitness assessment
await updateStep('fitness_assessment', {
  fitness_level: 'intermediate',
});
```

---

## 📧 Optional: Email Automation

### Welcome Email (On Signup)

```typescript
import { sendWelcomeEmail } from '../lib/email';

// After user creates account
await sendWelcomeEmail(user.email, user.first_name);
```

### Reminder for Stuck Users

```typescript
// Run daily via cron job
const { data: stuckUsers } = await supabase
  .from('onboarding_progress')
  .select('user_id, profiles(email, first_name)')
  .eq('is_complete', false)
  .lt('last_activity_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000));

// Send reminder emails
for (const user of stuckUsers) {
  await sendReminderEmail(user.profiles.email, user.profiles.first_name);
}
```

---

## 🎨 Customization

### Add Custom Checklist Items

```sql
INSERT INTO onboarding_checklist (
  user_id,
  item_key,
  item_title,
  item_description,
  item_order,
  is_required
) VALUES (
  'user-id-here',
  'watch_welcome_video',
  'Watch Welcome Video',
  'Learn about our gym and community',
  8,
  false
);
```

### Change Number of Steps

Edit the migration file:
```sql
total_steps INTEGER DEFAULT 7,  -- Change to your desired number
```

### Modify Recommendation Logic

Edit the `generate_onboarding_recommendations` function to add custom recommendations based on user data.

---

## 📊 Track Analytics

The system automatically tracks:
- When users complete steps
- When checklist items are marked done
- When recommendations are accepted/dismissed
- Full onboarding completion

View events in your analytics dashboard (if configured).

---

## 🆘 Troubleshooting

### Checklist Not Appearing for New Users

**Solution:** The trigger creates it automatically. If missing, run manually:

```sql
SELECT create_onboarding_progress()
FROM auth.users
WHERE id = 'user-id-here';
```

### Admin Dashboard Not Loading

**Check:**
1. Is user an admin? (Check `profiles.role`)
2. Are RLS policies allowing access?
3. Run `get_onboarding_stats()` manually to test

### Progress Not Updating

**Solution:**
```sql
-- Test the update function
SELECT update_onboarding_step(
  p_user_id := 'user-id-here',
  p_step_key := 'personal_info',
  p_step_data := '{"test": true}'::jsonb
);
```

---

## 🎯 Key Features Summary

✅ **Automatic** - Created on user signup
✅ **Tracked** - Every step is logged
✅ **Personalized** - Recommendations based on goals
✅ **Admin Visibility** - Full dashboard analytics
✅ **Flexible** - Easy to customize
✅ **Scalable** - Handles thousands of users

---

## 📚 Full Documentation

For complete details, see: **ONBOARDING_SYSTEM_GUIDE.md**

---

## ✨ Next Steps

1. ✅ Run the migration
2. ✅ Test with a new user
3. ✅ Check admin dashboard
4. ⏳ Add checklist to user dashboard
5. ⏳ Integrate recommendations display
6. ⏳ Set up welcome emails
7. ⏳ Configure reminder automation

---

**Your enhanced onboarding system is ready to welcome new members! 🎉**

Built with ❤️ for RSF Fitness | November 2025

