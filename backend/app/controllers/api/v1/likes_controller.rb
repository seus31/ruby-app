# frozen_string_literal: true

module Api
  module V1
    class LikesController < ProtectedController
      before_action :set_post

      def create
        Like.create!(post: @post, user: current_user)
        render json: { likes_count: @post.likes.count }, status: :created
      end

      def destroy
        like = @post.likes.find_by!(user: current_user)
        like.destroy!
        render json: { likes_count: @post.likes.count }, status: :ok
      end

      private

      def set_post
        @post = Post.find_by!(slug: params[:post_slug])
      end
    end
  end
end
