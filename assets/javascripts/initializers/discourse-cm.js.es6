import { withPluginApi } from "discourse/lib/plugin-api";

function initializeDiscourseCm(api) {
  
  // see app/assets/javascripts/discourse/lib/plugin-api
  // for the functions available via the api object

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

          api.addGTMPageChangedCallback( gtmData )
          console.log(gtmData);
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

          api.addGTMPageChangedCallback( gtmData )
          console.log(gtmData);
        }

        this._super(...arguments);
      }
    }
    
  });

}

export default {
  name: "discourse-cm",

  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    if (siteSettings.discourse_cm_enabled)
      withPluginApi("0.8.24", initializeDiscourseCm);
  }
};
