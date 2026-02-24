# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  describe "associations" do
    it { is_expected.to have_many(:posts).dependent(:destroy) }
    it { is_expected.to have_many(:comments).dependent(:destroy) }
    it { is_expected.to have_many(:likes).dependent(:destroy) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
  end

  describe "email format" do
    it { is_expected.to allow_value("user@example.com").for(:email) }
    it { is_expected.to allow_value("user+tag@example.co.jp").for(:email) }
    it { is_expected.not_to allow_value("invalid").for(:email) }
    it { is_expected.not_to allow_value("@example.com").for(:email) }
  end

  describe "has_secure_password" do
    it "does not persist password to password_digest when blank" do
      user = User.new(name: "Test", email: "test@example.com", password: "")
      expect(user.password_digest).to be_blank
    end

    it "persists password_digest when password is set" do
      user = User.create!(name: "Test", email: "test@example.com", password: "password123")
      expect(user.password_digest).to be_present
    end
  end
end
