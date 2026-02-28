import CategoryPageContent from './CategoryPageContent';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <CategoryPageContent slug={slug} />;
}
