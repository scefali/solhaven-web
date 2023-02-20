import { GetServerSideProps } from 'next';
import { useForm } from 'react-hook-form';
import { supabase } from 'lib/supabase';
import { PrismaClient, Prisma } from '@prisma/client';
import Layout from 'components/Layout';
import Input from 'components/Input';
import TextArea from 'components/TextArea';
import Button from 'components/Button';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const prisma = new PrismaClient();

// TODO: use Prisma type
// type Profile = ReturnType<Awaited<typeof prisma.profile.findUniqueOrThrow>>;
type Profile = {
  id: number;
  bio: string;
  services: string;
  workingHours: string;
  profileImageUrl: string;
};

type Props = {
  profile: Profile | null;
};

type ProfileFormData = Pick<Profile, 'bio' | 'services' | 'workingHours' | 'profileImageUrl'>;

export default function ProfileEditPage({ profile }: Props) {
  const { register, handleSubmit, setValue } = useForm<ProfileFormData>({
    defaultValues: {
      bio: profile?.bio || '',
      services: profile?.services || '',
      workingHours: profile?.workingHours || '',
      profileImageUrl: profile?.profileImageUrl || '',
    },
  });

  async function onSubmit(formData: ProfileFormData) {
    const session = await supabase.auth.getSession();
    if (!session) return;

    const { bio, services, workingHours, profileImageUrl } = formData;

    const result = await fetch('/api/profile', {
      method: 'PUT',
      // headers: {
      //   'Content-Type': 'application/json',
      //   Authorization: `Bearer ${session.accessToken}`,
      // },
      body: JSON.stringify({ bio, services, workingHours, profileImageUrl }),
    });

    if (result.ok) {
      console.log('Profile updated successfully');
    } else {
      console.error('Failed to update profile');
    }
  }

  return (
    <Layout title="Edit Profile">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Profile Image URL" {...register('profileImageUrl')} />
        <TextArea label="Bio" {...register('bio')} />
        <TextArea label="Services" {...register('services')} />
        <TextArea label="Working Hours" {...register('workingHours')} />
        <Button type="submit">Save</Button>
      </form>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const supabase = createServerSupabaseClient({ req, res } as any);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log('session', session);
  if (!session) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };
  }

  const { user } = session;
  const profile = await prisma.profile.findUnique({ where: { supabaseUserId: user.id } });

  if (!profile) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };
  }

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
};
