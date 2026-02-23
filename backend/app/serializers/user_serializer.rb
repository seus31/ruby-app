# frozen_string_literal: true

# User Serializer
class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :bio, :avatar_url, :created_at

  attribute :posts_count do
    object.posts.count
  end
end
