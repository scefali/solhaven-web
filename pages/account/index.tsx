import React from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";


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
            providers={["google"]}
            redirectTo="http://localhost:3000/api/auth/created"
          />
        ) : (
          <p>Account page will go here.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
