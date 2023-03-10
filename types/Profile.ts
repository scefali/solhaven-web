// TODO: use Prisma type
// type Profile = ReturnType<Awaited<typeof prisma.profile.findUniqueOrThrow>>;
export type Profile = {
  id: number;
  bio?: string;
  services?: string;
  workingHours?: string;
  profileImageUrl?: string;
  firstName?: string;
};
