import { memo, useMemo } from 'react';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';
import useAuth from 'hooks/useAuth';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, Stack, useMediaQuery } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MenuCard from './MenuCard';
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import LogoutIcon from '@mui/icons-material/ExitToApp';

import { LAYOUT_CONST } from 'constant';
import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';

import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';


const Sidebar = () => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);

  const { layout, drawerType } = useConfig();

  const { logout, user } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };
    
  const logo = useMemo(
    () => (
      <Box sx={{ display: 'flex', p: 2 }}>
        <LogoSection />
      </Box>
    ),
    []
  );

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <MenuList />
        {/* Include other parts of your drawer content here */}
      </Box>
      {layout === LAYOUT_CONST.VERTICAL_LAYOUT && drawerOpen && (
        <Box sx={{ flexGrow: 0 }}>
          <MenuCard />
        </Box>
      )}
      {!drawerOpen && (
      <ListItemButton onClick={handleLogout} sx={{ position: 'absolute', bottom: 35, width: '100%' }}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        {drawerOpen && <ListItemText primary="Logout" />}
      </ListItemButton>
      )}
    </Box>
  );

  const drawerSX = {
    paddingLeft: drawerOpen ? '16px' : 0,
    paddingRight: drawerOpen ? '16px' : 0,
    marginTop: drawerOpen ? 0 : '20px',
    height: '100%' // Ensure the drawer content takes full height
  };

  const drawer = useMemo(
    () => (
      <>
        {matchDownMd ? (
          <Box sx={drawerSX}>{drawerContent}</Box>
        ) : (
          <PerfectScrollbar
            component="div"
            style={{
              height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
              ...drawerSX
            }}
          >
            {drawerContent}
          </PerfectScrollbar>
        )}
      </>
    ),
    [matchUpMd, drawerOpen, drawerType, layout]
  );

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
      {matchDownMd || (drawerType === LAYOUT_CONST.MINI_DRAWER && drawerOpen) ? (
        <Drawer
          variant={matchUpMd ? 'persistent' : 'temporary'}
          anchor="left"
          open={drawerOpen}
          onClose={() => dispatch(openDrawer(!drawerOpen))}
          sx={{
            '& .MuiDrawer-paper': {
              mt: matchDownMd ? 0 : 11,
              zIndex: 1099,
              width: drawerWidth,
              background: theme.palette.background.default,
              color: theme.palette.text.primary,
              borderRight: 'none',
              display: 'flex', // Make sure the drawer content is a flex container
              flexDirection: 'column' // Arrange items vertically
            }
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {matchDownMd && logo}
          {drawer}
        </Drawer>
      ) : (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {logo}
          {drawer}
        </MiniDrawerStyled>
      )}
    </Box>
  );
};

export default memo(Sidebar);
