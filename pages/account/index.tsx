import React from 'react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className="flex-1 m-16">
      <div className="max-w-xs m-auto">
        <h1>Create Account</h1>
        {!session ? (
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            providers={['google']}
            // seems that only a page will set the Supabase cookie
            // after which we can redirect to an api page to update the DB
            // redirectTo="http://localhost:3000/api/auth/created"
            redirectTo="http://localhost:3000/account/signup-router"
          />
        ) : (
          <div>
            <p>Account page will go here.</p>
            <Link href="/providers/me/edit">Edit Account</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
