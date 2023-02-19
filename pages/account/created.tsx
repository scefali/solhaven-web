import React from "react";
import { GetServerSideProps } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const getServerSideProps = async (
  ctx: Parameters<GetServerSideProps>[0]
) => {
  console.log("getServerSideProps", ctx.req.headers.cookie)
  // Create authenticated Supabase Client
  // const supabase = createServerSupabaseClient(ctx);
  // // Check if we have a session
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/account",
  //       permanent: false,
  //     },
  //   };
  // }

  // console.log({ session });

  // return {
  //   props: {
  //     initialSession: session,
  //     user: session.user,
  //   },
  // };


    // return {
    //   redirect: {
    //     destination: "/api/auth/created",
    //     permanent: false,
    //   },
    // };

    return {props: {}}
};

const AccountCreated = () => {
  return <div className="flex-1 m-16">Hi</div>;
};

export default AccountCreated;
