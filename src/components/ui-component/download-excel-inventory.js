import React from 'react';
import {Button} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadExcelInventory = () => {
  const handleDownload = () => {
    const excelData = [
      ['Qr Code', 'Quartzy Number', 'cas No', 'Chemical Name', 'Amount(units)','Supplier', 'Research Group', 'Unrestricted/Restricted','Building', 'Room', 'Sublocation 1', 'Sublocation 2','Sublocation 3', 'Sublocation 4', 'Description'],
    ];
    const csvContent = excelData.map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Import inventory template.csv'; 
    link.click();
  };

  return (
    <a
    href="#"
    style={{ cursor: 'pointer', color: '#ffffff', fontSize:'12px', marginLeft: '8px'}}
    onClick={(e) => {
      e.preventDefault();
      handleDownload();
    }}
  >
    Download CSV Template
  </a>
  );
};

export default DownloadExcelInventory;