# frozen_string_literal: true

class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.references :post, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.bigint :parent_id # nullable (返信用)
      t.text :body, null: false

      t.timestamps
    end
    add_index :comments, :parent_id
  end
end
