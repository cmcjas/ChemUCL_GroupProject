'use client';

import PropTypes from 'prop-types';
import { React, useState } from 'react';

import SearchBar from 'components/search';
import VerticalTabs from './VerticalTabs';
import { VerticalTabsLite } from 'components/ui-elements/basic/UITabs/VerticalTabs';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Button, Box, Tab, Tabs, Typography } from '@mui/material';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

// tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box
          sx={{
            p: 3
          }}
        >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

// icon tab style
const AntTabs = styled(Tabs)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? theme.palette.dark[800] : theme.palette.primary.light,
  width: '100vh',
  borderRadius: '12px',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.secondary.main
  }
}));

// style constant
const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1),
  color: theme.palette.secondary.main,
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ].join(','),
  '&:hover': {
    color: theme.palette.secondary.main,
    opacity: 1
  },
  '&.Mui-selected': {
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.secondary.main
  }
}));

// ================================|| UI TABS - ICONS ||================================ //

export default function IconTabs(probs) {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const [activeTab, setActiveTab] = useState('tab3');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {activeTab === 'tab4' && <DisplayScan />}
      <AntTabs theme={theme} value={value} onChange={handleChange} aria-label="ant example">
        <h1>ChemUCL</h1>
        {activeTab === 'tab1' && <AntTab onClick={() => setActiveTab('tab3')} icon={<MenuTwoToneIcon sx={{ fontSize: '1.3rem' }} />} />}
        {activeTab !== 'tab1' && <AntTab onClick={() => setActiveTab('tab1')} icon={<MenuTwoToneIcon sx={{ fontSize: '1.3rem' }} />} />}
        <AntTab onClick={() => setActiveTab('tab2')} icon={<SearchIcon sx={{ fontSize: '1.3rem' }} />} />
        {activeTab === 'tab2' && <AntTab icon={<SearchBar />} />}
        <div style={{ marginLeft: 'auto', marginRight: '20px', marginTop: '10px' }}>
          <Button onClick={() => setActiveTab('tab4')} startIcon={<QrCodeScannerIcon />} aria-label="two layers">
            Scan
          </Button>
        </div>
      </AntTabs>
      {activeTab === 'tab2' && <VerticalTabsLite />}
      {activeTab === 'tab3' && <VerticalTabsLite />}
      {activeTab === 'tab4' && <VerticalTabsLite />}
      {activeTab === 'tab1' && <VerticalTabs />}
    </>
  );
}
