// src/utils/exportUtils.js

/**
 * Export data to Excel format
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name for the exported file
 */
export const exportToExcel = (data, filename = 'export') => {
    if (!data || !data.length) {
      console.error('No data to export');
      return;
    }
  
    // Get headers from the first item
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV format
    const csvContent = [
      // Add headers row
      headers.join(','),
      // Add data rows
      ...data.map(item => 
        headers.map(header => {
          // Handle values that need quotes (strings with commas, quotes, or newlines)
          const value = item[header] != null ? item[header].toString() : '';
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
  
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    // Add link to document
    document.body.appendChild(link);
    
    // Click the link to trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };