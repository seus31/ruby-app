# frozen_string_literal: true

module Api
  module V1
    class CommentsController < ProtectedController
      skip_before_action :authenticate_user!, only: [:index]
      before_action :set_post
      before_action :set_comment, only: [:destroy]

      def index
        comments = @post.comments.where(parent_id: nil).includes(replies: [{ replies: :user }, :user], :user)
        render json: comments, each_serializer: CommentSerializer
      end

      def create
        comment = @post.comments.build(comment_params)
        comment.user = current_user
        if comment.save
          render json: comment, serializer: CommentSerializer, status: :created
        else
          render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        unless @comment.user_id == current_user.id
          return render json: { error: "Forbidden" }, status: :forbidden
        end
        @comment.destroy!
        render json: { message: "Comment successfully deleted" }, status: :ok
      end

      private

      def set_post
        @post = Post.find_by!(slug: params[:post_slug])
      end

      def set_comment
        @comment = @post.comments.find(params[:id])
      end

      def comment_params
        params.require(:comment).permit(:body, :parent_id)
      end
    end
  end
end
