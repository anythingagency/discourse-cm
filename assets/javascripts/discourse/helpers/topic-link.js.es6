import { registerUnbound } from "discourse-common/lib/helpers";

registerUnbound("topic-link", (topic, args) => {
  const title = topic.get("fancyTitle");
  // const url = topic.linked_post_number
  //   ? topic.urlForPostNumber(topic.linked_post_number)
  //   : topic.get("lastUnreadUrl");

  // CM hack - removed auto scroll
  const url = topic.urlForPostNumber(topic.linked_post_number);


  const classes = ["title"];
  if (args.class) {
    args.class.split(" ").forEach(c => classes.push(c));
  }

  const result = `<a href='${url}'
                     class='${classes.join(" ")}'
                     data-topic-id='${topic.id}'>${title}</a>`;
  return new Handlebars.SafeString(result);
});
