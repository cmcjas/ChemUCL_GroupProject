import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        const user = session.user;
        const provider = session.provider;
        if (provider === 'uclapi') {
          setUser({
            email: user.email,
            name: user.name,
          });
        } else {
          setUser({
            email: user.email,
            name: user.name,
            // image: user.image,
          });
        }
      } else {
        setUser(false);
      }
    };

    fetchSession();
  }, []);

  return user;
};

export default useUser;