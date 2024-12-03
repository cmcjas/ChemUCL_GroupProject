// third-party
import { FormattedMessage } from 'react-intl';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const icons = {
  Inventory2OutlinedIcon
};

const inventoryPage = {
  id: 'inventory-page',
  title: <FormattedMessage id="Inventory" />,
  icon: icons.Inventory2OutlinedIcon,
  type: 'group',
  url: '/inventory-page'
};

export default inventoryPage;
