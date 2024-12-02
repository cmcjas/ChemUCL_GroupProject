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

// project imports
import ChemicalTab from './tab-content/ChemicalTab';
import LocationTab from './tab-content/LocationTab';
import QuartzyLinkTab from './tab-content/QuartzyLinkTab';

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

export default function ColorTabs({data, onClose}) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Ensure the data object is structured correctly before passing it to child components
  const qrData = { qrID: data.qrID };

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
        <Tab component={Link} href="#" icon={<ScienceIcon sx={{ fontSize: '1.3rem' }} />} label="Chemical" {...a11yProps(0)} />
        <Tab component={Link} href="#" icon={<DatasetLinkedIcon sx={{ fontSize: '1.3rem' }} />} label="Quartzy Link" {...a11yProps(1)} />
        <Tab component={Link} href="#" icon={<LocationOnIcon sx={{ fontSize: '1.3rem' }} />} label="Location" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ChemicalTab data={qrData} onClose={onClose} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <QuartzyLinkTab data={qrData} onClose={onClose} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <LocationTab data={qrData} onClose={onClose} />
      </TabPanel>
    </>
  );
}
