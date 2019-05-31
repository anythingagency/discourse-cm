import { withPluginApi } from "discourse/lib/plugin-api";

function initializeDiscourseCm(api) {
  
  const siteSettings = container.lookup("site-settings:main");

  if (!siteSettings.discourse_cm_enabled) {
    return;
  }

  if (siteSettings.discourse_cm_sso_redirect) {
    if (typeof localStorage !== 'undefined') {
      var ssoUrl = Discourse.BaseUri + '/session/sso?return_path=' + window.location.pathname;
      if (localStorage.getItem("jwt") && !api.getCurrentUser()) {
        if (!document.referrer.includes(ssoUrl)) {
          window.location = ssoUrl;
        }
      }
    }
  }

  api.modifyClass('controller:topic', {
    
    actions: {
      bottomVisibleChanged(event) {
        
        const { post, refresh } = event;
        
        const postStream = this.get("model.postStream");
        const lastLoadedPost = postStream.get("posts.lastObject");

        if (
          lastLoadedPost &&
          lastLoadedPost === post &&
          postStream.get("canAppendMore")
        ) {
          let gtmData = {
            event: "virtualPageView",
            page: {
              title: Discourse.get("_docTitle"),
              url: Discourse.getURL(post.get("url"))
            }
          };
          
          if (typeof window.dataLayer !== "undefined") {
            window.dataLayer.push(gtmData);
          }
        }

        this._super(...arguments);
      },
  
      topVisibleChanged(event) {
        const { post, refresh } = event;
        
        if (!post) {
          return;
        }
  
        const postStream = this.get("model.postStream");
        const firstLoadedPost = postStream.get("posts.firstObject");

        if (post.get && post.get("post_number") === 1) {
          return;
        }
  
        if (firstLoadedPost && firstLoadedPost === post) {
          let gtmData = {
            event: "virtualPageView",
            page: {
              title: Discourse.get("_docTitle"),
              url: Discourse.getURL(post.get("url"))
            }
          };

          if (typeof window.dataLayer !== "undefined") {
            window.dataLayer.push(gtmData);
          }
        }

        this._super(...arguments);
      }
    }
    
  });

}

export default {
  name: "discourse-cm",

  initialize(container) {
    withPluginApi("0.8.24", initializeDiscourseCm);
  }
};
