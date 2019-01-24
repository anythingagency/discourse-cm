require_dependency 'application_controller'
module ::DiscourseCm
  PLUGIN_NAME = "discourse-cm".freeze

  class Engine < ::Rails::Engine
    engine_name 'discourse_cm'
    isolate_namespace DiscourseCm
  end
end

DiscourseCm::Engine.routes.draw do
  get 'notice-dismiss' => 'notice#dismiss'
end

Discourse::Application.routes.append do
  mount ::DiscourseCm::Engine, at: 'cm'
end
