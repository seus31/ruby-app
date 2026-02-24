# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Api::Auth", type: :request do
  describe "POST /api/auth/register" do
    context "with valid params" do
      it "creates user and returns 201" do
        post "/api/auth/register", params: { name: "Test User", email: "test@example.com", password: "password123" }, as: :json
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)["message"]).to eq("User created successfully")
        expect(User.find_by(email: "test@example.com")).to be_present
      end
    end

    context "with duplicate email" do
      before { User.create!(name: "Existing", email: "dup@example.com", password: "pass") }

      it "returns 422" do
        post "/api/auth/register", params: { name: "Other", email: "dup@example.com", password: "password" }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "with invalid params" do
      it "returns 422 when email is invalid" do
        post "/api/auth/register", params: { name: "Test", email: "invalid", password: "password123" }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "POST /api/auth/login" do
    let!(:user) { User.create!(name: "Login User", email: "login@example.com", password: "secret123") }

    context "with valid credentials" do
      it "returns token and 200" do
        post "/api/auth/login", params: { email: "login@example.com", password: "secret123" }, as: :json
        expect(response).to have_http_status(:ok)
        body = JSON.parse(response.body)
        expect(body["token"]).to be_present
      end
    end

    context "with wrong password" do
      it "returns 401" do
        post "/api/auth/login", params: { email: "login@example.com", password: "wrong" }, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "with non-existent email" do
      it "returns 401" do
        post "/api/auth/login", params: { email: "nobody@example.com", password: "any" }, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
