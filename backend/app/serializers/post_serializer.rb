# frozen_string_literal: true

# Post Serializer
class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :excerpt, :slug, :status,
             :thumbnail_url, :published_at, :created_at, :updated_at

  attribute :comments_count do
    object.comments.count
  end

  attribute :likes_count do
    object.likes.count
  end

  attribute :liked_by_current_user do
    scope&.likes&.exists?(post: object)
  end

  belongs_to :user, key: :author, serializer: UserSerializer
  has_many :categories, serializer: CategorySerializer
  has_many :tags, serializer: TagSerializer
end
