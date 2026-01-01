# frozen_string_literal: true

module Api
  # Api/AuthController
  class AuthController < BaseController
    def register
      user = User.new(register_params)
      if user.save
        render json: { message: 'User created successfully' }, status: :created
      else
        render json: { error: user.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    end

    def login
      user = User.find_by(email: params[:email])
      if user&.authenticate(params[:password])
        token = encode_token({ user_id: user.id })
        render json: { token: }, status: :ok
      else
        render json: { error: 'Invalid email or password' }, status: :unauthorized
      end
    end

    private

    def register_params
      params.permit(:name, :email, :password)
    end

    def login_params
      params.permit(:email, :password)
    end
  end
end
