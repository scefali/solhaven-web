import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSupabaseUser } from 'utils/server/auth';

const prisma = new PrismaClient();

const AuthCreated: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.redirect('account');
  }

  const user = await getSupabaseUser({ req, res });

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
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};

export default AuthCreated;
