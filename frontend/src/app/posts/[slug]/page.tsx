import PostDetail from '@/features/posts/components/PostDetail';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="container py-4">
      <PostDetail slug={slug} />
    </div>
  );
}
