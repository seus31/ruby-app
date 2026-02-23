# frozen_string_literal: true

module Api
  module V1
    # Api/v1/ProtectedController
    class ProtectedController < BaseController
      before_action :authenticate_user!

      def authenticate_user!
        token = request.headers["Authorization"]&.split(" ")&.last
        decoded = decode_token(token)
        @current_user = User.find(decoded[0]["user_id"]) if decoded.present?
        return if @current_user

        render json: { error: "Unauthorized" }, status: :unauthorized
      end

      def current_user
        @current_user
      end
    end
  end
end