# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Posts", type: :request do
  let(:user) { User.create!(name: "Author", email: "author@example.com", password: "password123") }
  let(:auth_headers) { auth_headers_for(user, password: "password123") }

  describe "GET /api/v1/posts" do
    it "requires authentication" do
      get api_v1_posts_path, headers: json_headers
      expect(response).to have_http_status(:unauthorized)
    end

    it "returns only published posts with meta" do
      Post.create!(user: user, title: "Draft", body: "Draft body", status: :draft)
      published_post = Post.create!(user: user, title: "Published", body: "Published body", status: :published)
      published_post.update_column(:published_at, 1.hour.ago)

      get api_v1_posts_path, headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      expect(body["posts"].size).to eq(1)
      expect(body["meta"]).to include("current_page", "total_pages", "total_count")
    end

    it "filters by q (search)" do
      Post.create!(user: user, title: "Ruby post", body: "Content", status: :published).update_column(:published_at, Time.current)
      Post.create!(user: user, title: "Other", body: "Content", status: :published).update_column(:published_at, Time.current)

      get api_v1_posts_path, params: { q: "Ruby" }, headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      posts = body["posts"] || []
      expect(posts.size).to eq(1)
      expect(posts.first["title"]).to eq("Ruby post")
    end
  end

  describe "GET /api/v1/posts/:slug" do
    let(:post_record) { Post.create!(user: user, title: "Show me", body: "Body", status: :published) }

    it "returns post by slug" do
      get api_v1_post_path(post_record.slug), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["slug"]).to eq(post_record.slug)
    end
  end

  describe "POST /api/v1/posts" do
    context "with auth" do
      it "creates post and returns 201" do
        post api_v1_posts_path, params: { post: { title: "New", body: "Body", status: "draft" } }.to_json, headers: auth_headers.merge(json_headers)
        expect(response).to have_http_status(:created)
        expect(Post.find_by(title: "New").user_id).to eq(user.id)
      end
    end

    context "without auth" do
      it "returns 401" do
        post api_v1_posts_path, params: { post: { title: "New", body: "Body", status: "draft" } }.to_json, headers: json_headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH /api/v1/posts/:slug" do
    let(:post_record) { Post.create!(user: user, title: "Original", body: "Body", status: :draft) }
    let(:other_user) { User.create!(name: "Other", email: "other@example.com", password: "pass") }
    let(:other_headers) { auth_headers_for(other_user, password: "pass") }

    it "updates when owner" do
      patch api_v1_post_path(post_record.slug), params: { post: { title: "Updated", body: "Body", status: "draft" } }.to_json, headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      expect(post_record.reload.title).to eq("Updated")
    end

    it "returns 403 when other user" do
      patch api_v1_post_path(post_record.slug), params: { post: { title: "Hacked" } }.to_json, headers: other_headers.merge(json_headers)
      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "DELETE /api/v1/posts/:slug" do
    let(:post_record) { Post.create!(user: user, title: "To delete", body: "Body", status: :draft) }
    let(:other_user) { User.create!(name: "Other", email: "other@example.com", password: "pass") }
    let(:other_headers) { auth_headers_for(other_user, password: "pass") }

    it "deletes when owner" do
      delete api_v1_post_path(post_record.slug), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      expect(Post.find_by(id: post_record.id)).to be_nil
    end

    it "returns 403 when other user" do
      delete api_v1_post_path(post_record.slug), headers: other_headers.merge(json_headers)
      expect(response).to have_http_status(:forbidden)
    end
  end
end
