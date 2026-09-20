import { redirect } from "next/navigation";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  redirect(`/contracts/${id}?tab=overview`);
}