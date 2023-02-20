import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { PrismaClient, Profile } from '@prisma/client';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { getToken } from "next-auth/jwt"


import type { Database } from 'types/supabase_auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

const prisma = new PrismaClient();

const AuthCreated: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.redirect('account');
  }

  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  });
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  if (!user) {
    return res.redirect(307, '/account');
  }

  try {
    const profile = await prisma.profile.upsert({
      where: {
        supabaseUserId: user.id,
      },
      update: {},
      create: {
        supabaseUserId: user.id,
      },
    });

    return res
      .status(200)
      .json({ message: 'Profile created or updated successfully', data: profile });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export default AuthCreated;
