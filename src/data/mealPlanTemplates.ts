export interface MealPlanTemplate {
  id: string;
  name: string;
  description: string;
  category: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'vegan' | 'keto' | 'general';
  duration: number; // in days
  caloriesPerDay: number;
  macros: {
    protein: number; // percentage
    carbs: number;
    fats: number;
  };
  macrosGrams: {
    protein: number; // grams
    carbs: number;
    fats: number;
  };
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
}

// Helper function to calculate macros in grams from percentages and calories
export const calculateMacrosGrams = (calories: number, proteinPercent: number, carbsPercent: number, fatsPercent: number) => {
  return {
    protein: Math.round((calories * (proteinPercent / 100)) / 4),
    carbs: Math.round((calories * (carbsPercent / 100)) / 4),
    fats: Math.round((calories * (fatsPercent / 100)) / 9),
  };
};

export const mealPlanTemplates: MealPlanTemplate[] = [
  {
    id: 'weight-loss-30',
    name: '30-Day Weight Loss',
    description: 'Balanced calorie deficit plan focused on sustainable weight loss with whole foods',
    category: 'weight-loss',
    duration: 30,
    caloriesPerDay: 1600,
    macros: {
      protein: 30,
      carbs: 40,
      fats: 30,
    },
    macrosGrams: calculateMacrosGrams(1600, 30, 40, 30),
    meals: {
      breakfast: [
        'Greek yogurt with berries and almonds',
        'Scrambled eggs with spinach and whole wheat toast',
        'Oatmeal with banana and peanut butter',
        'Protein smoothie with spinach and berries',
      ],
      lunch: [
        'Grilled chicken salad with mixed greens',
        'Turkey and avocado wrap with veggies',
        'Quinoa bowl with roasted vegetables',
        'Lentil soup with side salad',
      ],
      dinner: [
        'Baked salmon with broccoli and sweet potato',
        'Lean beef stir-fry with brown rice',
        'Grilled chicken with roasted vegetables',
        'Turkey meatballs with zucchini noodles',
      ],
      snacks: [
        'Apple with almond butter',
        'Carrot sticks with hummus',
        'Hard-boiled eggs',
        'Protein shake',
      ],
    },
    tags: ['weight-loss', 'calorie-deficit', 'balanced'],
    difficulty: 'beginner',
    icon: '🎯',
  },
  {
    id: 'muscle-gain-90',
    name: '90-Day Muscle Builder',
    description: 'High-protein calorie surplus plan designed to support muscle growth and strength gains',
    category: 'muscle-gain',
    duration: 90,
    caloriesPerDay: 2800,
    macros: {
      protein: 35,
      carbs: 45,
      fats: 20,
    },
    macrosGrams: calculateMacrosGrams(2800, 35, 45, 20),
    meals: {
      breakfast: [
        'Egg white omelet with turkey and cheese',
        'Protein pancakes with berries',
        'Greek yogurt bowl with granola and protein powder',
        'Breakfast burrito with eggs, beans, and avocado',
      ],
      lunch: [
        'Grilled chicken breast with rice and vegetables',
        'Beef and quinoa power bowl',
        'Tuna sandwich with sweet potato fries',
        'Salmon with pasta and asparagus',
      ],
      dinner: [
        'Steak with baked potato and green beans',
        'Chicken thighs with rice and broccoli',
        'Turkey chili with cornbread',
        'Grilled fish with quinoa and mixed vegetables',
      ],
      snacks: [
        'Protein shake with banana',
        'Trail mix with nuts and dried fruit',
        'Cottage cheese with pineapple',
        'Rice cakes with peanut butter',
      ],
    },
    tags: ['muscle-gain', 'high-protein', 'bulking'],
    difficulty: 'intermediate',
    icon: '💪',
  },
  {
    id: 'vegan-power-30',
    name: 'Vegan Power 30',
    description: 'Plant-based meal plan rich in nutrients, complete proteins, and healthy fats',
    category: 'vegan',
    duration: 30,
    caloriesPerDay: 2000,
    macros: {
      protein: 25,
      carbs: 50,
      fats: 25,
    },
    macrosGrams: calculateMacrosGrams(2000, 25, 50, 25),
    meals: {
      breakfast: [
        'Tofu scramble with vegetables',
        'Smoothie bowl with plant-based protein',
        'Overnight oats with chia seeds and berries',
        'Avocado toast with tempeh bacon',
      ],
      lunch: [
        'Buddha bowl with chickpeas and tahini dressing',
        'Lentil curry with brown rice',
        'Black bean and quinoa salad',
        'Falafel wrap with hummus and vegetables',
      ],
      dinner: [
        'Tofu stir-fry with mixed vegetables',
        'Vegan chili with cornbread',
        'Pasta primavera with cashew cream sauce',
        'Stuffed bell peppers with quinoa and beans',
      ],
      snacks: [
        'Hummus with veggie sticks',
        'Mixed nuts and seeds',
        'Fruit with almond butter',
        'Energy balls with dates and oats',
      ],
    },
    tags: ['vegan', 'plant-based', 'whole-foods'],
    difficulty: 'beginner',
    icon: '🌱',
  },
  {
    id: 'keto-lean-60',
    name: 'Keto Lean 60',
    description: 'Low-carb, high-fat ketogenic diet for fat loss and mental clarity',
    category: 'keto',
    duration: 60,
    caloriesPerDay: 1800,
    macros: {
      protein: 25,
      carbs: 5,
      fats: 70,
    },
    macrosGrams: calculateMacrosGrams(1800, 25, 5, 70),
    meals: {
      breakfast: [
        'Bacon and eggs with avocado',
        'Keto smoothie with coconut oil and MCT',
        'Cheese omelet with spinach',
        'Greek yogurt with nuts and seeds',
      ],
      lunch: [
        'Caesar salad with grilled chicken (no croutons)',
        'Bunless burger with cheese and bacon',
        'Tuna salad with olive oil and vegetables',
        'Zucchini noodles with pesto and chicken',
      ],
      dinner: [
        'Ribeye steak with butter and asparagus',
        'Salmon with cauliflower rice and broccoli',
        'Pork chops with green beans and butter',
        'Chicken thighs with roasted Brussels sprouts',
      ],
      snacks: [
        'Cheese cubes with pepperoni',
        'Macadamia nuts',
        'Celery with cream cheese',
        'Keto fat bombs',
      ],
    },
    tags: ['keto', 'low-carb', 'high-fat'],
    difficulty: 'advanced',
    icon: '🥑',
  },
  {
    id: 'maintenance-balanced',
    name: 'Balanced Maintenance',
    description: 'Sustainable meal plan for maintaining current weight and overall health',
    category: 'maintenance',
    duration: 30,
    caloriesPerDay: 2200,
    macros: {
      protein: 25,
      carbs: 45,
      fats: 30,
    },
    macrosGrams: calculateMacrosGrams(2200, 25, 45, 30),
    meals: {
      breakfast: [
        'Whole grain toast with eggs and avocado',
        'Oatmeal with nuts and berries',
        'Greek yogurt parfait with granola',
        'Smoothie with protein powder and banana',
      ],
      lunch: [
        'Chicken and vegetable soup with bread',
        'Mediterranean salad with feta and olives',
        'Turkey sandwich with side salad',
        'Rice bowl with grilled salmon and vegetables',
      ],
      dinner: [
        'Grilled chicken with quinoa and roasted vegetables',
        'Pasta with lean meat sauce and side salad',
        'Baked cod with sweet potato and green beans',
        'Stir-fry with tofu, vegetables, and brown rice',
      ],
      snacks: [
        'Fresh fruit',
        'Trail mix',
        'Greek yogurt',
        'Whole grain crackers with cheese',
      ],
    },
    tags: ['maintenance', 'balanced', 'sustainable'],
    difficulty: 'beginner',
    icon: '⚖️',
  },
  {
    id: 'athlete-performance',
    name: 'Athlete Performance',
    description: 'High-calorie plan optimized for athletic performance and recovery',
    category: 'muscle-gain',
    duration: 90,
    caloriesPerDay: 3200,
    macros: {
      protein: 30,
      carbs: 50,
      fats: 20,
    },
    macrosGrams: calculateMacrosGrams(3200, 30, 50, 20),
    meals: {
      breakfast: [
        'Large omelet with whole grain toast and fruit',
        'Protein pancakes with Greek yogurt',
        'Breakfast burrito bowl with eggs, rice, and beans',
        'Oatmeal with protein powder and banana',
      ],
      lunch: [
        'Double chicken breast with rice and vegetables',
        'Pasta with lean ground turkey and marinara',
        'Large burrito bowl with extra protein',
        'Salmon with quinoa and roasted vegetables',
      ],
      dinner: [
        'Steak with double sweet potato and vegetables',
        'Chicken and rice power bowl',
        'Lean ground beef with pasta and vegetables',
        'Grilled fish with rice and salad',
      ],
      snacks: [
        'Protein shake (post-workout)',
        'Peanut butter sandwich',
        'Protein bar and banana',
        'Greek yogurt with granola',
      ],
    },
    tags: ['performance', 'high-calorie', 'athletic'],
    difficulty: 'advanced',
    icon: '🏃',
  },
  {
    id: 'intermittent-fasting',
    name: 'Intermittent Fasting 16/8',
    description: 'Time-restricted eating with an 8-hour feeding window for fat loss',
    category: 'weight-loss',
    duration: 30,
    caloriesPerDay: 1800,
    macros: {
      protein: 30,
      carbs: 35,
      fats: 35,
    },
    macrosGrams: calculateMacrosGrams(1800, 30, 35, 35),
    meals: {
      breakfast: [
        'Skip (fasting period)',
        'Skip (fasting period)',
        'Skip (fasting period)',
        'Skip (fasting period)',
      ],
      lunch: [
        'Large chicken salad with olive oil dressing (first meal)',
        'Salmon bowl with avocado and vegetables (first meal)',
        'Beef and vegetable stir-fry (first meal)',
        'Turkey wrap with side salad (first meal)',
      ],
      dinner: [
        'Steak with roasted vegetables and sweet potato',
        'Grilled chicken with quinoa and broccoli',
        'Baked fish with cauliflower rice and asparagus',
        'Pork tenderloin with Brussels sprouts',
      ],
      snacks: [
        'Nuts and seeds (within feeding window)',
        'Greek yogurt with berries',
        'Protein shake',
        'Dark chocolate and almonds',
      ],
    },
    tags: ['intermittent-fasting', 'time-restricted', 'fat-loss'],
    difficulty: 'intermediate',
    icon: '⏰',
  },
  {
    id: 'gut-health-reset',
    name: 'Gut Health Reset',
    description: 'Probiotic-rich, anti-inflammatory meals to support digestive health',
    category: 'general',
    duration: 21,
    caloriesPerDay: 1900,
    macros: {
      protein: 25,
      carbs: 45,
      fats: 30,
    },
    macrosGrams: calculateMacrosGrams(1900, 25, 45, 30),
    meals: {
      breakfast: [
        'Kefir smoothie with berries and chia seeds',
        'Probiotic yogurt with ground flaxseed',
        'Oatmeal with fermented blueberries',
        'Green smoothie with spirulina and ginger',
      ],
      lunch: [
        'Miso soup with tofu and seaweed',
        'Kimchi fried rice with vegetables',
        'Sauerkraut salad with grilled chicken',
        'Bone broth with vegetables and quinoa',
      ],
      dinner: [
        'Grilled salmon with fermented vegetables',
        'Chicken with sauerkraut and sweet potato',
        'Turkey meatballs with kimchi and rice',
        'Baked cod with roasted root vegetables',
      ],
      snacks: [
        'Kombucha',
        'Pickled vegetables',
        'Kefir with berries',
        'Fermented nuts',
      ],
    },
    tags: ['gut-health', 'probiotic', 'anti-inflammatory'],
    difficulty: 'intermediate',
    icon: '🦠',
  },
];

export const getTemplatesByCategory = (category: MealPlanTemplate['category']) => {
  return mealPlanTemplates.filter(t => t.category === category);
};

export const getTemplateById = (id: string) => {
  return mealPlanTemplates.find(t => t.id === id);
};

export const getAllCategories = () => {
  return Array.from(new Set(mealPlanTemplates.map(t => t.category)));
};

