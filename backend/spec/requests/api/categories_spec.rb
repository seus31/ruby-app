# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Categories", type: :request do
  let(:user) { User.create!(name: "User", email: "user@example.com", password: "password123") }
  let(:auth_headers) { auth_headers_for(user, password: "password123") }

  describe "GET /api/v1/categories" do
    it "returns 200 without auth" do
      get api_v1_categories_path, headers: json_headers
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /api/v1/categories/:slug" do
    let(:category) { Category.create!(category_name: "Tech") }

    it "returns category by slug without auth" do
      get api_v1_category_path(category.slug), headers: json_headers
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["slug"]).to eq(category.slug)
    end
  end

  describe "POST /api/v1/categories" do
    it "returns 401 without auth" do
      post api_v1_categories_path, params: { category: { category_name: "New Cat" } }.to_json, headers: json_headers
      expect(response).to have_http_status(:unauthorized)
    end

    it "creates category with auth" do
      post api_v1_categories_path, params: { category: { category_name: "New Cat" } }.to_json, headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:created)
      expect(Category.find_by(category_name: "New Cat")).to be_present
    end
  end

  describe "DELETE /api/v1/categories/:slug" do
    let(:category) { Category.create!(category_name: "ToDelete") }

    it "returns 422 when category has associated posts" do
      post = Post.create!(user: user, title: "P", body: "B", status: :published)
      post.categories << category

      delete api_v1_category_path(category.slug), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "deletes when no posts" do
      delete api_v1_category_path(category.slug), headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      expect(Category.find_by(id: category.id)).to be_nil
    end
  end
end
