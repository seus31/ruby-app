# frozen_string_literal: true

module Api
  module V1
    # Api/v1/CategoriesController
    class CategoriesController < ProtectedController
      before_action :set_category, only: %i[show update]
      def create
        category = Category.new(post_params)
        if category.save
          render json: category, status: :created
        else
          render json: category.errors, status: :unprocessable_entity
        end
      end

      def index
        categories = Category.all
        render json: categories, each_serializer: CategorySerializer
      end

      def show
        render json: @category, status: :ok
      end

      def update
        if @category.update(post_params)
          render json: @category, status: :ok
        else
          render json: @category.errors, status: :unprocessable_entity
        end
      end

      def destroy
        ActiveRecord::Base.transaction do
          @category.destroy!
        end

        render json: { message: 'Post successfully deleted' }, status: :ok
      end

      private

      def set_category
        @category = Category.find(params[:id])
      end

      def post_params
        params.required(:category).permit(:category_name)
      end
    end
  end
end

