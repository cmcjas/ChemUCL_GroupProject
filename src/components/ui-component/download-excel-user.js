import React from 'react';
import {Button} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadExcelUser = () => {
  const handleDownload = () => {
    const excelData = [
      ['Full Name', 'Email', 'Role(Admin/Staff/Research Student)', 'Research Group'],
    ];
    const csvContent = excelData.map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Import User.csv'; 
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

export default DownloadExcelUser;