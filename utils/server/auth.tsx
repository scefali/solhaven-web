import { NextApiRequest, NextApiResponse } from 'next';

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from 'types/supabase_auth';

export const getSupabaseUser = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const supabaseServerClient = createServerSupabaseClient<Database>({
    req,
    res,
  });
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();
  return user;
};
