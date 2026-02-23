# frozen_string_literal: true

require "rails_helper"

RSpec.describe Like, type: :model do
  let(:user) { User.create!(name: "User", email: "user@example.com", password: "password123") }
  let(:post) { Post.create!(user: user, title: "Post", body: "Body", status: :published) }

  describe "associations" do
    it { is_expected.to belong_to(:post) }
    it { is_expected.to belong_to(:user) }
  end

  describe "uniqueness (double like prevention)" do
    it "allows one like per user per post" do
      Like.create!(post: post, user: user)
      expect(Like.count).to eq(1)
    end

    it "raises when same user likes same post twice" do
      Like.create!(post: post, user: user)
      duplicate = Like.new(post: post, user: user)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:post_id]).to be_present
    end
  end
end
