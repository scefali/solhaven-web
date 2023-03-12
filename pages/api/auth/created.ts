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

    return res.redirect(307, '/providers/me/edit');
  } catch (error) {
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};

export default AuthCreated;
