const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const docsRoute = require("./docs.routes");
const profileRoute = require("./profile.routes");
const subscriptionRoute = require("./subscription.routes");
const messageRouter = require("./message.route");
const conversationRouter = require("./conversation.route");



const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/subscription",
    route: subscriptionRoute,
  },
  {
    path: "/profiles",
    route: profileRoute,
  },
 {
    path: "/conversation",
    route: conversationRouter,
  },
 {
    path: "/message",
    route: messageRouter,
  },
 

];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
