import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, MapPin, Video, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { BookingConfirmationModal } from '../../ui/BookingConfirmationModal';

interface TimeSlot {
  time: string;
  available: boolean;
  trainer?: string;
}

const serviceTypes = [
  { id: 'personal-training', name: 'Personal Training', duration: 60, price: 80 },
  { id: 'online-coaching', name: 'Online Coaching', duration: 45, price: 60 },
  { id: 'meal-planning', name: 'Meal Planning', duration: 30, price: 50 },
  { id: 'flex-mobility', name: 'Flex & Mobility', duration: 60, price: 120 },
];

const trainers = [
  { id: 'mike', name: 'Coach Mike', specialties: ['Strength', 'HIIT'] },
  { id: 'sarah', name: 'Coach Sarah', specialties: ['Nutrition', 'Recovery'] },
  { id: 'alex', name: 'Coach Alex', specialties: ['Cardio', 'Online'] },
];

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    slots.push({
      time: `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`,
      available: Math.random() > 0.3,
      trainer: trainers[Math.floor(Math.random() * trainers.length)].name,
    });
  }
  return slots;
};

export const ScheduleSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState(serviceTypes[0].id);
  const [selectedTrainer, setSelectedTrainer] = useState('any');
  const [selectedLocation, setSelectedLocation] = useState<'in-person' | 'online'>('in-person');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [timeSlots] = useState(generateTimeSlots());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Schedule & Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Book your next session with your coach
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Selection */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Select Service
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceTypes.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedService === service.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {service.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{service.duration} min</span>
                      <span className="font-medium text-primary">${service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Trainer & Location */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Preferences
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* Trainer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trainer
                </label>
                <select
                  value={selectedTrainer}
                  onChange={(e) => setSelectedTrainer(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="any">Any Available Trainer</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name} - {trainer.specialties.join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedLocation('in-person')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      selectedLocation === 'in-person'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <MapPin className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-sm font-medium">In-Person</p>
                  </button>
                  <button
                    onClick={() => setSelectedLocation('online')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      selectedLocation === 'online'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <Video className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-sm font-medium">Online</p>
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Available Times
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    disabled={!slot.available}
                    onClick={() => slot.available && setSelectedTimeSlot(slot.time)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      selectedTimeSlot === slot.time
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                        : slot.available
                        ? 'border-gray-300 dark:border-gray-700 hover:border-primary hover:bg-primary/5 cursor-pointer'
                        : 'border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{slot.time}</span>
                    </div>
                    {slot.available && slot.trainer && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {slot.trainer}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Calendar Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-1">
                  <button
                    onClick={prevMonth}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                        isSelected(day)
                          ? 'bg-primary text-dark font-bold'
                          : isToday(day)
                          ? 'bg-primary/20 text-primary font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Booking Summary */}
          <Card className="bg-primary/5 border-2 border-primary">
            <CardHeader>
              <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                Booking Summary
              </h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {selectedTimeSlot || 'Select a time'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {selectedTrainer === 'any' 
                    ? 'Any Available Trainer' 
                    : trainers.find(t => t.id === selectedTrainer)?.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {selectedLocation === 'online' ? (
                  <Video className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
                <span className="text-gray-900 dark:text-white">
                  {selectedLocation === 'online' ? 'Online' : 'In-Person'}
                </span>
              </div>
              <div className="pt-3 border-t border-primary/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${serviceTypes.find(s => s.id === selectedService)?.price}
                  </span>
                </div>
                <Button 
                  variant="primary" 
                  fullWidth 
                  leftIcon={<Plus className="w-5 h-5" />}
                  disabled={!selectedTimeSlot}
                  onClick={() => {
                    if (selectedTimeSlot) {
                      setIsConfirmationModalOpen(true);
                    }
                  }}
                >
                  {selectedTimeSlot ? 'Confirm Booking' : 'Select a Time Slot'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => {
          setIsConfirmationModalOpen(false);
          setSelectedTimeSlot(null); // Reset selection after closing
        }}
        booking={{
          date: selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          }),
          time: selectedTimeSlot || '',
          service: serviceTypes.find(s => s.id === selectedService)?.name || '',
          price: serviceTypes.find(s => s.id === selectedService)?.price || 0,
          trainer: selectedTrainer === 'any' 
            ? 'Any Available Trainer' 
            : trainers.find(t => t.id === selectedTrainer)?.name || '',
          location: selectedLocation,
          duration: serviceTypes.find(s => s.id === selectedService)?.duration || 60,
        }}
      />
    </div>
  );
};

