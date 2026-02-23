# frozen_string_literal: true

# PostTag join model
class PostTag < ApplicationRecord
  belongs_to :post
  belongs_to :tag

  validates :post_id, uniqueness: { scope: :tag_id }
end
