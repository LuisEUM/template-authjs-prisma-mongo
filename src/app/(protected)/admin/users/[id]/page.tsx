import prisma from "@/lib/database";

type Props = {
  params: { id: string };
};

const UserDetails = async ({ params }: Props) => {
  const { id } = params;
  const user = await prisma.user.findUnique({ where: { id } });
  return (
    <div>
      <span>UserDetails</span>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default UserDetails;
