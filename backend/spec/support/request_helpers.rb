# frozen_string_literal: true

module RequestHelpers
  def set_request_host!
    host! "localhost"
  end

  def json_headers
    { "ACCEPT" => "application/json", "CONTENT_TYPE" => "application/json" }
  end

  def auth_headers_for(user, password:)
    post "/api/auth/login", params: { email: user.email, password: password }, as: :json
    token = JSON.parse(response.body)["token"]
    return {} if token.blank?

    { "Authorization" => "Bearer #{token}" }.merge("CONTENT_TYPE" => "application/json", "ACCEPT" => "application/json")
  end
end

RSpec.configure do |config|
  config.include RequestHelpers, type: :request
  config.before(type: :request) { set_request_host! }
end
