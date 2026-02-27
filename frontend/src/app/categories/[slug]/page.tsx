import CategoryPostList from './CategoryPostList';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="container py-4">
      <h1 className="mb-4">カテゴリ: {decodeURIComponent(slug)}</h1>
      <CategoryPostList slug={slug} />
    </div>
  );
}
