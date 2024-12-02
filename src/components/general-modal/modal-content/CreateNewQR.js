'use client';

import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Tab, Tabs, Typography } from '@mui/material';

// assets
import ScienceIcon from '@mui/icons-material/Science';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import CreateIcon from '@mui/icons-material/Create';

// project imports
import GenerateNewQR from 'components/general-modal/modal-content/tab-content/GenerateNewQR';
import ManualNewQR from 'components/general-modal/modal-content/tab-content/ManualNewQR';
// tab content customize
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ================================|| UI TABS - COLOR ||================================ //

export default function ColorTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
        variant="scrollable"
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        sx={{
          mb: 3,
          '& a': {
            minHeight: 'auto',
            minWidth: 10,
            py: 1.5,
            px: 1,
            mr: 2.2,
            color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          },
          '& a.Mui-selected': {
            color: theme.palette.primary.main
          },
          '& a > svg': {
            mb: '0px !important',
            mr: 1.1
          }
        }}
      >
        <Tab component={Link} href="#" icon={<AutoModeIcon sx={{ fontSize: '1.3rem' }} />} label="Auto Generate" {...a11yProps(0)} />
        <Tab component={Link} href="#" icon={<CreateIcon sx={{ fontSize: '1.3rem' }} />} label="Manually Generate" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <GenerateNewQR />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ManualNewQR />
      </TabPanel>
    </>
  );
}
