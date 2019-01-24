import { ajax } from 'discourse/lib/ajax';
import { withPluginApi } from "discourse/lib/plugin-api";


export default {

  setupComponent(args, component) {
    
    const checkNotifications = function() {
      
      ajax(`https://api.cm.anything.agency/notifications/anything`).then((response) => {
        component.set('notifications', response.data.total);
      });

      setTimeout(checkNotifications, 10000);
    }

    if (this.currentUser) {
      
      this.set('user', true);
      this.set('userAvatar', this.currentUser.avatar_template.replace('{size}', 64));

      checkNotifications();
    }
    else {

      this.set('user', false);
    }

    

    // fix position of sticky header
    withPluginApi("0.8.24", api => {
      api.modifyClass('component:site-header', {

        afterRender() {
          this._super();
          const header = document.querySelector('header.d-header');
          const cmheader = document.querySelector('header#cm-header');
          header.style.marginTop = cmheader.offsetHeight + 'px';
        }
        
      });
    });


  },

  shouldRender(args, component) {
    return true;
  },

  actions: {
    
  }
}