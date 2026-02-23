# frozen_string_literal: true

# Category model
class Category < ApplicationRecord
  has_many :post_categories, dependent: :destroy
  has_many :posts, through: :post_categories

  before_validation :generate_slug, on: :create

  validates :category_name, presence: true, uniqueness: true

  private

  def generate_slug
    return if slug.present?

    base = category_name.presence && category_name.parameterize.presence
    base = SecureRandom.hex(8) if base.blank?
    self.slug = loop do
      candidate = base.to_s + (base.to_s.end_with?("-") ? "" : "-") + SecureRandom.hex(4)
      break candidate unless Category.exists?(slug: candidate)
    end
  end
end
