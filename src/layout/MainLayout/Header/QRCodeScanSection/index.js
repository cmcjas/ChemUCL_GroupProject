import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { IconQrcode } from '@tabler/icons-react';
import QRCodePopUp from './QRCodePopUp';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import Transitions from 'components/ui-component/extended/Transitions';

const QRCodeScanSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          ml: 2,
          [theme.breakpoints.down('lg')]: {
            mr: 2
          }
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
            color: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
            '&:hover': {
              background: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
              color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.secondary.light
            }
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="inherit"
        >
          {/* Use the desired QR Code icon component */}
          <IconQrcode stroke={1.5} size="20px" />
        </Avatar>
      </Box>

      <QRCodePopUp open={open} onClose={handleClose} />

      <Popper
      /* placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl= {anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [matchesXs ? 5 : 0, 20]
            },
          },
          {
            name: 'preventOverflow',
            options: {
              enabled: true
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Button size='small'>
                      Scan QR Code
                    </Button>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )} */
      />
    </>
  );
};

export default QRCodeScanSection;
