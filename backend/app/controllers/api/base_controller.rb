# frozen_string_literal: true

# Api/v1/BaseController
module Api
  class BaseController < ApplicationController
    include ExceptionHandler
  end
end