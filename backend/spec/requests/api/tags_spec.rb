# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Tags", type: :request do
  let(:user) { User.create!(name: "User", email: "user@example.com", password: "password123") }
  let(:auth_headers) { auth_headers_for(user, password: "password123") }

  describe "GET /api/v1/tags" do
    it "returns 200 without auth" do
      get api_v1_tags_path, headers: json_headers
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /api/v1/tags" do
    it "returns 401 without auth" do
      post api_v1_tags_path, params: { tag: { name: "ruby" } }.to_json, headers: json_headers
      expect(response).to have_http_status(:unauthorized)
    end

    it "creates tag with auth" do
      post api_v1_tags_path, params: { tag: { name: "ruby" } }.to_json, headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:created)
      expect(Tag.find_by(name: "ruby")).to be_present
    end
  end

  describe "DELETE /api/v1/tags/:slug" do
    let(:tag) { Tag.create!(name: "ToDelete") }

    it "returns 422 when tag has associated posts" do
      post = Post.create!(user: user, title: "P", body: "B", status: :published)
      post.tags << tag

      delete api_v1_tag_path(tag.slug), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "deletes when no posts" do
      delete api_v1_tag_path(tag.slug), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      expect(Tag.find_by(id: tag.id)).to be_nil
    end
  end
end
