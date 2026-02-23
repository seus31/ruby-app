# frozen_string_literal: true

# Tag Serializer
class TagSerializer < ActiveModel::Serializer
  attributes :id, :name, :slug

  attribute :posts_count do
    object.posts.count
  end
end
