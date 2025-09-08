// Utility function to export data as CSV
export const exportToCSV = (data, filename, headers = null) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from the first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Headers row
    csvHeaders.join(','),
    // Data rows
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        // Handle values that contain commas, quotes, or newlines
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Helper function to format data for specific table types
export const formatDataForExport = (data, type) => {
  switch (type) {
    case 'hvac':
      return data.map(item => ({
        'Ship Name': item.ship_name || '',
        'Date of Trials': item.date_of_trials || '',
        'Place of Trials': item.place_of_trials || '',
        'Document No': item.document_no || '',
        'Occasion': item.occasion_of_trials || '',
        'Authority': item.authority_for_trials || '',
        'Air Flow Measurements': item.airflow_measurements?.length || 0,
        'Machinery Measurements': item.machinery_airflow_measurements?.length || 0,
        'Status': 'Active'
      }));
    
    case 'quarterly-survey':
      return data.map(item => ({
        'Quarter': item.quarter || '',
        'Date': item.date || '',
        'Ship': item.ship || '',
        'Reporting Officer': item.reporting_officer || '',
        'Status': item.status || '',
        'Total Defects': item.defects?.length || 0
      }));
    
    case 'docking':
      return data.map(item => ({
        'Vessel Name': item.vessel_name || '',
        'Docking Purpose': item.docking_purpose || '',
        'Status': item.status || '',
        'Created Date': item.created_date || '',
        'Refitting Authority': item.refitting_authority || '',
        'Command HQ': item.command_hq || '',
        'Vessel Length': item.vessel_length || '',
        'Vessel Beam': item.vessel_beam || '',
        'Vessel Draught': item.vessel_draught || ''
      }));
    
    case 'survey':
      return data.map(item => ({
        'Ship Name': item.ship_name || '',
        'Quarter': item.quarter || '',
        'Survey Date': item.survey_date || '',
        'Reporting Officer': item.reporting_officer || '',
        'Total Defects': item.total_defects || 0,
        'Critical Defects': item.critical_defects || 0,
        'Minor Defects': item.minor_defects || 0,
        'Resolved Defects': item.resolved_defects || 0,
        'Status': item.status || '',
        'Return Delayed': item.return_delayed ? 'Yes' : 'No',
        'Entire Ship Surveyed': item.entire_ship_surveyed ? 'Yes' : 'No'
      }));
    
    default:
      return data;
  }
};
