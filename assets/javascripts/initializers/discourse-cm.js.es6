import { withPluginApi } from "discourse/lib/plugin-api";

function initializeDiscourseCm(api) {

  if (!api.getCurrentUser()) {
    api.addPostMenuButton('reply', () => {
      return {
        action: 'showLogin',
        icon: 'reply',
        className: (Discourse.Mobile.mobileView ? 'reply create fade-out' : 'reply create fade-out'),
        title: 'post.controls.reply',
        position: 'last',
        label: (Discourse.Mobile.mobileView ? '' : 'topic.reply.title'),
      };
    });
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

// seperate function so it can be enabled seperately
function initializeDiscourseCmSso(api) {
  if (typeof localStorage !== 'undefined') {
    const ssoUrl = Discourse.BaseUri + '/session/sso?return_path=' + window.location.pathname;
    if (localStorage.getItem("jwt") && !api.getCurrentUser()) {
      if (!document.referrer.includes(ssoUrl)) {
        window.location = ssoUrl;
      }
    }
  }
}

export default {
  name: "discourse-cm",

  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    if (siteSettings.discourse_cm_enabled) {
      withPluginApi("0.8.24", initializeDiscourseCm);
      if (siteSettings.discourse_cm_sso_redirect) {
        withPluginApi("0.8.24", initializeDiscourseCmSso);
      }
    } 
  }
};
