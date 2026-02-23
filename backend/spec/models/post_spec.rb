# frozen_string_literal: true

require "rails_helper"

RSpec.describe Post, type: :model do
  let(:user) { User.create!(name: "Author", email: "author@example.com", password: "password123") }

  describe "associations" do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:post_categories).dependent(:destroy) }
    it { is_expected.to have_many(:categories).through(:post_categories) }
    it { is_expected.to have_many(:post_tags).dependent(:destroy) }
    it { is_expected.to have_many(:tags).through(:post_tags) }
    it { is_expected.to have_many(:comments).dependent(:destroy) }
    it { is_expected.to have_many(:likes).dependent(:destroy) }
  end

  describe "enum status" do
    it { is_expected.to define_enum_for(:status).with_values(draft: 0, published: 1, archived: 2) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_presence_of(:body) }
  end

  describe "slug generation" do
    it "generates unique slug on create" do
      post = Post.create!(user: user, title: "My Post", body: "Content", status: :draft)
      expect(post.slug).to be_present
      expect(post.slug).to match(/\A[a-f0-9]{16}\z/)
    end

    it "does not overwrite slug when already set" do
      post = Post.new(user: user, title: "Post", body: "Body", status: :draft, slug: "custom-slug")
      post.save!
      expect(post.slug).to eq("custom-slug")
    end
  end
end
