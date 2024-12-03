// third-party
import { FormattedMessage } from 'react-intl';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

const icons = {
  ListAltOutlinedIcon
};

const requestPage = {
  id: 'request-page',
  title: <FormattedMessage id="Request" />,
  icon: icons.ListAltOutlinedIcon,
  type: 'group',
  url: '/request-page'
};

export default requestPage;
