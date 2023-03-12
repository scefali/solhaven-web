import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { PrismaClient, Prisma } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";

import { getSupabaseUser } from "utils/server/auth";
import { supabase } from "lib/supabase";
import Layout from "components/Layout";
import Input from "components/Input";
import TextArea from "components/TextArea";
import Button from "components/Button";
import type { Profile } from "types/Profile";

const prisma = new PrismaClient();

type Props = {
  profile: Profile | null;
};

type ProfileFormData = Pick<
  Profile,
  "bio" | "services" | "workingHours" | "profileImageUrl" | "firstName"
>;

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const user = await getSupabaseUser({ req, res } as any);
  if (!user) {
    return {
      redirect: {
        destination: "/account",
        permanent: false,
      },
    };
  }

  const profile = await prisma.profile.findUnique({
    where: { supabaseUserId: user.id },
  });

  if (!profile) {
    return {
      redirect: {
        destination: "/account",
        permanent: false,
      },
    };
  }
  console.log({ profile });

  return {
    props: {
      profile,
    },
  };
};

export default function ProfileEditPage({ profile }: Props) {
  const { register, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: {
      bio: profile?.bio || "",
      services: profile?.services || "",
      workingHours: profile?.workingHours || "",
      profileImageUrl: profile?.profileImageUrl || "",
      firstName: profile?.firstName || "",
    },
  });

  async function onSubmit(formData: ProfileFormData) {
    const session = await supabase.auth.getSession();
    // TODO: handle better
    if (!session) return;

    const result = await fetch("/api/providers/me", {
      method: "PUT",
      body: JSON.stringify(formData),
    });

    if (result.ok) {
      toast("Profile updated successfully", { position: "bottom-right" });
    } else {
      toast("Failed to update profile", { position: "bottom-right" });
    }
  }

  return (
    <Layout
      title="Edit Profile"
      headerLinks={[{ href: "/providers/me", label: "My Profile" }]}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Profile Image URL"
          {...register("profileImageUrl")}
          placeholder=""
        />
        <TextArea
          label="First Name"
          inputProps={register("firstName")}
          placeholder="What's your first name?"
        />
        <TextArea
          label="Bio"
          inputProps={register("bio")}
          placeholder="Tell us about yourself"
        />
        <TextArea
          label="Services"
          inputProps={"services"}
          placeholder="What do you do?"
        />
        <TextArea
          label="Working Hours"
          inputProps={register("workingHours")}
          placeholder="Which days and what times do you work?"
        />
        <Button type="submit">Save</Button>
      </form>
      <Toaster />
    </Layout>
  );
}
