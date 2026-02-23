# frozen_string_literal: true

# Tag model
class Tag < ApplicationRecord
  has_many :post_tags, dependent: :destroy
  has_many :posts, through: :post_tags

  before_validation :generate_slug, on: :create

  validates :name, presence: true, uniqueness: true

  private

  def generate_slug
    return if slug.present?

    base = name.presence && name.parameterize.presence
    base = SecureRandom.hex(8) if base.blank?
    self.slug = loop do
      candidate = base.to_s + (base.to_s.end_with?("-") ? "" : "-") + SecureRandom.hex(4)
      break candidate unless Tag.exists?(slug: candidate)
    end
  end
end
