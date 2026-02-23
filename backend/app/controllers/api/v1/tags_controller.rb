# frozen_string_literal: true

module Api
  module V1
    class TagsController < ProtectedController
      skip_before_action :authenticate_user!, only: [:index]

      def index
        tags = Tag.all
        render json: tags, each_serializer: TagSerializer
      end

      def create
        tag = Tag.new(tag_params)
        if tag.save
          render json: tag, serializer: TagSerializer, status: :created
        else
          render json: { errors: tag.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        tag = Tag.find_by!(slug: params[:slug])
        if tag.posts.exists?
          return render json: { errors: ["Tag has associated posts"] }, status: :unprocessable_entity
        end
        tag.destroy!
        render json: { message: "Tag successfully deleted" }, status: :ok
      end

      private

      def tag_params
        params.require(:tag).permit(:name)
      end
    end
  end
end
