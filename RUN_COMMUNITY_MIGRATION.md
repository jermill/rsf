# 🚀 Run Community Migration

## Problem
Posts are failing because the `community_posts` table doesn't exist in your Supabase database.

## Solution
Run the community migration to create all necessary tables.

---

## 📋 Steps:

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard

### 2. Navigate to SQL Editor
- Click on your project
- Click **"SQL Editor"** in the left sidebar
- Click **"+ New Query"**

### 3. Copy & Paste Migration
Open this file in your project:
```
supabase/migrations/20250519000000_community_features.sql
```

Copy the **ENTIRE file contents** (all 405 lines) and paste into the SQL Editor.

### 4. Run the Migration
- Click the **"Run"** button (or press Cmd+Enter / Ctrl+Enter)
- Wait for it to complete (~2-3 seconds)

### 5. Verify Success
You should see at the bottom:
```
✅ Community features created successfully!
📱 New tables: posts, likes, comments, follows, notifications
🚀 Functions: get_community_feed() for optimized feed loading
```

---

## 🎯 What This Creates:

### **Tables:**
- `community_posts` - User posts with images and content
- `community_post_likes` - Like tracking
- `community_post_comments` - Comments on posts
- `community_comment_likes` - Likes on comments
- `community_follows` - User follow relationships
- `community_notifications` - Activity notifications

### **Functions:**
- `get_community_feed()` - Optimized feed query with user info
- Triggers for auto-updating like/comment counts

### **Security:**
- Row Level Security (RLS) policies
- Users can only edit/delete their own posts
- Everyone can view public posts

---

## 🧪 After Running:

1. **Refresh your browser** (Cmd+Shift+R)
2. Go to **Community** page
3. Try creating a post - it should work! 🎉

---

## ❓ Troubleshooting:

### Error: "relation does not exist"
- The migration wasn't run yet - follow steps above

### Error: "permission denied"
- Make sure you're logged in as the project owner in Supabase dashboard

### Error: "function update_updated_at_column() does not exist"
- Run the earlier migrations first (they should already be run)

---

Need help? Check the browser console (F12) for detailed error messages!

