// third-party
import { FormattedMessage } from 'react-intl';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';

const icons = {
  RoomOutlinedIcon
};

const locationPage = {
  id: 'location-page',
  title: <FormattedMessage id="Location" />,
  icon: icons.RoomOutlinedIcon,
  type: 'group',
  url: '/location-page'
};

export default locationPage;
