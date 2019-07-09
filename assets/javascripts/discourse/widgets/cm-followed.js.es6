import { createWidget } from "discourse/widgets/widget";
import { ajax } from 'discourse/lib/ajax';
import { h } from "virtual-dom";
import RawHtml from "discourse/widgets/raw-html";
import { jwt } from "discourse/plugins/discourse-cm/jwt";

createWidget("cm-roundel", {
  tagName: "div.c-roundel",

  html(attrs) {

    return h('div.c-roundel__wrapper', [
      h("a.c-roundel__body", { attributes: { href: attrs.href, 'data-auto-route': 'false' } }, [
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
    
    // plus SVG
    result.push( [new RawHtml({ html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.452 13.452" width="13.452" height="13.452" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"><path fill="#878787" d="M7.56 5.893h5.058a.833.833 0 0 1 0 1.666H7.56v5.06a.833.833 0 0 1-1.666 0v-5.06H.833a.833.833 0 0 1 0-1.666h5.06V.833a.833.833 0 0 1 1.666 0z"></path></svg>` })]
    );

    // circle SVG
    result.push( [new RawHtml({ html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 73" preserveAspectRatio="xMinYMin meet" class="c-roundel__img" style="display: block; width: 100%;"><path fill="#D0D0D0" d="M34.4 0a3.1 3.1 0 0 0-2.9 2l-.4.1H30.2v2H33l.4-1.4a1.2 1.2 0 0 1 1-.7V0zm-9 2.6l-1.6.3h-.4l-.2.1h-.3l-2.4.7.5 2a36.7 36.7 0 0 1 4.6-1.1l-.3-2zm-9.6 2.8A28.6 28.6 0 0 0 11.4 8l1.2 1.7a26.7 26.7 0 0 1 4-2.3l-.8-1.9zm-8.1 5.8h-.1v.1h-.1v.1h-.1l-.1.2L6 13v.1h-.1v.1h-.1v.2h-.1v.1h-.1v.1h-.1v.1l-.1.1v.1l-.1.1-.7 1 1.7 1a21.6 21.6 0 0 1 2.8-3.5l-1.4-1.4zm-5.2 8.4v.1l-.1.2v.1l-.1.1v.2l-.1.1V20.8H2v.2l-.1.2v.2l-1 3.1 2 .5a41.1 41.1 0 0 1 1.3-4.4v-.2l-1.8-.7zM.3 29.4L0 30.7V33.5H0v1h2a42.3 42.3 0 0 1 .2-4.8l-2-.2zm2 9.7l-2 .2.1.9v.5h.1V41l.7 3.3 2-.5a40.5 40.5 0 0 1-1-4.7zm2.2 9.2l-1.8.7v.4h.1v.2H3v.2H3V50.2h.1v.2h.1V50.7h.1v.2h.1v.2h.1v.2h.1v.2l.1.1v.2h.1v.2l1 1.7 1.7-1a36.5 36.5 0 0 1-2-4.3zM9 56.6l-1.6 1.2v.1h.1v.1l.1.1v.1h.1v.1l.1.1v.1H8v.1H8v.1h.1v.2h.1v.1h.1v.1h.1v.1h.1v.1l.1.1v.1h.1v.1h.1v.1H9l1.7 2 1.4-1.5a33 33 0 0 1-3-3.6zm6.6 6.8L14.3 65a38.2 38.2 0 0 0 4.2 2.7l1-1.7a36.4 36.4 0 0 1-4-2.6zm8.1 4.7L23 70h.2v.1h.1a38.8 38.8 0 0 0 3.9 1.4h.2l.3.1.5-2a37 37 0 0 1-4.5-1.5zm9.2 2.5l-.3 2h.4a40.3 40.3 0 0 0 4.2.4h.4v-2a38.5 38.5 0 0 1-4.7-.4zM47 70a39.7 39.7 0 0 1-4.7.8l.2 2a41.6 41.6 0 0 0 5-.8l-.5-2zm9-3.2l-1 .4a40.4 40.4 0 0 1-3.4 1.5l.7 1.8q1.8-.6 3.5-1.4h.1l1-.5-1-1.8zm8-5.2a47.8 47.8 0 0 1-4 2.8l1.2 1.7 1.6-1.1v-.1h.2v-.1h.1v-.1h.1l1.9-1.5h.1L64 61.5zm6.8-6.8a45.5 45.5 0 0 1-3.3 3.6l1.5 1.4 1.3-1.4v-.1h.1v-.1h.1V58h.1V58q1-1 1.7-2l-1.5-1.2zm5-8a33 33 0 0 1-2.2 4.2l1.7 1 1-1.7v-.1l.1-.1V50h.1v-.2h.1v-.2h.1v-.2h.1v-.1l.8-1.6-1.8-.9zM78 38a21.6 21.6 0 0 1-.7 4.6l2 .4.2-1V41.5h.1V41h.1v-.6A22.5 22.5 0 0 0 80 38h-2zm0-9.6l-1.8.8a21.2 21.2 0 0 1 1.1 3.2l.3 1.1 2-.4-.3-1.2v-.2h-.1V31.2H79V31H79V30.6h-.1V30.3h-.1V30l-.6-1.2V28.5H78v-.2H78v-.1zm-5.6-8.2l-1.5 1.3a35.4 35.4 0 0 1 3 3.7l1.6-1.1-.4-.5v-.2H75v-.1h-.1V23h-.1v-.1h-.1v-.1h-.1v-.1l-.1-.1v-.1h-.1v-.1h-.1v-.1h-.1v-.1L74 22V22H74l-1.6-2zM65 13.4L63.7 15a62.3 62.3 0 0 1 3.8 3l1.3-1.4-1.3-1.1-.2-.3a56.5 56.5 0 0 0-.2-.1L67 15h-.1v-.1h-.1v-.1h-.1v-.1h-.1l-.1-.1-.1-.1h-.1v-.1h-.1v-.1H66l-.1-.1h-.1V14h-.1V14h-.1v-.1h-.2v-.1h-.1v-.1l-.4-.3zm-8.4-5.5l-1 1.7a64.8 64.8 0 0 1 4.2 2.5l1-1.6v-.1h-.1l-.1-.1-4-2.4zm-9-4.3l-.7 1.9a67.5 67.5 0 0 1 4.4 1.9l.9-1.8-.6-.3h-.2v-.1h-.2V5H51V5h-.2l-.1-.1h-.2v-.1l-.3-.1H50v-.1h-.2v-.1h-.2v-.1H49.2v-.1H49v-.1H49l-1.4-.6zM38 .7l-.4 2c1.6.3 3.1.7 4.7 1.2l.6-2h-.2l-3-.8h-.4V1h-.4V.8h-.4V.7H38V.6z"></path></svg>` })]
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

    
    
    let args = {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Origin": `${window.location.protocol}//${window.location.host}`
      }
    };

    
   
    jwt(this.siteSettings.discourse_cm_api_url).then(jwt => {
      const url = (jwt ? this.siteSettings.discourse_cm_followed_user_url : this.siteSettings.discourse_cm_followed_guest_url);  

      if (jwt) {
        args.headers = {
          "Authorization": `Bearer ${jwt}`,
        };
      }

      ajax(this.siteSettings.discourse_cm_api_url + (jwt ? '/me?include=channels,vloggers' : '/guest'), args).then((response) => {
        let orderedItems = this.pushFeaturedFollowed(this.combineFollowed(response.data.channels.data, response.data.vloggers.data));
        state.followed = orderedItems;
        state.loaded = true;
  
        this.scheduleRerender();
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