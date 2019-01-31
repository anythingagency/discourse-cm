import { ajax } from 'discourse/lib/ajax';

export default {

  setupComponent(args, component) {
    this.set("isShowing", (!$.cookie("welcome") ? true : false))
  },

  shouldRender(args, component) {
    return true;
  },

  actions: {
    dismiss(component) {
      ajax(`/cm/notice-dismiss`).then((data) => {;
        this.set("isShowing", false);
        $.cookie("welcome", true);
      });
    }
  }
}