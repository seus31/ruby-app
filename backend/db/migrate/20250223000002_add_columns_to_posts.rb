# frozen_string_literal: true

class AddColumnsToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :user_id, :bigint, null: false
    add_column :posts, :slug, :string
    add_column :posts, :excerpt, :text
    add_column :posts, :thumbnail_url, :string
    add_column :posts, :published_at, :datetime
    add_index :posts, :slug, unique: true
    add_index :posts, :user_id
    add_index :posts, :status
    add_index :posts, :published_at
  end
end
