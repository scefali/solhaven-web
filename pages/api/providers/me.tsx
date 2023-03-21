import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";


import { getSupabaseUser } from "utils/server/auth";
import { prisma } from "lib/prisma";

const ProfileSchema = z.object({
  firstName: z.string().optional(),
  bio: z.string().optional(),
  services: z.string().optional(),
  workingHours: z.string().optional(),
  profileImageUrl: z.string().optional(),
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const user = await getSupabaseUser({ req, res });
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const validatedData =
    ProfileSchema.safeParse(JSON.parse(req.body));
  if (!validatedData.success) {
    return res.status(400).json({ error: validatedData.error});
  }

  try {
    const result = await prisma.profile.update({
      where: { supabaseUserId: user.id },
      data: validatedData.data,
    });
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}
