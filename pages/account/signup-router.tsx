import React from 'react';
import Router from 'next/router';
import { useSession } from '@supabase/auth-helpers-react';

const SignupRouter = () => {
  const session = useSession();
  // TODO: add timeout to redirect if session is never set
  React.useEffect(() => {
    if (session) {
      Router.push('/api/auth/created');
    }
  }, [session]);
  return <div className="flex-1 m-16">Loading...</div>;
};

export default SignupRouter;
