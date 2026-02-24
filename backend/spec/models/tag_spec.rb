# frozen_string_literal: true

require "rails_helper"

RSpec.describe Tag, type: :model do
  describe "associations" do
    it { is_expected.to have_many(:post_tags).dependent(:destroy) }
    it { is_expected.to have_many(:posts).through(:post_tags) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:name) }

    it "validates uniqueness of name" do
      Tag.create!(name: "ruby")
      duplicate = Tag.new(name: "ruby")
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:name]).to be_present
    end
  end

  describe "slug generation" do
    it "generates slug on create" do
      tag = Tag.create!(name: "Ruby")
      expect(tag.slug).to be_present
    end
  end
end
