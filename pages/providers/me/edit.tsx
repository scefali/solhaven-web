import { GetServerSideProps } from 'next';
import { useForm } from 'react-hook-form';
import { PrismaClient, Prisma } from '@prisma/client';
import toast, { Toaster } from 'react-hot-toast';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { supabase } from 'lib/supabase';
import Layout from 'components/Layout';
import Input from 'components/Input';
import TextArea from 'components/TextArea';
import Button from 'components/Button';

const prisma = new PrismaClient();

// TODO: use Prisma type
// type Profile = ReturnType<Awaited<typeof prisma.profile.findUniqueOrThrow>>;
type Profile = {
  id: number;
  bio?: string;
  services?: string;
  workingHours?: string;
  profileImageUrl?: string;
  firstName?: string;
};

type Props = {
  profile: Profile | null;
};

type ProfileFormData = Pick<
  Profile,
  'bio' | 'services' | 'workingHours' | 'profileImageUrl' | 'firstName'
>;

export default function ProfileEditPage({ profile }: Props) {
  const { register, handleSubmit } = useForm<ProfileFormData>({
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

    const result = await fetch('/api/providers/me', {
      method: 'PUT',
      body: JSON.stringify({ bio, services, workingHours, profileImageUrl }),
    });


    if (result.ok) {
      toast('Profile updated successfully', {position: 'bottom-right'})
    } else {
      toast('Failed to update profile', {position: 'bottom-right'});
    }
  }

  return (
    <Layout title="Edit Profile">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Profile Image URL" {...register('profileImageUrl')} placeholder="" />
        <TextArea
          label="First Name"
          {...register('firstName')}
          placeholder="What's your first name?"
        />
        <TextArea label="Bio" {...register('bio')} placeholder="Tell us about yourself" />
        <TextArea label="Services" {...register('services')} placeholder="What do you do?" />
        <TextArea
          label="Working Hours"
          {...register('workingHours')}
          placeholder="Which days and what times do you work?"
        />
        <Button type="submit">Save</Button>
      </form>
      <Toaster />
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
