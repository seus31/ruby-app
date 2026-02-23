# frozen_string_literal: true

class AddSlugDescriptionToCategories < ActiveRecord::Migration[7.1]
  def change
    add_column :categories, :slug, :string
    add_column :categories, :description, :text
    add_index :categories, :slug, unique: true
  end
end
