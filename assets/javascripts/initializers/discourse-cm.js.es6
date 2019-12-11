import { withPluginApi } from "discourse/lib/plugin-api";
import { applyDecorators } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import { userPath } from "discourse/lib/url";

function initializeDiscourseCm(api) {

  api.replaceIcon('link', 'share');
  api.replaceIcon('far-comment', 'quote-right');
  api.replaceIcon('upload', 'image');

  if (Discourse.Mobile.mobileView) {
    api.onToolbarCreate(function(toolbar) {
      toolbar.addButton({
        trimLeading: true,
        id: "toolbarMobileUpload",
        group: "insertions",
        icon: 'upload',
        title: "js.upload_selector.title",
        perform: function(e) {
          $("#mobile-uploader").click();
        }
      });
    });
  }

 
  api.changeWidgetSetting('post-menu', 'showReplyTitleOnMobile', true);
  api.changeWidgetSetting('hamburger-menu', 'showFAQ', false);
  api.changeWidgetSetting('hamburger-menu', 'showAbout', false);
  api.changeWidgetSetting('hamburger-menu', 'showCategories', true);

  // add reply button when not logged in
  if (!api.getCurrentUser()) {
    api.addPostMenuButton('reply', () => {
      return {
        action: 'showLogin',
        icon: 'reply',
        className: (Discourse.Mobile.mobileView ? 'reply create fade-out' : 'reply create fade-out'),
        title: 'post.controls.reply',
        position: 'last',
        label: 'topic.reply.title',
      };
    });
  }

  // remove topic-map box from first post
  api.reopenWidget("post-body", {

    html(attrs, state) {
      const postContents = this.attach("post-contents", attrs);
      let result = [this.attach("post-meta-data", attrs)];
      result = result.concat(
        applyDecorators(this, "after-meta-data", attrs, state)
      );
      result.push(postContents);
      result.push(this.attach("actions-summary", attrs));
      result.push(this.attach("post-links", attrs));

      return result;
    }

  });

  // tweak which icons are shown in header
  api.reopenWidget("header-icons", {

    html(attrs) {
      if (!this.currentUser) {
        return [];
      }
  
      const hamburger = this.attach("header-dropdown", {
        title: "hamburger_menu",
        icon: "bars",
        iconId: "toggle-hamburger-menu",
        active: attrs.hamburgerVisible,
        action: "toggleHamburger",
        href: "",
        contents() {
          let { currentUser } = this;
          if (currentUser && currentUser.reviewable_count) {
            return h(
              "div.badge-notification.reviewables",
              {
                attributes: {
                  title: I18n.t("notifications.reviewable_items")
                }
              },
              this.currentUser.reviewable_count
            );
          }
        }
      });
  
      const icons = [hamburger];
    
      return icons;
    }

  });

  // Make embed link a button
  api.decorateCooked(
    $elem => $elem.find('.cm-embed-button a').addClass('btn-large btn btn-text ember-view').text('Read more'),
     { id: 'cm-embed-button' }
  );

  // tweak links in hamburger menu
  const flatten = array => [].concat.apply([], array);
  api.reopenWidget("hamburger-menu", {
    

    panelContents() {
      const { currentUser } = this;
      const results = [];
  
      if (currentUser && currentUser.staff) {
        results.push(
          this.attach("menu-links", {
            name: "admin-links",
            contents: () => {
              const extraLinks = flatten(
                applyDecorators(this, "admin-links", this.attrs, this.state)
              );
              return this.adminLinks().concat(extraLinks);
            }
          })
        );
      }

      if (api.getCurrentUser()) {
        results.push(
          this.attach("menu-links", {
            name: "user-links",
            contents: () => this.userLinks()
          })
        );
      }
      
  
      results.push(
        this.attach("menu-links", {
          name: "general-links",
          contents: () => this.generalLinks()
        })
      );


      if (this.settings.showCategories) {
        results.push(this.listCategories());
        results.push(h("hr"));
      }
  
      return results;
    },

    userLinks() {
      const { siteSettings } = this;
      const isAnon = this.currentUser.is_anonymous;
      const allowAnon =
        (siteSettings.allow_anonymous_posting &&
          this.currentUser.trust_level >=
            siteSettings.anonymous_posting_min_trust_level) ||
        isAnon;

      const links = [];

      const path = this.currentUser.get("path");
      if (siteSettings.enable_personal_messages) {
        links.push({
          label: "user.private_messages",
          className: "user-pms-link",
          icon: "envelope",
          href: `${path}/messages`
        });
      }

      links.push({
        label: "user.preferences",
        className: "user-preferences-link",
        icon: "user",
        href: `${path}/preferences/account`
      });

      if (allowAnon) {
        if (!isAnon) {
          links.push({
            action: "toggleAnonymous",
            label: "switch_to_anon",
            className: "enable-anonymous",
            icon: "user-secret"
          });
        } else {
          links.push({
            action: "toggleAnonymous",
            label: "switch_from_anon",
            className: "disable-anonymous",
            icon: "ban"
          });
        }
      }

      const userLinks = flatten(
        applyDecorators(this, "generalLinks", this.attrs, this.state)
      );
      return links.concat(userLinks).map(l => this.attach("link", l));
    },

    generalLinks() {
      const { siteSettings } = this;
      
      const links = [];
  
      links.push({
        route: "discovery.latest",
        className: "latest-topics-link",
        label: "filters.latest.title",
        title: "filters.latest.help"
      });

      if (this.currentUser) {
        const path = this.currentUser.get("path");

        links.push({
          route: "discovery.posted",
          className: "posted-link",
          label: "filters.posted.title",
          title: "filters.posted.help"
        });

        links.push({
          label: "user.bookmarks",
          className: "user-bookmarks-link",
          href: `${path}/activity/bookmarks`
        });
      }
      
  
      // Staff always see the review link. Non-staff will see it if there are items to review
      if (
        this.currentUser &&
        (this.currentUser.staff || this.currentUser.reviewable_count)
      ) {
        links.push({
          route: siteSettings.reviewable_default_topics
            ? "review.topics"
            : "review",
          className: "review",
          label: "review.title",
          badgeCount: "reviewable_count",
          badgeClass: "reviewables"
        });
      }

      links.push({
        label: "search.advanced.title",
        className: "advanced-search-link",
        href: Discourse.getURL("/search")
      });
  
      const extraLinks = flatten(
        applyDecorators(this, "generalLinks", this.attrs, this.state)
      );
      return links.concat(extraLinks).map(l => this.attach("link", l));
    },
  });

  // add additonal page views when scrolling
  api.modifyClass('component:d-editor', {

    constructor(opts) {
      const { siteSettings } = opts;
      this.shortcuts = {};
      this.context = null;
  
      this.groups = [
        { group: "fontStyles", buttons: [] },
        { group: "insertions", buttons: [] },
        { group: "extras", buttons: [] }
      ];
  
      this.addButton({
        trimLeading: true,
        id: "italic",
        group: "fontStyles",
        icon: "italic",
        label: getButtonLabel("composer.italic_label", "I"),
        shortcut: "I",
        perform: e => e.applySurround("*", "*", "italic_text")
      });
  
      if (opts.showLink) {
        this.addButton({
          id: "link",
          group: "insertions",
          shortcut: "K",
          action: (...args) => this.context.send("showLinkModal", args)
        });
      }
  
      this.addButton({
        id: "quote",
        group: "insertions",
        icon: "quote-right",
        shortcut: "Shift+9",
        perform: e =>
          e.applyList("> ", "blockquote_text", {
            applyEmptyLines: true,
            multiline: true
          })
      });
  
      this.addButton({
        id: "code",
        group: "insertions",
        shortcut: "Shift+C",
        action: (...args) => this.context.send("formatCode", args)
      });
  
      this.addButton({
        id: "bullet",
        group: "extras",
        icon: "list-ul",
        shortcut: "Shift+8",
        title: "composer.ulist_title",
        perform: e => e.applyList("* ", "list_item")
      });
  
      this.addButton({
        id: "list",
        group: "extras",
        icon: "list-ol",
        shortcut: "Shift+7",
        title: "composer.olist_title",
        perform: e =>
          e.applyList(i => (!i ? "1. " : `${parseInt(i) + 1}. `), "list_item")
      });
  
      if (siteSettings.support_mixed_text_direction) {
        this.addButton({
          id: "toggle-direction",
          group: "extras",
          icon: "exchange-alt",
          shortcut: "Shift+6",
          title: "composer.toggle_direction",
          perform: e => e.toggleDirection()
        });
      }
  
      this.groups[this.groups.length - 1].lastGroup = true;
    }


  });
  
  // add additonal page views when scrolling
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
