// third-party
import { FormattedMessage } from 'react-intl';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const icons = {
  ArticleOutlinedIcon
};

const systemLogsPage = {
  id: 'systemLogs-page',
  title: <FormattedMessage id="System Logs" />,
  icon: icons.ArticleOutlinedIcon,
  type: 'group',
  url: '/system-logs-page'
};

export default systemLogsPage;
