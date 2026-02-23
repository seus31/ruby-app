# frozen_string_literal: true

# Comment Serializer
class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body, :parent_id, :created_at

  belongs_to :user, key: :author, serializer: UserSerializer
  has_many :replies, serializer: CommentSerializer
end
