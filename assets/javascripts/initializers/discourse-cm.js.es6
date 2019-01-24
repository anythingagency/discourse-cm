import { withPluginApi } from "discourse/lib/plugin-api";

function initializeDiscourseCm(api) {
  
  // see app/assets/javascripts/discourse/lib/plugin-api
  // for the functions available via the api object

  

  

  api.modifyClass('component:scrolling-post-stream', {
    _lastPost: null,

    scrolled() {
      this._super();
      if (this._lastPost == null) {
        this._lastPost = this._currentPost;
      }
      if (this._lastPost !== this._currentPost) {
        console.log('change');
        this._lastPost = this._currentPost;
      }
    }
  });



  api.onAppEvent('topic:current-post-changed', (post) => {
    console.log('change topic');
  });

  
}

export default {
  name: "discourse-cm",

  initialize() {
    withPluginApi("0.8.24", initializeDiscourseCm);
  }
};
