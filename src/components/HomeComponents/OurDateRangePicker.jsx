import React, { useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { BadgeInfo, ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ month, year, selectedRange, onDateSelect, bookedDates,setErrorText }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate calendar structure
  const { weeks, monthData } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array(daysInMonth).fill().map((_, i) => i + 1);
    
    // Create week structure
    const weeks = [];
    let week = Array(7).fill(null);
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    firstDayOfMonth = (firstDayOfMonth + 6) % 7; // Convert Sunday=0 to Monday=0
    
    // Fill empty days at start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      week[i] = null;
    }
    
    // Fill actual days
    days.forEach((day, index) => {
      const weekDay = (firstDayOfMonth + index) % 7;
      week[weekDay] = day;
      
      if (weekDay === 6 || index === days.length - 1) {
        weeks.push([...week]);
        week = Array(7).fill(null);
      }
    });

    // Convert booked dates to Set for faster lookup
    const bookedDateSet = new Set(
      (bookedDates || []).map(dateStr => {
        // Handle both ISO string format and simple date format
        const date = new Date(dateStr);
        // Get local date string in YYYY-MM-DD format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })
    );

    // Pre-calculate date availability for this month
    const monthData = {};
    days.forEach(day => {
      const date = new Date(year, month, day);
      // Get local date string in YYYY-MM-DD format for comparison
      const year_str = date.getFullYear();
      const month_str = String(date.getMonth() + 1).padStart(2, '0');
      const day_str = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year_str}-${month_str}-${day_str}`;
      
      const isBooked = bookedDateSet.has(dateStr);
      
      monthData[day] = {
        date,
        isAvailable: date >= today && !isBooked,
        isPast: date < today,
        isBooked
      };
    });

    return { weeks, monthData };
  }, [month, year, today, bookedDates]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Helper functions
  const isDateInRange = useCallback((day) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    const date = new Date(year, month, day);
    return date > selectedRange.start && date < selectedRange.end;
  }, [selectedRange.start, selectedRange.end, year, month]);

  const isStartDate = useCallback((day) => {
    if (!selectedRange.start) return false;
    const date = new Date(year, month, day);
    return date.getTime() === selectedRange.start.getTime();
  }, [selectedRange.start, year, month]);

  const isEndDate = useCallback((day) => {
    if (!selectedRange.end) return false;
    const date = new Date(year, month, day);
    return date.getTime() === selectedRange.end.getTime();
  }, [selectedRange.end, year, month]);

  return (
    <div className="bg-white rounded-xl p-6 max-w-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {monthNames[month]} {year}
        </h2>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, i) => (
          <div key={i} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            if (day === null) return <div key={`${weekIndex}-${dayIndex}`} />;

            const dayData = monthData[day];
            const date = dayData.date;
            const isToday = date.toDateString() === today.toDateString();
            const isAvailable = dayData.isAvailable;
            const isPast = dayData.isPast;
            const isBooked = dayData.isBooked;

            const isSelected = isDateInRange(day);
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);

            let dayClass = "w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-colors";

            // Determine styling and clickability
            if (isPast) {
              dayClass += " text-gray-300 cursor-not-allowed";
            } else if (isBooked) {
              dayClass += "  text-gray-300 cursor-not-allowed line-through";
            } else if (isAvailable) {
              dayClass += " text-yellow-600 font-semibold hover:bg-gray-100 cursor-pointer";
            }

            // Selected state styling
            if (isAvailable && !isBooked) {
              if (isSelected && !isStart && !isEnd) {
                dayClass += " bg-brand !text-white";
              }
              if (isStart || isEnd) {
                dayClass += " bg-brand !text-white hover:bg-brand";
              }
            }

            const handleClick = () => {
              if (!isAvailable || isBooked) return;
              onDateSelect(date);
            };

            const getTitle = () => {
              if (isPast) return "Past date";
              if (isBooked) return "Booked - Unavailable";
              if (isAvailable) return "Available";
              return "Not available";
            };

            return (
              <button
                key={`${weekIndex}-${dayIndex}`}
                onClick={handleClick}
                disabled={!isAvailable || isBooked}
                className={dayClass}
                title={getTitle()}
              >
                {day}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

const OurDateRangePicker = ({ isOpen, onClose, selectedRange, onRangeSelect, bookedDates }) => {
  if (!isOpen) return null;

  const today = new Date();
  const [errorText, setErrorText] = useState('');
  const [leftMonth, setLeftMonth] = useState(today.getMonth());
  const [leftYear, setLeftYear] = useState(today.getFullYear());

  // Calculate right calendar month/year
  const rightMonth = (leftMonth + 1) % 12;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  // Helper function to check if there are any booked dates in a range
  const hasBookedDatesInRange = useCallback((startDate, endDate) => {
    if (!bookedDates || bookedDates.length === 0) return false;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return bookedDates.some(dateStr => {
      const bookedDate = new Date(dateStr);
      // Reset time to compare dates only
      bookedDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      return bookedDate > start && bookedDate < end;
    });
  }, [bookedDates]);

  const handleDateSelect = useCallback((date) => {
    // If both dates are selected, start fresh
    if (selectedRange.start && selectedRange.end) {
      onRangeSelect({ start: date, end: null });
      return;
    }

    // If clicking the same start date, clear selection
    if (selectedRange.start && !selectedRange.end) {
      if (date.getTime() === selectedRange.start.getTime()) {
        onRangeSelect({ start: null, end: null });
        return;
      }
    }

    // If no start date, set it
    if (!selectedRange.start) {
      onRangeSelect({ start: date, end: null });
      return;
    }

    // If start date exists but no end date
    if (selectedRange.start && !selectedRange.end) {
      if (date < selectedRange.start) {
        // If selected date is before start, make it the new start
        onRangeSelect({ start: date, end: null });
      } else {
        // Check if there are any booked dates in the range
        if (hasBookedDatesInRange(selectedRange.start, date)) {
          // Show alert or handle the conflict
          setErrorText("The selected date range contains booked dates. Please select a different range.");
          return;
        }
        // Set as end date
        onRangeSelect({ start: selectedRange.start, end: date });
      }
      return;
    }
  }, [selectedRange, onRangeSelect, hasBookedDatesInRange]);

  const handlePrevMonth = useCallback(() => {
    if (leftMonth === 0) {
      setLeftMonth(11);
      setLeftYear(leftYear - 1);
    } else {
      setLeftMonth(leftMonth - 1);
    }
  }, [leftMonth, leftYear]);

  const handleNextMonth = useCallback(() => {
    if (leftMonth === 11) {
      setLeftMonth(0);
      setLeftYear(leftYear + 1);
    } else {
      setLeftMonth(leftMonth + 1);
    }
  }, [leftMonth, leftYear]);

  const clearSelection = useCallback(() => {
    onRangeSelect({ start: null, end: null });
  }, [onRangeSelect]);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Dates</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>
        
       
        
        <div className="flex flex-col md:flex-row gap-4">
          <Calendar
            month={leftMonth}
            year={leftYear}
            selectedRange={selectedRange}
            onDateSelect={handleDateSelect}
            bookedDates={bookedDates}
            setErrorText={setErrorText}
          />
          <Calendar
            month={rightMonth}
            year={rightYear}
            selectedRange={selectedRange}
            onDateSelect={handleDateSelect}
            bookedDates={bookedDates}
            setErrorText={setErrorText}
          />
        </div>
         <div className={`${errorText ? 'opacity-100' : 'opacity-0'} flex items-center gap-4 bg-amber-100 border border-amber-300 text-amber-700 px-4 py-3 rounded transition-opacity duration-200`}>
          <BadgeInfo className='text-amber-700' />
          <p>{errorText}</p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={handlePrevMonth} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {(selectedRange.start || selectedRange.end) && (
            <button
              onClick={clearSelection}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
            >
              Clear Selection
            </button>
          )}
          
          <button 
            onClick={handleNextMonth} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OurDateRangePicker;