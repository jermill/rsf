import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Camera, Scale, Ruler, CheckCircle2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LogProgressModal } from '../../ui/LogProgressModal';

const initialWeightData = [
  { date: 'Oct 1', weight: 185 },
  { date: 'Oct 8', weight: 183 },
  { date: 'Oct 15', weight: 182 },
  { date: 'Oct 22', weight: 180 },
  { date: 'Oct 29', weight: 179 },
  { date: 'Nov 5', weight: 177 },
  { date: 'Nov 12', weight: 176 },
];

const initialMeasurementData = [
  { date: 'Oct 1', chest: 42, waist: 34, hips: 40 },
  { date: 'Oct 15', chest: 42.5, waist: 33, hips: 39.5 },
  { date: 'Oct 29', chest: 43, waist: 32.5, hips: 39 },
  { date: 'Nov 12', chest: 43.5, waist: 32, hips: 38.5 },
];

interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
}

export const ProgressSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weight' | 'measurements' | 'photos'>('weight');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [weightData, setWeightData] = useState(initialWeightData);
  const [measurementData, setMeasurementData] = useState(initialMeasurementData);

  const currentWeight = weightData[weightData.length - 1].weight;
  const startWeight = weightData[0].weight;
  const weightChange = currentWeight - startWeight;
  const weightChangePercent = ((weightChange / startWeight) * 100).toFixed(1);

  const handleSaveProgress = (data: any) => {
    console.log('Progress logged:', {
      ...data,
      photo: data.photo ? `File: ${data.photo.name} (${(data.photo.size / 1024).toFixed(2)} KB)` : 'No photo'
    });
    
    // Format date for display (e.g., "Nov 18")
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    // Save weight data if provided
    if (data.weight) {
      const newWeightEntry = {
        date: formattedDate,
        weight: parseFloat(data.weight),
      };
      setWeightData(prevData => [...prevData, newWeightEntry]);
    }
    
    // Save measurements if any are provided
    if (data.chest || data.waist || data.hips) {
      const newMeasurementEntry = {
        date: formattedDate,
        chest: data.chest ? parseFloat(data.chest) : measurementData[measurementData.length - 1]?.chest || 0,
        waist: data.waist ? parseFloat(data.waist) : measurementData[measurementData.length - 1]?.waist || 0,
        hips: data.hips ? parseFloat(data.hips) : measurementData[measurementData.length - 1]?.hips || 0,
      };
      setMeasurementData(prevData => [...prevData, newMeasurementEntry]);
    }
    
    // If photo was uploaded, add it to progress photos
    if (data.photo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: ProgressPhoto = {
          id: Date.now().toString(),
          date: data.date,
          imageUrl: reader.result as string,
        };
        setProgressPhotos(prevPhotos => [...prevPhotos, newPhoto]);
        
        // Switch to Photos tab to show the uploaded photo
        setTimeout(() => {
          setActiveTab('photos');
        }, 500);
      };
      reader.readAsDataURL(data.photo);
    } else if (data.weight && !data.photo) {
      // If only weight was logged (no photo), switch to Weight tab
      setTimeout(() => {
        setActiveTab('weight');
      }, 500);
    } else if ((data.chest || data.waist || data.hips) && !data.photo && !data.weight) {
      // If only measurements were logged, switch to Measurements tab
      setTimeout(() => {
        setActiveTab('measurements');
      }, 500);
    }
    
    // TODO: Save to Supabase
    // - Upload photo to Supabase Storage
    // - Save measurements to profiles table
    // - Create progress entry with photo URL
    
    // Build success message based on what was logged
    const loggedItems = [];
    if (data.weight) loggedItems.push('weight');
    if (data.chest || data.waist || data.hips) loggedItems.push('measurements');
    if (data.photo) loggedItems.push('photo');
    
    const message = loggedItems.length > 0
      ? `✅ Progress logged successfully! (${loggedItems.join(', ')})`
      : '✅ Progress logged successfully!';
    
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
          <p className="text-green-800 dark:text-green-300 font-medium flex-1">
            {successMessage}
          </p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            My Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your fitness journey and celebrate your wins
          </p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setIsLogModalOpen(true)}
        >
          Log Progress
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Weight</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {currentWeight} <span className="text-lg">lbs</span>
                </h3>
                <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${weightChange < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {weightChange < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  <span>{Math.abs(weightChange)} lbs ({weightChangePercent}%)</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Scale className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Waist</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  32 <span className="text-lg">in</span>
                </h3>
                <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                  <TrendingDown className="w-4 h-4" />
                  <span>-2 in (5.9%)</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Ruler className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chest</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  43.5 <span className="text-lg">in</span>
                </h3>
                <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>+1.5 in (3.6%)</span>
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        {(['weight', 'measurements', 'photos'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === tab
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'weight' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
              Weight Tracking
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                  <XAxis 
                    dataKey="date" 
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    domain={['dataMin - 5', 'dataMax + 5']}
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 17, 17, 0.95)',
                      border: '1px solid rgba(106, 255, 183, 0.2)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#6AFFB7" 
                    strokeWidth={3}
                    dot={{ fill: '#6AFFB7', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'measurements' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
              Body Measurements
            </h2>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={measurementData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                  <XAxis 
                    dataKey="date"
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    className="text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 17, 17, 0.95)',
                      border: '1px solid rgba(106, 255, 183, 0.2)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="chest" 
                    stroke="#6AFFB7" 
                    strokeWidth={2}
                    dot={{ fill: '#6AFFB7', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="waist" 
                    stroke="#60A5FA" 
                    strokeWidth={2}
                    dot={{ fill: '#60A5FA', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hips" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'photos' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Progress Photos
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<Camera className="w-4 h-4" />}
                onClick={() => setIsLogModalOpen(true)}
              >
                Upload Photo
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {progressPhotos.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Progress Photos Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start tracking your transformation by uploading your first progress photo!
                </p>
                <Button 
                  variant="primary" 
                  leftIcon={<Plus className="w-5 h-5" />}
                  onClick={() => setIsLogModalOpen(true)}
                >
                  Upload Your First Photo
                </Button>
              </div>
            ) : (
              /* Photos Grid */
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {progressPhotos.map((photo) => (
                  <div key={photo.id} className="relative group cursor-pointer">
                    <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
                      <img 
                        src={photo.imageUrl} 
                        alt={`Progress ${photo.date}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                      {new Date(photo.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
                {/* Add Photo Button */}
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="aspect-[3/4] bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Camera className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Add Photo
                  </p>
                </button>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Log Progress Modal */}
      <LogProgressModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleSaveProgress}
      />
    </div>
  );
};

