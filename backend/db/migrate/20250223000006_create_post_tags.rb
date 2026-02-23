# frozen_string_literal: true

class CreatePostTags < ActiveRecord::Migration[7.1]
  def change
    create_table :post_tags do |t|
      t.bigint :post_id, null: false
      t.bigint :tag_id, null: false

      t.timestamps
    end
    add_index :post_tags, [:post_id, :tag_id], unique: true
    add_index :post_tags, :tag_id
  end
end
