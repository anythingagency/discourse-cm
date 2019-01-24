# name: DiscoursePluginCm
# about:
# version: 0.1
# authors: 
# url: https://github.com/


enabled_site_setting :discourse_cm_enabled

PLUGIN_NAME ||= "DiscourseCm".freeze

register_asset "stylesheets/cm.scss"

after_initialize do

  require_dependency 'plugin_store'
  
  # see lib/plugin/instance.rb for the methods available in this context

  load File.expand_path('../controllers/base.rb', __FILE__)
  load File.expand_path('../controllers/notice.rb', __FILE__)

  load File.expand_path('../lib/cm.rb', __FILE__)
end
