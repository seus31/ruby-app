# frozen_string_literal: true

module Api
  module V1
    class CategoriesController < ProtectedController
      skip_before_action :authenticate_user!, only: %i[index show]
      before_action :set_category, only: %i[show update destroy]

      def index
        categories = Category.all
        render json: categories, each_serializer: CategorySerializer
      end

      def show
        render json: @category, serializer: CategorySerializer
      end

      def create
        category = Category.new(category_params)
        if category.save
          render json: category, serializer: CategorySerializer, status: :created
        else
          render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @category.update(category_params)
          render json: @category, serializer: CategorySerializer, status: :ok
        else
          render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @category.posts.exists?
          return render json: { errors: ["Category has associated posts"] }, status: :unprocessable_entity
        end
        @category.destroy!
        render json: { message: "Category successfully deleted" }, status: :ok
      end

      private

      def set_category
        @category = Category.find_by!(slug: params[:slug])
      end

      def category_params
        params.require(:category).permit(:category_name, :slug, :description)
      end
    end
  end
end
