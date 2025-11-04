export default function CertificateDetailPage({
  params,
}: {
  params: { tokenId: string };
}) {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Certificate {params.tokenId}</h1>
    </div>
  );
}

