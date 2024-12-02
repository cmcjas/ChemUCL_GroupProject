import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Head from 'next/head';

// material-ui
import { Box } from '@mui/material';

// ==============================|| Page - SET TITLE & META TAGS ||============================== //

const Page = forwardRef(({ children, title = '', meta, ...other }, ref) => (
  <>
    <Head>
      <title>{`${title} | Berry - React Material Admin Dashboard Template`}</title>
      <meta name="description" content="Checkout our cool page" key="desc" />
      <meta property="og:title" content="Social Title for Cool Page" />
      <meta property="og:description" content="And a social description for our cool page" />
      <meta property="og:image" content="https://example.com/images/cool-page.jpg" />
      {meta}
    </Head>
    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));

Page.propTypes = {
  children: PropTypes.node,
  meta: PropTypes.node,
  title: PropTypes.string
};

export default Page;
