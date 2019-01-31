import { ajax } from 'discourse/lib/ajax';
import { withPluginApi } from "discourse/lib/plugin-api";


export default {

  setupComponent(args, component) {
  
    withPluginApi("0.8.24", api => {
      const siteSettings = api.container.lookup("site-settings:main");
      const notificationUrl = siteSettings.discourse_cm_notification_url + (this.currentUser ? this.currentUser.username : '');
      
      const checkNotifications = function(siteSettings) {

        ajax(notificationUrl).then((response) => {
          component.set('notifications', response.data.total);
        });
  
        setTimeout(checkNotifications, 10000, notificationUrl);
      }
  
      if (this.currentUser) {
        
        this.set('user', true);
        this.set('userAvatar', this.currentUser.avatar_template.replace('{size}', 64));
  
        checkNotifications(notificationUrl);
      }
      else {
        this.set('user', false);
      }

      api.modifyClass('component:site-header', {

        afterRender() {
          this._super();
          const header = document.querySelector('header.d-header');
          const cmheader = document.querySelector('header#cm-header');
          header.style.marginTop = cmheader.offsetHeight + 'px';
        }
        
      });
    });
    
    

    

    // fix position of sticky header
    withPluginApi("0.8.24", api => {
      
    });


  },

  shouldRender(args, component) {
    return true;
  },

  actions: {
    
  }
}