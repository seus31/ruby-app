# frozen_string_literal: true

# Like model
class Like < ApplicationRecord
  belongs_to :post
  belongs_to :user

  validates :post_id, uniqueness: { scope: :user_id, message: "already liked" }
end
