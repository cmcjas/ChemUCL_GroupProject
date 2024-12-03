// third-party
import { FormattedMessage } from 'react-intl';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

const icons = {
  PeopleAltOutlinedIcon
};

const manageUserPage = {
  id: 'manageUser-page',
  title: <FormattedMessage id="Manage User" />,
  icon: icons.PeopleAltOutlinedIcon,
  type: 'group',
  url: '/manage-user-page'
};

export default manageUserPage;
