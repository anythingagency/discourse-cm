import { withPluginApi } from "discourse/lib/plugin-api";
import { userPath } from "discourse/lib/url";
import { ajax } from "discourse/lib/ajax";
import { h } from "virtual-dom";

export default {

  setupComponent(args, component) {

    withPluginApi("0.8.24", api => {

      if (this.currentUser) {
        this.set('user', true);
      }
      else {
        this.set('user', false);
      }

      api.createWidget('cm-anon-toggle', {
        buildKey: () => `cm-anon-toggle`,

        tagName: 'div',

        defaultState() {
          return { clicks: 0 };
        },

        toggleAnonymous() {
          ajax(userPath("toggle-anon"), { method: "POST" }).then(() => {
            window.location.reload();
          });
        },

        html(attrs, state) { 
          const { currentUser, siteSettings } = this;
          const isAnon = currentUser.is_anonymous;
          const allowAnon =
            (siteSettings.allow_anonymous_posting &&
              currentUser.trust_level >=
                siteSettings.anonymous_posting_min_trust_level) ||
            isAnon;
          
          if (allowAnon) {
            if (!isAnon) {
              return this.attach("link", {
                action: "toggleAnonymous",
                className: "enable-anonymous",
                icon: "user-secret",
                label: "js.cm_anon_message.enable"
              });
            } else {
              return this.attach("link", {
                action: "toggleAnonymous",
                className: "disable-anonymous",
                icon: "ban",
                label: "js.cm_anon_message.disable"
              });
            }
          }   
        },

      });

    });
  },

  shouldRender(args, component) {
    return true;
  }
}