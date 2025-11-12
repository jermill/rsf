-- Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check CMS tables specifically
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings') THEN '✅' 
    ELSE '❌' 
  END as site_settings,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN '✅' 
    ELSE '❌' 
  END as pages,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'content_blocks') THEN '✅' 
    ELSE '❌' 
  END as content_blocks,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media_library') THEN '✅' 
    ELSE '❌' 
  END as media_library,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN '✅' 
    ELSE '❌' 
  END as profiles,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN '✅' 
    ELSE '❌' 
  END as bookings;

