# frozen_string_literal: true

module Api
  module V1
    class UsersController < ProtectedController
      skip_before_action :authenticate_user!, only: [:show]
      before_action :set_user, only: %i[show update]

      def show
        render json: @user, serializer: UserSerializer
      end

      def update
        if @user.id != current_user.id
          return render json: { error: "Forbidden" }, status: :forbidden
        end
        if @user.update(user_params)
          render json: @user, serializer: UserSerializer, status: :ok
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.require(:user).permit(:name, :bio, :avatar_url)
      end
    end
  end
end
