module DiscourseCm
  class NoticeController < BaseController
    
    def dismiss

      ::PluginStore.set(DiscourseCm::PLUGIN_NAME, "not_first_time", 'rhys')
      current_info = ::PluginStore.get(DiscourseCm::PLUGIN_NAME, "not_first_time")

      render json: success_json.merge(url: current_info)
    end

  end
end