import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { PrismaClient, Profile } from "@prisma/client";
import { authOptions } from 'pages/api/auth/[...nextauth]'


const prisma = new PrismaClient();

const AuthCreated: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.redirect("account")
  }
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { user } = session;
  console.log('user', user)

  try {
    const profile = await prisma.profile.upsert({
      where: {
        supabaseUserId: user.id,
      },
      update: {
      },
      create: {
        supabaseUserId: user.id,
      },
    });

    return res.status(200).json({ message: "Profile created or updated successfully", data: profile });
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
};

export default AuthCreated;