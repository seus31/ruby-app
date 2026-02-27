import TagPostList from './TagPostList';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="container py-4">
      <h1 className="mb-4">タグ: {decodeURIComponent(slug)}</h1>
      <TagPostList slug={slug} />
    </div>
  );
}
