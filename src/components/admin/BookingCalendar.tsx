import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface BookingCalendarProps {
  onNewBooking?: () => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onNewBooking }) => {
  // Only allow single date selection
  const [date, setDate] = useState<Date | null>(new Date());

  // Add custom CSS for dark mode calendar styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .react-calendar {
        background: rgba(15, 23, 42, 0.6) !important;
        border: 1px solid rgba(106, 255, 183, 0.2) !important;
        border-radius: 1rem !important;
        color: #f1f5f9 !important;
        padding: 1rem !important;
        font-family: inherit !important;
      }
      .react-calendar__navigation {
        margin-bottom: 1rem !important;
      }
      .react-calendar__navigation button {
        color: #6AFFB7 !important;
        font-size: 1.1rem !important;
        font-weight: 600 !important;
        background: transparent !important;
        border-radius: 0.5rem !important;
        padding: 0.5rem !important;
      }
      .react-calendar__navigation button:hover {
        background: rgba(106, 255, 183, 0.1) !important;
      }
      .react-calendar__navigation button:disabled {
        color: rgba(241, 245, 249, 0.3) !important;
      }
      .react-calendar__month-view__weekdays {
        color: rgba(106, 255, 183, 0.8) !important;
        font-weight: 600 !important;
        font-size: 0.85rem !important;
        text-transform: uppercase !important;
        padding: 0.5rem 0 !important;
      }
      .react-calendar__month-view__weekdays__weekday {
        text-align: center !important;
        padding: 0.5rem !important;
      }
      .react-calendar__tile {
        color: #f1f5f9 !important;
        background: transparent !important;
        border-radius: 0.5rem !important;
        padding: 0.75rem 0.5rem !important;
        font-size: 0.95rem !important;
        font-weight: 500 !important;
        aspect-ratio: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .react-calendar__tile:hover {
        background: rgba(106, 255, 183, 0.15) !important;
      }
      .react-calendar__tile--active {
        background: #1e40af !important;
        color: white !important;
        font-weight: 700 !important;
      }
      .react-calendar__tile--now {
        background: rgba(34, 211, 238, 0.15) !important;
        border: 1px solid #22d3ee !important;
      }
      .react-calendar__tile--now:hover {
        background: rgba(34, 211, 238, 0.25) !important;
      }
      .react-calendar__month-view__days__day--neighboringMonth {
        color: rgba(241, 245, 249, 0.3) !important;
      }
      .react-calendar__month-view__days__day--weekend {
        color: #f87171 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-dark/90 via-primary/10 to-cyan-900/20 shadow-2xl glassy p-2 sm:p-6 md:p-8 min-h-[370px] flex flex-col items-center justify-center w-full max-w-full">
      <div className="w-full flex flex-col items-center mb-4">
        <button
          className="mx-auto px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-dark font-bold shadow-lg hover:from-cyan-500 hover:to-primary transition text-lg border-2 border-primary/80 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-4"
          onClick={onNewBooking}
        >
          + New Booking
        </button>

      </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="min-w-[320px] w-full max-w-md mx-auto">
          <Calendar
            onChange={(d) => setDate(d as Date)}
            value={date}
            className="shadow-lg mx-auto"
            minDate={new Date()}
          />
        </div>
      </div>
      <div className="mt-6 text-cyan-200 text-base font-semibold text-center w-full">
        Selected date: <span className="font-bold text-primary">{date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'None selected'}</span>
      </div>
    </div>
  );
};

export default BookingCalendar;
