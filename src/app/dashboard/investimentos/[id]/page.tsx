import { InvestmentDetail } from "./InvestmentDetail";

export default async function InvestmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvestmentDetail id={id} />;
}
