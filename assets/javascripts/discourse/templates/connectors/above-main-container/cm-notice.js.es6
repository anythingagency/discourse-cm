import { ajax } from 'discourse/lib/ajax';

export default {

  

  setupComponent(args, component) {
    // component.set('today', new Date());
    // component.set('notifications', '100');
    // component.set('isShowing', true);


    component.setProperties({
      today: new Date(),
      notifications: '200',
      isShowing: true
    })
  },

  shouldRender(args, component) {
    return true;
  },

  actions: {
    dismiss(component) {
      // this.set("isShowing", false);
      ajax(`/cm/notice-dismiss`).then((data) => {
        console.log(data);
        this.set("isShowing", false);
      });
    }
  }
}