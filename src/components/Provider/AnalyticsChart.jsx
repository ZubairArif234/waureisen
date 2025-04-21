import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../utils/LanguageContext';

const AnalyticsChart = ({ 
  data, 
  title,
  description,
  dataKey,
  loading,
  color = '#B4A481',
  labelFormatter,
  tooltipFormatter
}) => {
  const { t } = useLanguage();
  
  // Prepare chart data
  const chartData = data && data.labels ? 
    data.labels.map((label, index) => ({
      name: label,
      [dataKey]: data[dataKey][index]
    })) : [];
  
  const defaultLabelFormatter = (value) => value;
  const defaultTooltipFormatter = (value) => [value, dataKey === 'revenue' ? 'CHF' : t('bookings')];
  
  const formatLabel = labelFormatter || defaultLabelFormatter;
  const formatTooltip = tooltipFormatter || defaultTooltipFormatter;
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm h-80 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              tickFormatter={formatLabel}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => Math.round(value)}
              allowDecimals={false}
              domain={[0, 'auto']}
            />
            <Tooltip 
              formatter={formatTooltip} 
              labelFormatter={(label) => label}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              activeDot={{ r: 6 }}
              strokeWidth={2}
              name={dataKey === 'revenue' ? t('revenue') : t('bookings')}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;