# frozen_string_literal: true

class CreatePostCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :post_categories do |t|
      t.bigint :post_id, null: false
      t.bigint :category_id, null: false

      t.timestamps
    end
    add_index :post_categories, [:post_id, :category_id], unique: true
    add_index :post_categories, :category_id
  end
end
