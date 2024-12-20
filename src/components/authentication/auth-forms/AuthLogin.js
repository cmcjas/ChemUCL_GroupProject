import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography
} from '@mui/material';

import { useState } from 'react';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import { DASHBOARD_PATH } from 'config';
// import { findUser } from 'db/queries/User';
// import { getSession } from 'next-auth/react';
// import { setCookie } from 'nookies';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { find } from 'lodash';


// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ ...others }) => {
  const theme = useTheme();
  const router = useRouter();
  const { login } = useAuth();
  const scriptedRef = useScriptRef();

  const [checked, setChecked] = React.useState(true);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


// const [user, setUser] = useState('admin');

// const initialValues = {
//   admin: {
//     email: 'admin@example.com',
//     password: '123456',
//     submit: null
//   },
//   researchStudent: {
//     email: 'research@example.com',
//     password: '123456',
//     submit: null
//   }
// };

  return (
      <Formik
        initialValues={{
          email: 'info@codedthemes.com',
          password: '123456',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        //   signIn ('login', {
        //     redirect: true,
        //     email: values.email,
        //     password: values.password,
        //     callbackUrl: '/inventory-page'
        //   }).then(
        //     (res) => {
        //       if (res?.error) {
        //         setErrors({submit: 'Incorrect email or password'});
        //       }
        //       setSubmitting(false);
        //     }
        //   );
        // }}
          try {
            await login(values.email, values.password);
            if (scriptedRef.current) {
              setStatus({ success: true });
              router.push(DASHBOARD_PATH);
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{}}
                label="Password"
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                  }
                  label="Keep me logged in"
                />
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle1"
                  component={Link}
                  href="/pages/authentication/forgot-password"
                  color="secondary"
                  sx={{ textDecoration: 'none' }}
                >
                  Forgot Password?
                </Typography>
              </Grid>
            </Grid>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button 
                color="secondary" 
                disabled={isSubmitting} 
                fullWidth size="large" 
                type="submit" 
                variant="contained"
                >
                  Sign In
                </Button>
              </AnimateButton>
            </Box>
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  color="secondary"
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  onClick={() =>
                    signIn('uclapi', {
                      callbackUrl: 'https://curious-smooth-gecko.ngrok-free.app/inventory-page'
                    })
                  }
                >
                  Sign In using UCL SSO
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
  );
};

export default JWTLogin;
