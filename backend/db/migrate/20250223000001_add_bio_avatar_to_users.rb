# frozen_string_literal: true

class AddBioAvatarToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :bio, :text
    add_column :users, :avatar_url, :string
  end
end
