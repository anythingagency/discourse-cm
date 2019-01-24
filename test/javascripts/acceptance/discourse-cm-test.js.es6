import { acceptance } from "helpers/qunit-helpers";

acceptance("DiscourseCm", { loggedIn: true });

test("DiscourseCm works", async assert => {
  await visit("/admin/plugins/discourse-cm");

  assert.ok(false, "it shows the DiscourseCm button");
});
