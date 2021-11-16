const { response } = require("express");
var express = require("express");
var router = express.Router();
var validator = require("url-validation");
const Helper = require("../helper/spreadsheet");

/* GET home page. */
router.get("/", function (req, res, next) {
  Helper.checkRow().then(() => {
    res.render("index", { title: "Short Your Urls | Shrink Url" });
  });
});
router.get("/:alias", (req, res, next) => {
  // console.log(req.params.tag);
  Helper.getUrl(req.params.alias).then((response) => {
    if (response.status) {
      res.redirect(response.longUrl);
    } else {
      res.render("error", { title: "Opps..!" });
    }
  });
});

router.post("/form", function (req, res, next) {
  // console.log(req.body);
  req.body.domain = req.headers.host;
  // console.log(req.body);
  if (req.body.alias.length < 4)
    res.json({
      status: false,
      err: "a",
      message: "Alias is not Valid, Minimum 4 characters",
    });
  else if (!validator(req.body.url))
    res.json({ status: false, err: "u", message: "Url is not Valid" });
  else {
    Helper.getRow(req.body).then((response_0) => {
      // console.log("getdata", response_0);
      if (response_0.status) {
        Helper.addRow(req.body).then((response_1) => {
          // console.log("addrow", response_1);
          res.json({
            status: true,
            url: req.body.url,
            shortUrl: response_1[3] + "/" + response_1[1],
            // shortUrl: "https://" + response_1[3] + "/" + response_1[1],
          });
        });
      } else {
        res.json(response_0);
      }
    });
  }
});

module.exports = router;
