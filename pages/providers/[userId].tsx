import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { supabase } from 'lib/supabase';
import Layout from 'components/Layout';
import Button from 'components/Button';
import { Profile } from 'types/Profile';
import { getSupabaseUser } from 'utils/server/auth';
import { prisma } from 'lib/prisma';

type ProfileProps = {
  profile: Profile | null;
  error: string | null;
};

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (context) => {
  const { params } = context;
  const { id } = params as { id: string };
  let supabaseUserId = id;

  if (id === 'me') {
    const user = await getSupabaseUser(context as any);
    if (!user) {
      return {
        props: {
          error: 'You must be signed in to view your profile.',
        },
      };
    }
    // overwrite the value based on the logged in user
    supabaseUserId = user.id;
  }

  const profile = await prisma.profile.findUnique({ where: { supabaseUserId } });
  if (!profile) {
    return {
      props: {
        error: 'User not found',
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

  if (error) {
    return (
      <Layout>
        <div>{error}</div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div>User not found</div>
      </Layout>
    );
  }

  const handleEditClick = () => {
    router.push('/profile/edit');
  };

  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <Button onClick={handleEditClick}>Edit Profile</Button>
      </div>
      <div className="flex justify-start items-center my-4">
        <img
          src={profile.photoUrl}
          alt={profile.name}
          className="w-24 h-24 object-cover rounded-full"
        />
        <div className="ml-4">
          <p className="font-bold">{profile.name}</p>
          <p className="text-gray-600">{profile.services}</p>
          <p className="text-gray-600">{profile.workingHours}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
