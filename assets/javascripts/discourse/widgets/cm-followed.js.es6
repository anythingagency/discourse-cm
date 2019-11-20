import { createWidget } from "discourse/widgets/widget";
import { ajax } from 'discourse/lib/ajax';
import { h } from "virtual-dom";
import RawHtml from "discourse/widgets/raw-html";
import { jwt } from "discourse/plugins/discourse-cm/jwt";

createWidget("cm-roundel", {
  tagName: "div.c-roundel",

  html(attrs) {

    return h('div.c-roundel__wrapper', [
      h("a.c-roundel__body", { attributes: { href: attrs.href, 'data-auto-route': 'true' } }, [
        h('div.c-roundel__body__inner', [
          h('div.c-roundel__media', [
            h("div", {
              style: {
                position: 'relative',
                width: '100%'
              }
            }, [
              attrs.media
            ])
          ])
        ]),
        h("div.c-roundel__title", attrs.title)
      ])
    ]);
  }
});

createWidget("cm-followed", {
  tagName: "div.c-roundels.c-roundels--header.c-header__wpr.c-header__follows.u-bg--white",
  buildKey: () => "cm-followed",

  defaultState() {
    return { followed: [], loaded: false };
  },
  
  getMedia(image) {

    let result = [];

    // plus SVG
    result.push( [new RawHtml({ html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 73" preserveAspectRatio="xMinYMin meet" class="c-roundel__img" style="display: block; width: 100%;"><defs><clipPath id="clip-path-48"><path d="M61.26 10.738A69.805 69.805 0 0 0 34.92.048a3.109 3.109 0 0 0-3.423 2.041c-12.337.164-24.828 5.377-29.12 17.794C-2.93 35.25.606 53.733 13.44 64.253c11.972 9.812 28.518 11.305 42.426 4.802 12.94-6.051 27.636-21.948 23.387-37.304-2.465-8.911-10.57-15.989-17.992-21.013z" fill="none"></path></clipPath></defs><g style="clip-path: url(&quot;#clip-path-48&quot;);"><image xlink:href="${image}" width="100%" height="100%" preserveAspectRatio="xMinYMin slice"></image></g></svg>` })]
    );

    return result;
  },

  getMediaAddChannel() {

    let result = [];

    // circle SVG
    result.push( [new RawHtml({ html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 73" preserveAspectRatio="xMinYMin meet" class="c-roundel__img" style="display: block; width: 100%;"><defs><clipPath id="clip-path-1"><path d="M61.26 10.738A69.805 69.805 0 0 0 34.92.048a3.109 3.109 0 0 0-3.423 2.041c-12.337.164-24.828 5.377-29.12 17.794C-2.93 35.25.606 53.733 13.44 64.253c11.972 9.812 28.518 11.305 42.426 4.802 12.94-6.051 27.636-21.948 23.387-37.304-2.465-8.911-10.57-15.989-17.992-21.013z" fill="none"></path></clipPath></defs><g style="clip-path: url(&quot;#clip-path-1&quot;);"><image xlink:href="${this.siteSettings.discourse_cm_cdn_url}/120x110/${window.location.protocol}//${window.location.host}/static/media/cm-all-channels-stripes-horizontal.4fe9b631.png" href="${this.siteSettings.discourse_cm_cdn_url}/120x110/${window.location.protocol}//${window.location.host}/static/media/cm-all-channels-stripes-horizontal.4fe9b631.png" width="100%" height="100%" preserveAspectRatio="xMinYMin slice"></image></g></svg>` })]
    );
    
    return result;
  },

  combineFollowed(channels, vloggers) {

    let followedChannels = channels.map(channel => {channel.imgSrc = `${this.siteSettings.discourse_cm_cdn_url}/120x110/${window.location.protocol}${channel.image}`; channel.href = `/c/${channel.slug}`; channel.type="channel"; return channel;})

    let followedVloggers = vloggers.map(vlogger => {vlogger.imgSrc = `${this.siteSettings.discourse_cm_cdn_url}/120x110/vloggers/${vlogger.id}/${vlogger.thumbnail}`; vlogger.href = `/creators/${vlogger.slug}`; vlogger.type="vlogger"; return vlogger;})

    let combinedFollows = followedChannels.concat(followedVloggers);

    // Order alphabetically
    combinedFollows = combinedFollows.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));

    return combinedFollows;
  },

  pushFeaturedFollowed(followed) {
    let featured = [];
    let configFeatured = JSON.parse(this.siteSettings.discourse_cm_followed_featured);

    for(let i=0; i<configFeatured.length; i++){
      for(let j=0; j<followed.length; j++){
        if((followed[j].id === configFeatured[i].id) && (followed[j].type === configFeatured[i].type)){
          featured.push(followed.splice(j, 1)[0]);
        }
      }
    }

    return featured.concat(followed);
  },

  getFollowed(state) {
    var self = this;
    
    jwt(this.siteSettings.discourse_cm_api_url).then(function(response) {
      let args = {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Origin": `${window.location.protocol}//${window.location.host}`
        }
      };
    
      if (response) {
        args.headers = {
          "Authorization": `Bearer ${response}`,
        };
      }

      ajax(self.siteSettings.discourse_cm_api_url + (response ? '/me?include=channels,vloggers' : '/guest'), args).then((response) => {
        let orderedItems = self.pushFeaturedFollowed(self.combineFollowed(response.data.channels.data, response.data.vloggers.data));
        state.followed = orderedItems;
        state.loaded = true;
        self.scheduleRerender();
      }).catch((error) => {
        console.log(error);
      });
    });
  },

  getGuest(state) {
    ajax(this.siteSettings.discourse_cm_followed_guest_url).then((response) => {
      let orderedItems = this.pushFeaturedFollowed(this.combineFollowed(response.data.channels.data, response.data.vloggers.data));
      state.followed = orderedItems;
      state.loaded = true;

      this.scheduleRerender();
    });
  },

  html(attrs, state) {
    var self = this;
    let result = [];

    result.push(this.attach("cm-roundel", {
      title: 'Add Channels',
      href: '/channels',
      media: this.getMediaAddChannel()
    }));

    if (!state.loaded) {
      this.getFollowed(state);
    }

    if (state.followed) {
      state.followed.forEach(item => {
        result.push(this.attach("cm-roundel", {
          title: item.title,
          href: item.href,
          media: this.getMedia(item.imgSrc)
        }));
      });
    }

    return result;
  }
});