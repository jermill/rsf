import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar, Clock, User, MapPin, Video, DollarSign, X, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { createCalendarEventFromBooking, addToCalendar } from '../../utils/calendarUtils';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    date: string;
    time: string;
    service: string;
    price: number;
    trainer: string;
    location: 'in-person' | 'online';
    duration?: number;
  };
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  const handleAddToCalendar = (provider: 'google' | 'apple' | 'outlook') => {
    const calendarEvent = createCalendarEventFromBooking(booking);
    addToCalendar(calendarEvent, provider);
    setShowCalendarOptions(false);
    
    // Show success feedback
    console.log(`✅ Added to ${provider} calendar`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Success Header */}
              <div className="bg-gradient-to-br from-primary to-primary-dark p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-white/80 text-sm">
                  Your session has been successfully scheduled
                </p>
              </div>

              {/* Booking Details */}
              <div className="p-6 space-y-4">
                {/* Date */}
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Date
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {booking.date}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Time
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {booking.time}
                    </p>
                  </div>
                </div>

                {/* Service */}
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10">
                    <User className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Service & Trainer
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {booking.service}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.trainer}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10">
                    {booking.location === 'online' ? (
                      <Video className="w-5 h-5 text-green-500" />
                    ) : (
                      <MapPin className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Location
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {booking.location === 'online' ? 'Online Session' : 'In-Person at Gym'}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-start gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/10">
                    <DollarSign className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Total Price
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ${booking.price}
                    </p>
                  </div>
                </div>

                {/* Info Message */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    📧 A confirmation email has been sent to your inbox with all the details.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4">
                  {/* Add to Calendar Options */}
                  {showCalendarOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      <button
                        onClick={() => handleAddToCalendar('google')}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">Google</span>
                      </button>
                      
                      <button
                        onClick={() => handleAddToCalendar('apple')}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-800 dark:bg-white flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white dark:text-gray-800" />
                        </div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">Apple</span>
                      </button>
                      
                      <button
                        onClick={() => handleAddToCalendar('outlook')}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">Outlook</span>
                      </button>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                      rightIcon={<ChevronDown className={`w-4 h-4 transition-transform ${showCalendarOptions ? 'rotate-180' : ''}`} />}
                      className="flex-1"
                    >
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

