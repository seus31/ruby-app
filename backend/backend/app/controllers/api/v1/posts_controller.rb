# frozen_string_literal: true

module Api
  module V1
    # Api/v1/PostsController
    class PostsController < ProtectedController
      before_action :set_post, only: %i[show update destroy]
      def index
        posts = Post.all
        render json: posts, each_serializer: PostSerializer
      end

      def create
        post = Post.new(post_params)
        if post.save
          render json: post, status: :created
        else
          render json: post.errors, status: :unprocessable_entity
        end
      end

      def show
        render json: @post
      end

      def update
        if @post.update(post_params)
          render json: @post, status: :ok
        else
          render json: @post.errors, status: :unprocessable_entity
        end
      end

      def destroy
        ActiveRecord::Base.transaction do
          @post.destroy!
        end

        render json: { message: 'Post successfully deleted' }, status: :ok
      end

      private

      def set_post
        @post = Post.find(params[:id])
      end

      def post_params
        params.required(:post).permit(:title, :body, :status)
      end
    end
  end
end
