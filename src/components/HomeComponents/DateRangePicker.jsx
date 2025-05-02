import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment'; // Import moment for date comparison
import { useLanguage } from '../../utils/LanguageContext';

const Calendar = ({ month, year, selectedRange, onDateSelect, availableDates }) => {
  const { t } = useLanguage();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Parse availableDates strings into moment objects for comparison
  const availableMoments = availableDates?.map(dateStr => moment(dateStr, 'YYYY-MM-DD'));

  const days = Array(daysInMonth).fill().map((_, i) => i + 1);
  const weeks = [];
  let week = Array(7).fill(null);
  
  // Fill in the blank days at the start
  for (let i = 0; i < firstDayOfMonth; i++) {
    week[i] = null;
  }
  
  // Fill in the days
  days.forEach((day, index) => {
    const weekDay = (firstDayOfMonth + index) % 7;
    week[weekDay] = day;
    
    if (weekDay === 6 || index === days.length - 1) {
      weeks.push([...week]);
      week = Array(7).fill(null);
    }
  });

  const monthNames = [
    t('January'), t('February'), t('March'), t('April'), t('May'), t('June'),
    t('July'), t('August'), t('September'), t('October'), t('November'), t('December')
  ];

  const dayNames = [t('Mo'), t('Tu'), t('We'), t('Th'), t('Fr'), t('Sa'), t('Su')];

  const isDateInRange = (day) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    const date = new Date(year, month, day);
    return date >= selectedRange.start && date <= selectedRange.end;
  };

  const isStartDate = (day) => {
    if (!selectedRange.start) return false;
    const date = new Date(year, month, day);
    return date.getTime() === selectedRange.start.getTime();
  };

  const isEndDate = (day) => {
    if (!selectedRange.end) return false;
    const date = new Date(year, month, day);
    return date.getTime() === selectedRange.end.getTime();
  };

  const isDateAvailable = (day) => {
    // If no availability data, all future dates are available
    if (!availableMoments || availableMoments.length === 0) {
      const date = new Date(year, month, day);
      return date >= today;
    }
    
    const currentDate = moment({ year, month, day });
    return currentDate.isSameOrAfter(moment(), 'day') && availableMoments.some(availableMoment => {
      const startDate = availableMoment;
      const endDate = availableMoment.clone().add(7, 'days');
      return currentDate.isBetween(startDate, endDate, 'day', '[]');
    });
  };

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
            
            const date = new Date(year, month, day);
            const isToday = date.getTime() === today.getTime();
            const isSelected = isDateInRange(day);
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);
            const isPast = date < today;
            
            return (
              <button
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => !isPast && onDateSelect(new Date(year, month, day))}
                disabled={isPast}
                className={`
                  w-full aspect-square flex items-center justify-center rounded-lg text-sm
                  ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                  ${isSelected ? 'bg-brand/10 text-brand' : ''}
                  ${isStart ? 'bg-brand text-white hover:bg-brand' : ''}
                  ${isEnd ? 'bg-brand text-white hover:bg-brand' : ''}
                  ${isToday ? 'border border-brand' : ''}
                `}
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

const DateRangePicker = ({ isOpen, onClose, selectedRange, onRangeSelect, availableDates }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const today = new Date();
  const [leftMonth, setLeftMonth] = React.useState(today.getMonth());
  const [leftYear, setLeftYear] = React.useState(today.getFullYear());

  const handleDateSelect = (date) => {
    // If we have both dates selected, clicking any new date should start a new selection
    if (selectedRange.start && selectedRange.end) {
      onRangeSelect({ start: date, end: null });
      return;
    }

    // If we only have a start date, clicking a date before it should start a new selection
    if (selectedRange.start && !selectedRange.end) {
      if (date < selectedRange.start) {
        onRangeSelect({ start: date, end: null });
        return;
      }
      onRangeSelect({ start: selectedRange.start, end: date });
      return;
    }

    // If we have no dates selected, start a new selection
    onRangeSelect({ start: date, end: null });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('select_dates')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Calendar
            month={leftMonth}
            year={leftYear}
            selectedRange={selectedRange}
            onDateSelect={handleDateSelect}
            availableDates={availableDates} // Pass availableDates down
          />
          <Calendar
            month={(leftMonth + 1) % 12}
            year={leftMonth === 11 ? leftYear + 1 : leftYear}
            selectedRange={selectedRange}
            onDateSelect={handleDateSelect}
            availableDates={availableDates} // Pass availableDates down
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => {
              if (leftMonth === 0) {
                setLeftMonth(11);
                setLeftYear(leftYear - 1);
              } else {
                setLeftMonth(leftMonth - 1);
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => {
              if (leftMonth === 11) {
                setLeftMonth(0);
                setLeftYear(leftYear + 1);
              } else {
                setLeftMonth(leftMonth + 1);
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;