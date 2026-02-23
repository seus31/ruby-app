# frozen_string_literal: true

module Api
  class BaseController < ApplicationController
    include ExceptionHandler

    SECRET_KEY = Rails.application.secrets.secret_key_base.to_s

    def encode_token(payload)
      payload[:exp] = 24.hours.from_now.to_i
      JWT.encode(payload, SECRET_KEY)
    end

    def decode_token(token)
      JWT.decode(token, SECRET_KEY, true, algorithm: "HS256")
    rescue JWT::DecodeError
      nil
    end
  end
end