# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Comments", type: :request do
  let(:user) { User.create!(name: "User", email: "user@example.com", password: "password123") }
  let(:post_record) { Post.create!(user: user, title: "Post", body: "Body", status: :published) }
  let(:auth_headers) { auth_headers_for(user, password: "password123") }

  describe "GET /api/v1/posts/:post_slug/comments" do
    it "returns nested comments structure" do
      c1 = Comment.create!(post: post_record, user: user, body: "First")
      Comment.create!(post: post_record, user: user, body: "Reply", parent_id: c1.id)

      get api_v1_post_comments_path(post_record.slug), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body.size).to eq(1)
      expect(body.first["replies"].size).to eq(1)
    end
  end

  describe "POST /api/v1/posts/:post_slug/comments" do
    it "creates comment without parent_id" do
      post api_v1_post_comments_path(post_record.slug), params: { comment: { body: "New comment" } }.to_json, headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:created)
      expect(post_record.comments.find_by(body: "New comment")).to be_present
    end

    it "creates reply with parent_id" do
      parent = Comment.create!(post: post_record, user: user, body: "Parent")
      post api_v1_post_comments_path(post_record.slug), params: { comment: { body: "Reply", parent_id: parent.id } }.to_json, headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:created)
      expect(parent.replies.count).to eq(1)
    end
  end

  describe "DELETE /api/v1/posts/:post_slug/comments/:id" do
    let(:comment) { Comment.create!(post: post_record, user: user, body: "Mine") }
    let(:other_user) { User.create!(name: "Other", email: "other@example.com", password: "pass") }
    let(:other_headers) { auth_headers_for(other_user, password: "pass") }

    it "deletes when owner" do
      delete api_v1_post_comment_path(post_record.slug, comment.id), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      expect(Comment.find_by(id: comment.id)).to be_nil
    end

    it "returns 403 when other user" do
      delete api_v1_post_comment_path(post_record.slug, comment.id), headers: other_headers.merge(json_headers)
      expect(response).to have_http_status(:forbidden)
    end
  end
end
