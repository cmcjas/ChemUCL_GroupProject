'use client';

import PropTypes from 'prop-types';

// material-ui
import { experimentalStyled as styled } from '@mui/material/styles';
import { InputLabel as MuiInputLabel } from '@mui/material';

// ==============================|| INPUT LABEL ||============================== //

const BInputLabel = styled((props) => <MuiInputLabel {...props} />, {
  shouldForwardProp: (prop) => prop !== 'horizontal'
})(({ theme, horizontal }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  marginBottom: horizontal ? 0 : 8
}));

const InputLabel = ({ children, horizontal = false, ...others }) => (
  <BInputLabel horizontal={horizontal} {...others}>
    {children}
  </BInputLabel>
);

InputLabel.propTypes = {
  children: PropTypes.node,
  horizontal: PropTypes.bool
};

export default InputLabel;
