
// ==============================|| MENU ITEMS ||============================== //

// menu imports
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import inventoryPage from './inventory';
import locationPage from './location';
import manageUserPage from './manage_user';
import systemLogsPage from './system_logs';

const userView = () => {
  const [menuItems, setMenuItems] = useState([inventoryPage, locationPage]);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session && (session.user.role === 'Admin')) {
        setMenuItems(prevItems => [...prevItems, manageUserPage, systemLogsPage]);
      }
    };
    fetchSession();
  }, []);

  return menuItems;
};

export default userView;