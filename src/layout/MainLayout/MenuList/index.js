import { memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Divider, List, Typography, useMediaQuery } from '@mui/material';

// project imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import useConfig from 'hooks/useConfig';

// import menuItems from 'menu-items';
import userView from 'menu-items/index';
import { useSelector } from 'store';
import { LAYOUT_CONST } from 'constant';
import { HORIZONTAL_MAX_ITEM } from 'config';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const theme = useTheme();
  const menuItems = userView();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const { drawerOpen } = useSelector((state) => state.menu);
  const { layout } = useConfig();

  // last menu-item to show in horizontal menu bar
  const lastItem = layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd ? HORIZONTAL_MAX_ITEM : null;

  let lastItemIndex = menuItems.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < menuItems.length) {
    lastItemId = menuItems[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.slice(lastItem - 1, menuItems.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navItems = menuItems.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <List
              key={item.id}
              {...(drawerOpen && layout !== LAYOUT_CONST.HORIZONTAL_LAYOUT && { sx: { mt: 1.5 } })}
              disablePadding={!drawerOpen || layout === LAYOUT_CONST.HORIZONTAL_LAYOUT}
            >
              <NavItem item={item} level={1} isParents />
              {/* {layout !== LAYOUT_CONST.HORIZONTAL_LAYOUT && <Divider sx={{ py: 0.5 }} />} */}
            </List>
          );
        }
        return <NavGroup key={item.id} item={item} lastItem={lastItem} remItems={remItems} lastItemId={lastItemId} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return layout === LAYOUT_CONST.VERTICAL_LAYOUT || (layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && matchDownMd) ? (
    <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>
  ) : (
    <>{navItems}</>
  );
};

export default memo(MenuList);
