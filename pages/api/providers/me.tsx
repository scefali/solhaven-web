import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseUser } from 'utils/server/auth';
import { prisma } from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const user = await getSupabaseUser({ req, res })
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { firstName, bio, services, workingHours } = req.body;

  try {
    const result = await prisma.profile.update({
      where: { supabaseUserId: user.id },
      data: { firstName, bio, services, workingHours },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
