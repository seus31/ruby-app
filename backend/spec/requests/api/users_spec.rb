# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::V1::Users", type: :request do
  let(:user) { User.create!(name: "Me", email: "me@example.com", password: "password123") }
  let(:auth_headers) { auth_headers_for(user, password: "password123") }

  describe "GET /api/v1/users/:id" do
    it "returns user without auth" do
      get api_v1_user_path(user.id), headers: json_headers
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["id"]).to eq(user.id)
    end
  end

  describe "PATCH /api/v1/users/:id" do
    let(:other_user) { User.create!(name: "Other", email: "other@example.com", password: "pass") }
    let(:other_headers) { auth_headers_for(other_user, password: "pass") }

    it "updates when owner" do
      patch api_v1_user_path(user.id), params: { user: { name: "Updated Name" } }.to_json, headers: auth_headers.merge(json_headers)
      expect(response).to have_http_status(:ok)
      expect(user.reload.name).to eq("Updated Name")
    end

    it "returns 403 when other user" do
      patch api_v1_user_path(user.id), params: { user: { name: "Hacked" } }.to_json, headers: other_headers.merge(json_headers)
      expect(response).to have_http_status(:forbidden)
    end
  end
end
