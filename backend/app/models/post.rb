# frozen_string_literal: true

# Post model
class Post < ApplicationRecord
  belongs_to :user
  has_many :post_categories, dependent: :destroy
  has_many :categories, through: :post_categories
  has_many :post_tags, dependent: :destroy
  has_many :tags, through: :post_tags
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy

  enum :status, { draft: 0, published: 1, archived: 2 }

  validates :title, :body, presence: true

  before_validation :generate_slug, on: :create
  before_save :set_published_at, if: :status_changed?

  private

  def set_published_at
    self.published_at = Time.current if published?
  end

  def generate_slug
    return if slug.present?

    self.slug = loop do
      candidate = SecureRandom.hex(8)
      break candidate unless Post.exists?(slug: candidate)
    end
  end
end
