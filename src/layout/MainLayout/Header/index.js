// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { getSession, signIn, signOut} from 'next-auth/react';

// project imports
import { LAYOUT_CONST } from 'constant';
import useConfig from 'hooks/useConfig';
import SearchSection from './SearchSection';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';
import FullScreenSection from './FullScreenSection';
import LocalizationSection from './LocalizationSection';
import MegaMenuSection from './MegaMenuSection';
import NotificationSection from './NotificationSection';
import QRCodeScanSection from './QRCodeScanSection';
import QRCodeFilter from './QRCodeScanSection/QRCodeFilter';
import QRCodeScan from './QRCodeScanSection/QRCodeScan';
import Logo from 'components/ui-component/Logo';
import ChemInfo from 'components/ui-component/ChemInfo';
import CreateNewQR from 'components/general-modal/modal-content/CreateNewQR';
import GeneralModal from 'components/general-modal/GeneralModal';

import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';

// assets
import { IconMenu2, IconQrcode } from '@tabler/icons-react';
import PrintIcon from '@mui/icons-material/Print';
import { set } from 'lodash';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);

  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const { layout } = useConfig();

  const [modelOpen, setModelOpen] = useState(false);
  const [qrCodeScanOpen, setQRCodeScanOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); // New state for dynamic modal content
  const [modalMaxWidth, setModalMaxWidth] = useState('md'); // New state for dynamic maxWidth
  const [modalTitle, setModalTitle] = useState('QR Code Scan'); // New state for dynamic title

  // Callback to update modal content and maxWidth
  const handleScanResult = (component, maxWidth = 'md', title = "QR Code Scan") => {
    console.log('Max Width: ', maxWidth);
    setModalMaxWidth(maxWidth); // Update maxWidth based on the component
    setModalContent(component);
    setModalTitle(title); // Update title based on the component
    setQRCodeScanOpen(true); // Open the modal with the new content
  };

  const [userRole, setUserRole] = useState(null);

  const { data: session } = getSession();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        const role = session.user?.role;
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };
    fetchSession();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Left side elements */}
        <Box
          sx={{
            display: 'flex',
            width: 228,
            [theme.breakpoints.down('md')]: {
              width: 'auto'
            }
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
              <Logo />
          </Box>
          {(layout === LAYOUT_CONST.VERTICAL_LAYOUT || (layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && matchDownMd)) && (
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                overflow: 'hidden',
                transition: 'all .2s ease-in-out',
                background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                '&:hover': {
                  background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                  color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
                }
              }}
              onClick={() => dispatch(openDrawer(!drawerOpen))}
              color="inherit"
            >
              <IconMenu2 stroke={1.5} size="20px" />
            </Avatar>
          )}
        </Box>

        {/* Right side elements */}
        <Box>
        {(userRole === 'Admin') && (
          <Button
            sx={{ marginLeft: 4 }}
            startIcon={<PrintIcon />}
            size="large"
            variant="contained"
            color="primary"
            onClick={() => setModelOpen(true)}
          >
            New QR Code
          </Button>)}

          <GeneralModal open={modelOpen} childComponent={<CreateNewQR />} onClose={() => setModelOpen(false)} title="Create New QR Code" />
          <Button
            sx={{ marginLeft: 4 }}
            startIcon={<IconQrcode />} // Assuming the icon for scanning is the same as PrintIcon for demonstration
            size="large"
            variant="contained"
            color="primary"
            onClick={() => setQRCodeScanOpen(true)}
          >
            Scan
          </Button>
          <GeneralModal
            maxWidth={modalMaxWidth} // Use dynamic maxWidth
            open={qrCodeScanOpen}
            childComponent={modalContent || <QRCodeFilter onScanResult={(component, maxWidth, title) => handleScanResult(component, maxWidth, title)} onClose={() => setQRCodeScanOpen(false)} /> } // Default maxWidth to 'md'
            onClose={() => {
              setQRCodeScanOpen(false);
              setModalContent(null); // Reset modal content on close
              setModalMaxWidth('md'); // Reset maxWidth on close
              setModalTitle('QR Code Scan'); // Reset title on close
            }}
            title={modalTitle} // Use dynamic title
          />
        </Box>
      </Box>
    </>
  );
};

export default Header;
