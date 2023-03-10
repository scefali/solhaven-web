import { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { supabase } from "lib/supabase";
import Layout from "components/Layout";
import Button from "components/Button";
import { Profile } from "types/Profile";
import { getSupabaseUser } from "utils/server/auth";
import { prisma } from "lib/prisma";

type ProfileProps = {
  profile?: Profile;
  error?: string;
};

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (
  context
) => {
  const { params } = context;
  const { userId } = params;
  console.log({params, userId})
  let supabaseUserId = userId;

  if (userId === "me") {
    const user = await getSupabaseUser(context as any);
    if (!user) {
      return {
        props: {
          error: "You must be signed in to view your profile.",
        },
      };
    }
    // overwrite the value based on the logged in user
    supabaseUserId = user.id;
  }
  console.log('supabaseUserId: ', supabaseUserId)

  const profile = await prisma.profile.findUnique({
    where: { supabaseUserId },
  });
  if (!profile) {
    return {
      props: {
        error: "User not found",
      },
    };
  }

  return {
    props: {
      profile,
    },
  };
};

const ProfilePage: NextPage<ProfileProps> = ({ profile, error }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  console.log({profile, error})

  if (error) {
    return (
      <Layout title="error">
        <div>{error}</div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout title="error">
        <div>User not found</div>
      </Layout>
    );
  }

  const handleEditClick = () => {
    router.push("/providers/me/edit");
  };

  return (
    <Layout title="Profile">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{profile.firstName}</h1>
        <Button onClick={handleEditClick}>Edit Profile</Button>
      </div>
      <div className="flex justify-start items-center my-4">
        {profile.profileImageUrl && (
          <Image
            src={profile.profileImageUrl}
            alt="Profile Image"
            className="w-24 h-24 object-cover rounded-full"
          />
        )}
        <div className="ml-4">
          <p className="font-bold">{profile.firstName}</p>
          <p className="text-gray-600">{profile.services}</p>
          <p className="text-gray-600">{profile.workingHours}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
