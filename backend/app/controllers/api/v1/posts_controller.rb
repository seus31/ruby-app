# frozen_string_literal: true

module Api
  module V1
    class PostsController < ProtectedController
      skip_before_action :authenticate_user!, only: %i[index show]
      before_action :set_post, only: %i[show update destroy]

      def index
        posts = Post.published
        if params[:q].present?
          sanitized = ActiveRecord::Base.sanitize_sql_like(params[:q])
          posts = posts.where("title LIKE ? OR body LIKE ?", "%#{sanitized}%", "%#{sanitized}%")
        end
        posts = posts.joins(:categories).where(categories: { slug: params[:category_slug] }) if params[:category_slug].present?
        posts = posts.joins(:tags).where(tags: { slug: params[:tag_slug] }) if params[:tag_slug].present?
        posts = posts.where(user_id: params[:user_id]) if params[:user_id].present?
        posts = posts.distinct if params[:category_slug].present? || params[:tag_slug].present?

        per_page = [(params[:per_page] || 20).to_i, 50].min
        page = [params[:page].to_i, 1].max
        total_count = posts.count
        posts = posts.order(published_at: :desc).offset((page - 1) * per_page).limit(per_page)
        total_pages = (total_count.to_f / per_page).ceil

        render json: {
          posts: ActiveModel::SerializableResource.new(posts, each_serializer: PostSerializer).as_json,
          meta: { current_page: page, total_pages: total_pages, total_count: total_count }
        }
      end

      def show
        render json: @post, serializer: PostSerializer, scope: current_user
      end

      def create
        post = Post.new(post_params)
        post.user = current_user
        assign_category_and_tag_ids(post)
        if post.save
          render json: post, serializer: PostSerializer, status: :created
        else
          render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        unless @post.user_id == current_user.id
          return render json: { error: "Forbidden" }, status: :forbidden
        end
        assign_category_and_tag_ids(@post)
        if @post.update(post_params)
          render json: @post, serializer: PostSerializer, status: :ok
        else
          render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        unless @post.user_id == current_user.id
          return render json: { error: "Forbidden" }, status: :forbidden
        end
        @post.destroy!
        render json: { message: "Post successfully deleted" }, status: :ok
      end

      private

      def set_post
        @post = Post.find_by!(slug: params[:slug])
      end

      def post_params
        params.require(:post).permit(:title, :body, :excerpt, :status, :thumbnail_url)
      end

      def assign_category_and_tag_ids(post)
        post.category_ids = params[:post][:category_ids] if params[:post].key?(:category_ids)
        post.tag_ids = params[:post][:tag_ids] if params[:post].key?(:tag_ids)
      end
    end
  end
end
