# frozen_string_literal: true

# Category Serializer
class CategorySerializer < ActiveModel::Serializer
  attributes :id, :category_name, :slug, :description

  attribute :posts_count do
    object.posts.count
  end
end
