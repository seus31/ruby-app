# frozen_string_literal: true

# Post Serializer
class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :created_at
end
