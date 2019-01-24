module DiscourseCm
  class BaseController < ::ApplicationController
  
    def render_result(result = {})
      if result[:error_message]
        render json: failed_json.merge(message: result[:error_message])
      else
        render json: success_json.merge(result)
      end
    end
    
  end
end
