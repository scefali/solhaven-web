import { Prisma } from "@prisma/client";
import { prisma } from "lib/prisma";

export type Profile = Prisma.PromiseReturnType<
  typeof prisma.profile.findUniqueOrThrow
>;
