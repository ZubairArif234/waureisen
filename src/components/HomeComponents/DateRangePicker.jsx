import React, { useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { BadgeInfo, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment';
import { useLanguage } from '../../utils/LanguageContext';

const Calendar = ({ month, year, selectedRange, onDateSelect, availableDates, bookedDates, vacanciesDate, setMinStayText }) => {
  const { t } = useLanguage();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Memoize expensive calculations
  const memoizedData = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array(daysInMonth).fill().map((_, i) => i + 1);
    
    // Pre-calculate week structure
    const weeks = [];
    let week = Array(7).fill(null);
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    firstDayOfMonth = (firstDayOfMonth + 6) % 7;
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      week[i] = null;
    }
    
    days.forEach((day, index) => {
      const weekDay = (firstDayOfMonth + index) % 7;
      week[weekDay] = day;
      
      if (weekDay === 6 || index === days.length - 1) {
        weeks.push([...week]);
        week = Array(7).fill(null);
      }
    });

    // Pre-calculate availability data for this month
    const monthAvailability = {};
    const monthMinStay = {};
    const bookedSet = new Set();
    
    // Convert booked dates to Set for O(1) lookup
    if (bookedDates) {
      bookedDates.forEach(item => {
        bookedSet.add(moment(item).format("YYYY-MM-DD"));
      });
    }
    
    // Pre-calculate all dates for this month
    days.forEach(day => {
      const paddedMonth = (month + 1).toString().padStart(2, "0");
      const paddedDay = day.toString().padStart(2, "0");
      const targetDate = `${year}-${paddedMonth}-${paddedDay}`;
      
      const currentDate = moment({ year, month, day });
      const isPast = currentDate.isBefore(moment(), 'day');
      const isBooked = bookedSet.has(targetDate);
      
      if (isPast || isBooked) {
        monthAvailability[day] = false;
        monthMinStay[day] = 1;
        return;
      }
      
      if (!vacanciesDate || vacanciesDate?.day?.length === 0) {
        monthAvailability[day] = true;
        monthMinStay[day] = 1;
        return;
      }
      
      const dayData = vacanciesDate.day.find(d => d.date === targetDate);
      if (!dayData) {
        monthAvailability[day] = false;
        monthMinStay[day] = 1;
        return;
      }
      
      const isAvailable = (dayData.state === "Y" && dayData.allotment > 0 && dayData.change !== "X") || 
                         (dayData.state === "N" && dayData.allotment === 0 && dayData.change === "O") && 
                         !(dayData.state === "Y" && dayData.allotment > 0 && dayData.change === "O");
      
      monthAvailability[day] = isAvailable;
      monthMinStay[day] = dayData.minimumStay || 1;
    });

    return { weeks, monthAvailability, monthMinStay, bookedSet };
  }, [month, year, vacanciesDate, bookedDates]);

  const monthNames = useMemo(() => [
    t('January'), t('February'), t('March'), t('April'), t('May'), t('June'),
    t('July'), t('August'), t('September'), t('October'), t('November'), t('December')
  ], [t]);

  const dayNames = useMemo(() => [t('Mo'), t('Tu'), t('We'), t('Th'), t('Fr'), t('Sa'), t('Su')], [t]);

  // Optimized helper functions using memoized data
  const isDateInRange = useCallback((day) => {
    if (!selectedRange.start || !selectedRange.end) return false;
    const date = new Date(year, month, day);
    return date >= selectedRange.start && date <= selectedRange.end;
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

  const isDateAvailable = useCallback((day) => {
    return memoizedData.monthAvailability[day] || false;
  }, [memoizedData.monthAvailability]);

  const canBeStartDate = useCallback((day) => {
    if (!isDateAvailable(day)) return false;
    
    const minStay = memoizedData.monthMinStay[day];
    if (minStay <= 1) return true;
    
    // Quick check for consecutive dates
    const paddedMonth = (month + 1).toString().padStart(2, "0");
    const paddedDay = day.toString().padStart(2, "0");
    const targetDate = `${year}-${paddedMonth}-${paddedDay}`;
    const startMoment = moment(targetDate);
    
    for (let i = 1; i < minStay; i++) {
      const nextDate = startMoment.clone().add(i, 'days');
      const nextYear = nextDate.year();
      const nextMonth = nextDate.month();
      const nextDay = nextDate.date();
      
      // If checking dates in different months, use original logic
      if (nextMonth !== month || nextYear !== year) {
        const nextDateStr = nextDate.format('YYYY-MM-DD');
        const nextDayData = vacanciesDate?.day?.find(d => d.date === nextDateStr);
        
        if (!nextDayData || 
            nextDayData.state !== "Y" || 
            nextDayData.allotment <= 0 || 
            nextDayData.change === "X") {
          return false;
        }
      } else {
        // Use memoized data for same month
        if (!memoizedData.monthAvailability[nextDay]) {
          return false;
        }
      }
    }
    
    return true;
  }, [isDateAvailable, memoizedData.monthMinStay, memoizedData.monthAvailability, month, year, vacanciesDate]);

  const minStayRangeDates = useMemo(() => {
    if (!vacanciesDate || !vacanciesDate.day) return new Set();
    
    const rangeDates = new Set();
    
    // Only process dates for current month to avoid expensive calculations
    for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
      const minStay = memoizedData.monthMinStay[day];
      
      if (minStay > 1 && canBeStartDate(day)) {
        const paddedMonth = (month + 1).toString().padStart(2, "0");
        const paddedDay = day.toString().padStart(2, "0");
        const targetDate = `${year}-${paddedMonth}-${paddedDay}`;
        const startMoment = moment(targetDate);
        
        for (let i = 0; i < minStay + 1; i++) {
          const rangeDate = startMoment.clone().add(i, 'days').format('YYYY-MM-DD');
          rangeDates.add(rangeDate);
        }
      }
    }
    
    return rangeDates;
  }, [memoizedData.monthMinStay, canBeStartDate, month, year]);

  const isMinStayRangeDate = useCallback((day) => {
    const paddedMonth = (month + 1).toString().padStart(2, "0");
    const paddedDay = day.toString().padStart(2, "0");
    const fullDate = `${year}-${paddedMonth}-${paddedDay}`;
    
    return minStayRangeDates.has(fullDate) && !canBeStartDate(day);
  }, [minStayRangeDates, canBeStartDate, month, year]);

  const handleMinStayText = useCallback((day) => {
    const isMinStayRange = isMinStayRangeDate(day);
    if (isMinStayRange) return false;
    
    const minStay = memoizedData.monthMinStay[day];
    if (minStay && minStay > 1) {
      setMinStayText(`${t("possible_dates")} ${minStay} ${t("nights")}.`);
      return true;
    }
    return false;
  }, [isMinStayRangeDate, memoizedData.monthMinStay, setMinStayText]);

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
        {memoizedData?.weeks.map((week, weekIndex) =>
          week?.map((day, dayIndex) => {
            if (day === null) return <div key={`${weekIndex}-${dayIndex}`} />;

            const date = new Date(year, month, day);
            const paddedMonth = (month + 1).toString().padStart(2, "0");
            const paddedDay = day.toString().padStart(2, "0");
            const fullDate = `${year}-${paddedMonth}-${paddedDay}`;

            const isBooked = memoizedData.bookedSet.has(fullDate);
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today;

            const isAvailable = isDateAvailable(day);
            const canStart = canBeStartDate(day);
            const isMinStayRange = isMinStayRangeDate(day);

            const isSelected = isDateInRange(day);
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);

            let dayClass = "w-full aspect-square flex items-center justify-center rounded-lg text-sm";
            let clickable = false;

            // Determine styling and clickability
            if (!isAvailable || isPast || isBooked) {
              dayClass += " text-gray-300 cursor-not-allowed";
            } else if (canStart) {
              dayClass += " text-yellow-600 font-semibold hover:bg-gray-100 cursor-pointer";
              clickable = true;
            } else if (isMinStayRange) {
              dayClass += " bg-amber-50 text-slate-400 cursor-pointer";
              clickable = true;
            } else if (isAvailable) {
              dayClass += " text-brand hover:bg-gray-100 cursor-pointer";
              clickable = true;
            }
            
            // Selected, Start, End, Today styling (only on clickable days)
            if (clickable) {
              if (isSelected) {
                dayClass += " bg-brand !text-white";
              }
              if (isStart) {
                dayClass += " bg-brand text-white hover:bg-brand";
              }
              if (isEnd) {
                dayClass += " bg-brand text-white hover:bg-brand";
              }
              
            }

            const handleClick = () => {
              if (!clickable) return;
              const isMinStayRange = isMinStayRangeDate(day);
              if (!selectedRange.start && isMinStayRange) return;
              onDateSelect(new Date(year, month, day));
            };

            return (
              <button
                onMouseEnter={() => handleMinStayText(day)}
                onMouseLeave={() => setMinStayText("")}
                key={`${weekIndex}-${dayIndex}`}
                onClick={handleClick}
                disabled={!clickable}
                className={dayClass}
                title={
                  canStart ? "Available as start date" :
                  isMinStayRange ? "Available for end date selection" :
                  !isAvailable ? "Not available" : "Available"
                }
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

const DateRangePicker = ({ isOpen, onClose, selectedRange, onRangeSelect, availableDates, bookedDates, vacanciesDate }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const today = new Date();
  
  const [minStayText, setMinStayText] = useState("");
  const [leftMonth, setLeftMonth] = useState(today.getMonth());
  const [leftYear, setLeftYear] = useState(today.getFullYear());

  // Calculate right calendar month/year
  const rightMonth = (leftMonth + 1) % 12;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  // Memoize the minimum stay lookup
  const getMinimumStayForDate = useCallback((date) => {
    const paddedMonth = (date.getMonth() + 1).toString().padStart(2, "0");
    const paddedDay = date.getDate().toString().padStart(2, "0");
    const targetDate = `${date.getFullYear()}-${paddedMonth}-${paddedDay}`;
    
    const dayData = vacanciesDate?.day?.find(d => d.date === targetDate);
    return dayData?.minimumStay || 1;
  }, [vacanciesDate]);

  const handleDateSelect = useCallback((date) => {
    // Deselection logic
    if (selectedRange.start && selectedRange.end) {
      if (date.getTime() === selectedRange.start.getTime()) {
        onRangeSelect({ start: selectedRange.end, end: null });
        return;
      }
      if (date.getTime() === selectedRange.end.getTime()) {
        onRangeSelect({ start: selectedRange.start, end: null });
        return;
      }
      onRangeSelect({ start: date, end: null });
      return;
    }

    if (selectedRange.start && !selectedRange.end) {
      if (date.getTime() === selectedRange.start.getTime()) {
        onRangeSelect({ start: null, end: null });
        setMinStayText("");
        return;
      }
    }

    if (!selectedRange.start) {
      onRangeSelect({ start: date, end: null });
      return;
    }

    if (selectedRange.start && !selectedRange.end) {
      if (date < selectedRange.start) {
        onRangeSelect({ start: date, end: null });
        return;
      }
      
      const minStay = getMinimumStayForDate(selectedRange.start);
      const minEndDate = moment(selectedRange.start).add(minStay - 1, 'days').toDate();
      
      if (date < minEndDate) {
        setMinStayText(`Minimum stay is ${minStay} days. Please select a later end date.`);
        return;
      }

      // Optimized availability check - only check if we have vacancy data
      if (vacanciesDate && vacanciesDate.day && vacanciesDate.day.length > 0) {
        const startMoment = moment(selectedRange.start);
        const endMoment = moment(date);
        let allDatesAvailable = true;
        let unavailableDate = null;

        for (let checkDate = startMoment.clone(); checkDate.isSameOrBefore(endMoment); checkDate.add(1, 'day')) {
          const targetDate = checkDate.format('YYYY-MM-DD');
          
          // Quick past date check
          if (checkDate.isBefore(moment(), 'day')) {
            allDatesAvailable = false;
            unavailableDate = targetDate;
            break;
          }

          // Quick booked date check
          const isBooked = bookedDates?.some(item => moment(item).format("YYYY-MM-DD") === targetDate);
          if (isBooked) {
            allDatesAvailable = false;
            unavailableDate = targetDate;
            break;
          }

          const dayData = vacanciesDate.day.find(d => d.date === targetDate);
          if (!dayData) {
            allDatesAvailable = false;
            unavailableDate = targetDate;
            break;
          }
          
          const isAvailable = (dayData.state === "Y" && dayData.allotment > 0 && dayData.change !== "X") || 
                             (dayData.state === "N" && dayData.allotment === 0 && dayData.change === "O") && 
                             !(dayData.state === "Y" && dayData.allotment > 0 && dayData.change === "O");
          
          if (!isAvailable) {
            allDatesAvailable = false;
            unavailableDate = targetDate;
            break;
          }
        }

        if (!allDatesAvailable) {
          setMinStayText(`${t("cannot_select")} ${unavailableDate} ${t("not_available")}.`);
          return;
        }
      }

      onRangeSelect({ start: selectedRange.start, end: date });
      return;
    }
  }, [selectedRange, onRangeSelect, getMinimumStayForDate, setMinStayText, vacanciesDate, bookedDates]);

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
    setMinStayText("");
  }, [onRangeSelect, setMinStayText]);

  return ReactDOM.createPortal(
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
            availableDates={availableDates}
            bookedDates={bookedDates}
            vacanciesDate={vacanciesDate}
            setMinStayText={setMinStayText}
          />
          <Calendar
            month={rightMonth}
            year={rightYear}
            selectedRange={selectedRange}
            onDateSelect={handleDateSelect}
            availableDates={availableDates}
            bookedDates={bookedDates}
            vacanciesDate={vacanciesDate}
            setMinStayText={setMinStayText}
          />
        </div>

        <div className={`${minStayText ? 'opacity-100' : 'opacity-0'} flex items-center gap-4 bg-amber-100 border border-amber-300 text-amber-700 px-4 py-3 rounded transition-opacity duration-200`}>
          <BadgeInfo className='text-amber-700' />
          <p>{minStayText}</p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {(selectedRange.start || selectedRange.end) && (
            <button
              onClick={clearSelection}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
            >
              {t("clear-selection")}
              
            </button>
          )}
          
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DateRangePicker;