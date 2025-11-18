-- Check which columns are wrongly set as arrays
SELECT 
    column_name, 
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND column_name IN (
        'injuries',
        'medications',
        'doctor_clearance',
        'specific_goal',
        'current_activity_level',
        'fitness_level',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relationship',
        'preferred_payment_method',
        'referral_source'
    )
ORDER BY column_name;

-- If ANY of these show ARRAY/_text, they need to be fixed to just TEXT

