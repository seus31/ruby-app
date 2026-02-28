import TagPageContent from './TagPageContent';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  return <TagPageContent slug={slug} />;
}
