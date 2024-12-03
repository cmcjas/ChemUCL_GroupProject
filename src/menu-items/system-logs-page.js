// third-party
import { FormattedMessage } from 'react-intl';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const icons = {
  ArticleOutlinedIcon
};

const systemLogsPage = {
  id: 'systemLogs-page',
  title: <FormattedMessage id="system-logs-page" />,
  icon: icons.ArticleOutlinedIcon,
  type: 'group',
  url: '/systemLogs-page'
};

export default systemLogsPage;
