import React from 'react';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react';

export interface NutritionData {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFats?: number;
}

interface NutritionDashboardProps {
  nutrition: NutritionData;
  showTargets?: boolean;
  compact?: boolean;
}

const NutritionDashboard: React.FC<NutritionDashboardProps> = ({ 
  nutrition, 
  showTargets = false,
  compact = false 
}) => {
  const {
    calories,
    protein,
    carbs,
    fats,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFats,
  } = nutrition;

  // Calculate percentages if targets are provided
  const caloriesPercent = targetCalories ? Math.round((calories / targetCalories) * 100) : 100;
  const proteinPercent = targetProtein ? Math.round((protein / targetProtein) * 100) : 100;
  const carbsPercent = targetCarbs ? Math.round((carbs / targetCarbs) * 100) : 100;
  const fatsPercent = targetFats ? Math.round((fats / targetFats) * 100) : 100;

  // Calculate macro percentages of total calories
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatsCals = fats * 9;
  const totalCals = proteinCals + carbsCals + fatsCals;
  
  const proteinMacroPercent = Math.round((proteinCals / totalCals) * 100);
  const carbsMacroPercent = Math.round((carbsCals / totalCals) * 100);
  const fatsMacroPercent = Math.round((fatsCals / totalCals) * 100);

  const getProgressColor = (percent: number) => {
    if (percent < 80) return 'bg-yellow-500';
    if (percent >= 80 && percent <= 110) return 'bg-green-500';
    return 'bg-red-500';
  };

  const NutrientCard = ({ 
    icon: Icon, 
    label, 
    value, 
    unit, 
    target, 
    percent, 
    color,
    macroPercent 
  }: { 
    icon: any; 
    label: string; 
    value: number; 
    unit: string; 
    target?: number; 
    percent: number; 
    color: string;
    macroPercent?: number;
  }) => (
    <div className={`${compact ? 'p-4' : 'p-5'} rounded-xl bg-dark/50 border border-primary/20 hover:border-primary/40 transition`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-light/70">{label}</span>
        </div>
        {macroPercent !== undefined && (
          <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-semibold">
            {macroPercent}%
          </span>
        )}
      </div>

      {/* Value */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-light">{value.toLocaleString()}</span>
          <span className="text-sm text-light/50">{unit}</span>
        </div>
        {showTargets && target && (
          <div className="text-xs text-light/50 mt-1">
            Target: {target.toLocaleString()} {unit} ({percent}%)
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {showTargets && target && (
        <div className="relative h-2 bg-dark rounded-full overflow-hidden">
          <div 
            className={`absolute left-0 top-0 h-full ${getProgressColor(percent)} transition-all duration-500`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      )}
    </div>
  );

  if (compact) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-dark/50 border border-primary/20 text-center">
          <Flame className="w-5 h-5 mx-auto mb-1 text-orange-400" />
          <div className="text-xl font-bold text-light">{calories}</div>
          <div className="text-xs text-light/50">calories</div>
        </div>
        <div className="p-3 rounded-lg bg-dark/50 border border-primary/20 text-center">
          <Beef className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <div className="text-xl font-bold text-light">{protein}g</div>
          <div className="text-xs text-light/50">protein</div>
        </div>
        <div className="p-3 rounded-lg bg-dark/50 border border-primary/20 text-center">
          <Wheat className="w-5 h-5 mx-auto mb-1 text-orange-300" />
          <div className="text-xl font-bold text-light">{carbs}g</div>
          <div className="text-xs text-light/50">carbs</div>
        </div>
        <div className="p-3 rounded-lg bg-dark/50 border border-primary/20 text-center">
          <Droplet className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
          <div className="text-xl font-bold text-light">{fats}g</div>
          <div className="text-xs text-light/50">fats</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-2xl font-bold text-primary mb-2">📊 Nutrition Breakdown</h3>
        <p className="text-sm text-light/60">Daily macronutrient targets and progress</p>
      </div>

      {/* Macro Distribution Pie Chart (Simple Visual) */}
      {!showTargets && (
        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-primary mb-1">{calories}</div>
            <div className="text-sm text-light/60">Total Calories</div>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{proteinMacroPercent}%</div>
              <div className="text-xs text-light/60">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{carbsMacroPercent}%</div>
              <div className="text-xs text-light/60">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{fatsMacroPercent}%</div>
              <div className="text-xs text-light/60">Fats</div>
            </div>
          </div>
          {/* Visual Bar */}
          <div className="mt-4 h-4 rounded-full overflow-hidden flex">
            <div className="bg-blue-500" style={{ width: `${proteinMacroPercent}%` }} />
            <div className="bg-orange-500" style={{ width: `${carbsMacroPercent}%` }} />
            <div className="bg-yellow-500" style={{ width: `${fatsMacroPercent}%` }} />
          </div>
        </div>
      )}

      {/* Nutrient Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NutrientCard
          icon={Flame}
          label="Calories"
          value={calories}
          unit="cal"
          target={targetCalories}
          percent={caloriesPercent}
          color="bg-gradient-to-br from-orange-500 to-red-500"
        />
        <NutrientCard
          icon={Beef}
          label="Protein"
          value={protein}
          unit="g"
          target={targetProtein}
          percent={proteinPercent}
          color="bg-gradient-to-br from-blue-500 to-cyan-500"
          macroPercent={proteinMacroPercent}
        />
        <NutrientCard
          icon={Wheat}
          label="Carbs"
          value={carbs}
          unit="g"
          target={targetCarbs}
          percent={carbsPercent}
          color="bg-gradient-to-br from-orange-400 to-amber-500"
          macroPercent={carbsMacroPercent}
        />
        <NutrientCard
          icon={Droplet}
          label="Fats"
          value={fats}
          unit="g"
          target={targetFats}
          percent={fatsPercent}
          color="bg-gradient-to-br from-yellow-400 to-yellow-600"
          macroPercent={fatsMacroPercent}
        />
      </div>

      {/* Macro Ratios */}
      <div className="p-5 rounded-xl bg-dark/50 border border-primary/20">
        <h4 className="text-sm font-semibold text-light/70 mb-3">Macro Ratios</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-light/70">Protein</span>
            <span className="text-sm font-semibold text-blue-400">{protein}g ({proteinMacroPercent}% of calories)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-light/70">Carbs</span>
            <span className="text-sm font-semibold text-orange-400">{carbs}g ({carbsMacroPercent}% of calories)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-light/70">Fats</span>
            <span className="text-sm font-semibold text-yellow-400">{fats}g ({fatsMacroPercent}% of calories)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionDashboard;

