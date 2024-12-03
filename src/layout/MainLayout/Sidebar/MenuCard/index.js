import PropTypes from 'prop-types';
import { memo, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Card, CardContent, Typography, Button, Box, Stack } from '@mui/material';
import { IconLogout } from '@tabler/icons-react'; // Ensure you have @tabler/icons-react installed
import useAuth from 'hooks/useAuth'; 
import useUser from 'hooks/useUser'; 
// material-ui
import { styled } from '@mui/material/styles';

// Styles
const CardStyle = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
  marginBottom: '22px',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '157px',
    height: '157px',
    background: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.primary[200],
    borderRadius: '50%',
    top: '-105px',
    right: '-96px'
  }
}));

const MenuCard = () => {
  const theme = useTheme();
  const user = useUser();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CardStyle>
      <CardContent>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', pb: 2 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="h4">Welcome,</Typography>
            <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
              {user?.name}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={handleLogout}
            variant="contained"
            startIcon={<IconLogout />}
            sx={{
              borderRadius: theme.shape.borderRadius,
              textTransform: 'none', // Keeps the button text's original case
              backgroundColor: theme.palette.primary.main, // Example: Change to use the primary color from the theme
              '&:hover': {
                backgroundColor: theme.palette.primary.dark // Example: Darken the button on hover using the primary color
              },
              color: theme.palette.getContrastText(theme.palette.primary.main) // Ensures text color contrasts with the button background
              // Add any additional custom styling here
            }}
          >
            Logout
          </Button>
        </Box>
      </CardContent>
    </CardStyle>
  );
};

export default memo(MenuCard);
