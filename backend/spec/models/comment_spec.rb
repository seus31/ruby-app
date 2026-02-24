# frozen_string_literal: true

require "rails_helper"

RSpec.describe Comment, type: :model do
  let(:user) { User.create!(name: "User", email: "user@example.com", password: "password123") }
  let(:post) { Post.create!(user: user, title: "Post", body: "Body", status: :published) }

  describe "associations" do
    it { is_expected.to belong_to(:post) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:parent).optional }
    it { is_expected.to have_many(:replies).class_name("Comment").with_foreign_key(:parent_id).dependent(:destroy) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:body) }
  end

  describe "reply nest (parent_id)" do
    it "allows parent_id for reply" do
      parent_comment = Comment.create!(post: post, user: user, body: "Parent")
      reply = Comment.create!(post: post, user: user, body: "Reply", parent_id: parent_comment.id)
      expect(reply.parent_id).to eq(parent_comment.id)
      expect(parent_comment.replies).to include(reply)
    end
  end
end
