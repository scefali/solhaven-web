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
  console.log('req headers', req.headers)

  // const token = await getToken({ req })

  // console.log('token', token)

  // const session = await getServerSession(req, res, authOptions);
  // console.log('session', session);
  // if (!session) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }

  // const { user } = session;

  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  });
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();
  console.log('user', user);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
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
    return res.status(500).json({ message: error?.message });
  }
};

export default AuthCreated;
