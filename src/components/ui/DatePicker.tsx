import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  maxDate?: string;
  minDate?: string;
  label: string;
  required?: boolean;
  isDark?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  maxDate,
  minDate,
  label,
  required = false,
  isDark = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value);
    return new Date();
  });

  const selectedDate = value ? new Date(value) : null;
  const today = new Date();
  const maxDateObj = maxDate ? new Date(maxDate) : null;
  const minDateObj = minDate ? new Date(minDate) : null;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    
    // Check if date is within allowed range
    if (maxDateObj && newDate > maxDateObj) return;
    if (minDateObj && newDate < minDateObj) return;

    const dateString = newDate.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(parseInt(e.target.value));
    setViewDate(newDate);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(parseInt(e.target.value));
    setViewDate(newDate);
  };

  const previousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(viewDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  // Generate year options (100 years back from today)
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="relative">
      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} {required && '*'}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
          isDark
            ? 'bg-gray-700 border-gray-600 text-white hover:border-khambi-accent'
            : 'bg-white border-gray-300 text-gray-900 hover:border-khambi-accent'
        } focus:outline-none focus:ring-2 focus:ring-khambi-accent/20`}
      >
        {value ? formatDisplayDate(value) : 'Select date'}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute z-50 mt-2 p-4 rounded-lg shadow-xl ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Month/Year Selectors */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <button
                type="button"
                onClick={previousMonth}
                className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-gray-700' : ''}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                <select
                  value={viewDate.getMonth()}
                  onChange={handleMonthChange}
                  className={`px-2 py-1 rounded border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {months.map((month, idx) => (
                    <option key={idx} value={idx}>{month}</option>
                  ))}
                </select>

                <select
                  value={viewDate.getFullYear()}
                  onChange={handleYearChange}
                  className={`px-2 py-1 rounded border ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={nextMonth}
                className={`p-2 rounded hover:bg-gray-100 ${isDark ? 'hover:bg-gray-700' : ''}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div
                  key={day}
                  className={`text-center text-xs font-semibold py-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {day}
                </div>
              ))}

              {blanks.map(blank => (
                <div key={`blank-${blank}`} className="p-2" />
              ))}

              {days.map(day => {
                const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                const isSelected = selectedDate && 
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getFullYear() === selectedDate.getFullYear();
                const isToday = 
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();
                const isDisabled = 
                  (maxDateObj && date > maxDateObj) ||
                  (minDateObj && date < minDateObj);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => !isDisabled && handleDateClick(day)}
                    disabled={isDisabled}
                    className={`p-2 text-sm rounded transition-colors ${
                      isSelected
                        ? 'bg-khambi-accent text-black font-semibold'
                        : isToday
                        ? isDark
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-900'
                        : isDark
                        ? 'text-white hover:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-100'
                    } ${
                      isDisabled
                        ? 'opacity-30 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Today Button */}
            <button
              type="button"
              onClick={() => {
                const todayStr = today.toISOString().split('T')[0];
                if (!maxDateObj || today <= maxDateObj) {
                  if (!minDateObj || today >= minDateObj) {
                    onChange(todayStr);
                    setIsOpen(false);
                  }
                }
              }}
              className={`w-full mt-3 py-2 rounded text-sm font-medium ${
                isDark
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
          </div>
        </>
      )}
    </div>
  );
};
