# 🔍 Onboarding System Audit Report

## Current Status: ARRAY FORMATTING FIXED

---

## ✅ What's Been Fixed:

### 1. **Array Field Handling**
- **`medical_conditions`**: Now properly handles arrays (already an array from checkboxes)
- **`preferred_days`**: Ensures always sent as array

### 2. **Missing Columns Added**
- ✅ `city` (TEXT)
- ✅ `state` (TEXT)
- ✅ All onboarding fields from migrations

---

## 🧪 Testing Checklist

### **Test 1: New User Flow**
1. Go to: http://localhost:5173/dev-login
2. Click "Quick Login" on **New User** account
3. Complete onboarding:
   - **Step 1**: Select "Pay As You Go" OR a subscription package
   - **Step 2**: Fill personal info (first name, last name, phone, city, state, DOB, gender)
   - **Step 3**: Enter physical stats (height, weight, measurements)
   - **Step 4**: Check medical conditions (checkboxes), describe injuries, medications
   - **Step 5**: Set fitness goals and target date
   - **Step 6**: Enter emergency contact
   - **Step 7**: Select preferred days (checkboxes) and sessions per week
   - **Step 8**: Accept legal waivers (all 3 checkboxes)
   - **Step 9**: Select payment method preference
   - **Step 10**: Enter referral source
4. Click "Complete & Submit"
5. **Expected**: Redirect to `/dashboard` with success

---

## 🔍 Known Issues & Solutions

### Issue #1: "Could not find the 'chest' column"
**Status**: ✅ FIXED  
**Solution**: Ran migration to add all onboarding columns

### Issue #2: "Could not find the 'city' column"
**Status**: ✅ FIXED  
**Solution**: Added `city` and `state` columns via SQL

### Issue #3: "malformed array literal"
**Status**: ✅ FIXED  
**Solution**: Ensured `medical_conditions` and `preferred_days` are always sent as arrays

---

## 📊 Database Schema Requirements

### Required Columns in `profiles` Table:

```sql
-- Payment & Package
payment_model TEXT                    -- 'subscription' or 'pay-as-you-go'
subscription_package TEXT             -- Package name if subscription

-- Personal Info
first_name TEXT
last_name TEXT
phone TEXT
city TEXT                             ✅ ADDED
state TEXT                            ✅ ADDED
date_of_birth DATE
gender TEXT

-- Physical Stats
height NUMERIC                        -- in inches
weight NUMERIC                        -- in lbs
chest NUMERIC                         -- in inches
waist NUMERIC                         -- in inches
hips NUMERIC                          -- in inches

-- Health & Medical
medical_conditions TEXT[]             -- PostgreSQL array
injuries TEXT
medications TEXT
doctor_clearance TEXT

-- Fitness Goals
specific_goal TEXT
target_date DATE
current_activity_level TEXT

-- Emergency Contact
emergency_contact_name TEXT
emergency_contact_phone TEXT
emergency_contact_relationship TEXT

-- Scheduling
preferred_days TEXT[]                 -- PostgreSQL array
sessions_per_week INTEGER

-- Legal
liability_waiver_accepted BOOLEAN
terms_accepted BOOLEAN
photo_consent BOOLEAN

-- Payment
preferred_payment_method TEXT
payment_setup_required BOOLEAN
payment_setup_status TEXT

-- Referral
referral_source TEXT

-- Tracking
onboarding_completed_at TIMESTAMPTZ
```

---

## 🚨 Debugging Steps

### If Onboarding Still Fails:

1. **Open Browser Console** (F12)
2. **Look for**:
   - `Submitting profile data:` - shows what's being sent
   - `Supabase error details:` - shows the exact error
   - Error code and message

3. **Check Supabase**:
   - Go to: https://app.supabase.com
   - Navigate to: **Table Editor** → **profiles**
   - Verify all columns exist
   - Check column types (TEXT[] for arrays)

4. **Run this SQL to verify schema**:
```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND column_name IN (
        'medical_conditions',
        'preferred_days',
        'city',
        'state',
        'chest',
        'waist',
        'hips',
        'payment_model',
        'subscription_package'
    )
ORDER BY column_name;
```

---

## 🎯 Next Steps

1. **Test the complete flow** using the New User quick login
2. **If errors occur**, send the browser console output
3. **Verify** user reaches `/dashboard` successfully
4. **Check** that data appears in Supabase `profiles` table

---

## 📝 Notes

- The form uses **checkboxes** for `medical_conditions` (not a text field)
- Valid medical conditions: Heart Disease, High Blood Pressure, Diabetes, Asthma, Joint Problems, Back Pain, Pregnancy, Recent Surgery, None
- `preferred_days` are also checkboxes (Monday-Sunday)
- All array fields are properly formatted before sending to Supabase

---

**Last Updated**: 2025-11-18  
**Status**: ✅ Ready for Testing

