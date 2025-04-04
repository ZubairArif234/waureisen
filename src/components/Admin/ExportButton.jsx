// src/components/Admin/ExportButton.jsx
import React from 'react';
import { Download } from 'lucide-react';
import { exportToExcel } from '../../utils/exportUtils';

const ExportButton = ({ data, filename, className }) => {
  const handleExport = () => {
    exportToExcel(data, filename);
  };

  return (
    <button
      onClick={handleExport}
      className={`flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ${className}`}
    >
      <Download className="w-5 h-5" />
      <span>Export</span>
    </button>
  );
};

export default ExportButton;