import React, { useState } from 'react';
import { mealPlanTemplates, MealPlanTemplate, getAllCategories } from '../../data/mealPlanTemplates';
import { X, Search, Calendar, TrendingDown, TrendingUp, Heart, Leaf, Flame } from 'lucide-react';

interface TemplateBrowserProps {
  onClose: () => void;
  onSelect: (template: MealPlanTemplate) => void;
}

const TemplateBrowser: React.FC<TemplateBrowserProps> = ({ onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<MealPlanTemplate | null>(null);

  const categories = ['all', ...getAllCategories()];

  const filteredTemplates = mealPlanTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weight-loss': return <TrendingDown className="w-4 h-4" />;
      case 'muscle-gain': return <TrendingUp className="w-4 h-4" />;
      case 'maintenance': return <Heart className="w-4 h-4" />;
      case 'vegan': return <Leaf className="w-4 h-4" />;
      case 'keto': return <Flame className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-900/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/30';
      case 'advanced': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const handleSelectTemplate = (template: MealPlanTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="bg-dark rounded-2xl shadow-2xl border border-primary/30 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/20">
          <div>
            <h2 className="text-2xl font-bold text-primary">📚 Meal Plan Templates</h2>
            <p className="text-sm text-light/60 mt-1">Choose a template to get started</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-primary/10 transition text-light/70 hover:text-light"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-primary/20 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark border border-primary/20 text-light placeholder-light/40 focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-primary text-dark'
                    : 'bg-dark border border-primary/20 text-light/70 hover:bg-primary/10'
                }`}
              >
                {category !== 'all' && getCategoryIcon(category)}
                <span className="capitalize">{category === 'all' ? 'All' : category.replace('-', ' ')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-light/50">
              <Calendar className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">No templates found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`cursor-pointer rounded-xl p-5 border-2 transition-all hover:shadow-xl ${
                    selectedTemplate?.id === template.id
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-primary/20 bg-dark/50 hover:border-primary/40'
                  }`}
                >
                  {/* Template Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{template.icon}</div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Template Info */}
                  <h3 className="text-lg font-bold text-light mb-2">{template.name}</h3>
                  <p className="text-sm text-light/70 mb-4 line-clamp-2">{template.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-light/50">Duration</span>
                      <span className="text-sm font-semibold text-primary">{template.duration} days</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-light/50">Calories</span>
                      <span className="text-sm font-semibold text-primary">{template.caloriesPerDay}/day</span>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="mb-4">
                    <div className="text-xs text-light/50 mb-2">Macros</div>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-blue-900/30 text-blue-300">
                        P: {template.macros.protein}%
                      </span>
                      <span className="px-2 py-1 rounded bg-orange-900/30 text-orange-300">
                        C: {template.macros.carbs}%
                      </span>
                      <span className="px-2 py-1 rounded bg-yellow-900/30 text-yellow-300">
                        F: {template.macros.fats}%
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary/20 flex items-center justify-between bg-dark/50">
          <div className="text-sm text-light/60">
            {selectedTemplate ? (
              <span>Selected: <span className="text-primary font-semibold">{selectedTemplate.name}</span></span>
            ) : (
              <span>Select a template to continue</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-dark border border-primary/20 text-light font-semibold hover:bg-primary/10 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUseTemplate}
              disabled={!selectedTemplate}
              className="px-6 py-2.5 rounded-lg bg-primary text-dark font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBrowser;

