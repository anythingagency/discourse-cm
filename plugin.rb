# name: discourse-cm
# about: 
# version: 0.2
# authors:
# url: https://github.com/


enabled_site_setting :discourse_cm_enabled

PLUGIN_NAME ||= "discourse-cm".freeze

register_asset "javascripts/jwt.js.es6"

# Style Assets
register_asset "stylesheets/common/common.scss"
register_asset "stylesheets/desktop/desktop.scss", :desktop
register_asset "stylesheets/mobile/mobile.scss", :mobile

after_initialize do

  require_dependency 'plugin_store'

  # see lib/plugin/instance.rb for the methods available in this context

  load File.expand_path('../controllers/base.rb', __FILE__)
  load File.expand_path('../controllers/notice.rb', __FILE__)
  load File.expand_path('../models/about.rb', __FILE__)
  load File.expand_path('../lib/cm.rb', __FILE__)
end
