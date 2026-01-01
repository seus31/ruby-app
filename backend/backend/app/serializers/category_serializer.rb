# frozen_string_literal: true

# Category Serializer
class CategorySerializer < ActiveModel::Serializer
  attributes :id, :category_name, :created_at
end
