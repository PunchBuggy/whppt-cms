import { readFileSync } from "fs";

import Graph from "./graph.router";
import Security from "./security.router";
import Project from "./project.router";
import Model from "./model.router";
import Images from "./images.router";
import Users from "./users.router";

export default context => {
  const router = context.$JsonRouter();

  router.get("/", (req, res, next) => {
    if (process.env.WHPPT_ENV === "development") return next();
    res.set("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html>

      <head>
        <meta charset="utf-8">
        <title>whppt</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/materialize-css@0.100.2/dist/css/materialize.min.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pickadate@3.5.6/lib/compressed/themes/default.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pickadate@3.5.6/lib/compressed/themes/default.date.css"> -->
      </head>

      <body>
        <div id="app"></div>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/lodash@4.17.4/lodash.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/axios@0.17.1/dist/axios.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.js"></script>
        <script type="text/javascript" src='https://cdn.jsdelivr.net/npm/marked@0.3.6/lib/marked.min.js'></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/moment@2.21.0/moment.min.js"></script>
        <!-- <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pickadate@3.5.6/lib/compressed/picker.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pickadate@3.5.6/lib/compressed/picker.date.js"></script> -->
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/materialize-css@0.100.2/dist/js/materialize.min.js"></script>
        <script type="text/javascript">
          whppt_api_base_url = "${req.originalUrl}"
        </script>
        <script type="text/javascript" src="${
          req.originalUrl
        }/main.js"></script></body>
      </html>
    `);
  });

  router.get("/main.js", (req, res, next) => {
    if (process.env.WHPPT_ENV === "development") return next();
    res.set("Content-Type", "text/javascript");
    res.send(Buffer.from(readFileSync(`${__dirname}/../static/main.js`)));
  });

  return [
    router,
    Graph(context),
    Security(context),
    Project(context),
    Model(context),
    Images(context),
    Users(context),
  ];
};
