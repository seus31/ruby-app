# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Likes", type: :request do
  let(:user) { User.create!(name: "User", email: "user@example.com", password: "password123") }
  let(:post_record) { Post.create!(user: user, title: "Post", body: "Body", status: :published) }
  let(:auth_headers) { auth_headers_for(user, password: "password123") }

  describe "POST /api/v1/posts/:post_slug/likes" do
    it "returns 401 without auth" do
      post api_v1_post_likes_path(post_slug: post_record.slug), headers: json_headers
      expect(response).to have_http_status(:unauthorized)
    end

    it "creates like and returns likes_count" do
      post api_v1_post_likes_path(post_slug: post_record.slug), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["likes_count"]).to eq(1)
    end

    it "returns 422 on duplicate like" do
      Like.create!(post: post_record, user: user)
      post api_v1_post_likes_path(post_slug: post_record.slug), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "DELETE /api/v1/posts/:post_slug/likes" do
    it "returns likes_count after destroy" do
      Like.create!(post: post_record, user: user)
      delete api_v1_post_likes_path(post_slug: post_record.slug), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["likes_count"]).to eq(0)
    end
  end
end
