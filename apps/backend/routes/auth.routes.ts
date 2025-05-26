import passport from "passport";
import OpenIDConnectStrategy from "passport-openidconnect";
import { Router } from "express";

passport.use(
  new OpenIDConnectStrategy(
    {
      issuer: "https://" + process.env["AUTH0_DOMAIN"] + "/",
      authorizationURL: "https://" + process.env["AUTH0_DOMAIN"] + "/authorize",
      tokenURL: "https://" + process.env["AUTH0_DOMAIN"] + "/oauth/token",
      userInfoURL: "https://" + process.env["AUTH0_DOMAIN"] + "/userinfo",
      clientID: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/api/oauth/redirect/",
      scope: ["openid", "profile", "email", "token"],
    },
    function verify(issuer, profile, cb) {
      if (!profile) {
        return cb(new Error("No profile found"));
      }
      console.log(profile);
      const userEmail = profile.emails[0]?.value || "";
      const userName = profile.displayName.displayName;

      // You could store/fetch user here from DB
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user._id, username: user.username, email: user.email });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const OAuthRouter = Router();

OAuthRouter.get("/login", passport.authenticate("openidconnect"));

OAuthRouter.get(
  "/redirect",
  passport.authenticate("openidconnect", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000/login",
  })
);

OAuthRouter.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

OAuthRouter.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).send("Not logged in");
  }
});

export default OAuthRouter;
