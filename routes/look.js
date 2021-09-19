const express = require("express");
const Look = require("../models/look");
const fs = require("fs");

const router = express.Router();

// 유저 id별로 옷 정보 받아오기
router.get("/getLooks/:id", async (req, res, next) => {
  try {
    const look = await Look.findAll({ where: { userId: req.params.id } });
    if (look.length != 0) {
      let result = [];
      for (let i of look) {
        const image = fs.readFileSync(`./public/uploads/${i.image}`);
        let data = {
          image: image,
          title: i.image,
          style: i.style,
        };
        result.push(data);
      }
      res.send(result);
    } else {
      res.status(404).send("no look for this user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/getStyles/:id", async (req, res, next) => {
  try {
    const kindList = ["TOP", "BOTTOM", "OUTER", "OP"];
    let result = [];
    for (kind of kindList) {
      let resultDict = [];
      const looks = await Look.findAll({
        where: { userId: req.params.id, kind },
      });
      if (looks.length != 0) {
        for (let look of looks) {
          // 스타일별로 카운팅
          if (look.style in resultDict) {
            resultDict[look.style] = resultDict[look.style] + 1;
          } else {
            resultDict[look.style] = 1;
          }
        }
        var items = Object.keys(resultDict).map(function (key) {
          return [key, resultDict[key]];
        });
        items.sort(function (first, second) {
          return second[1] - first[1];
        });
        const data = {
          kind,
          style: items.slice(0, 5),
        };
        result.push(data);
      } else {
        continue;
      }
    }
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

function sortJsObject(dict) {
  var keys = [];
  for (var key in dict) {
    keys[keys.length] = key;
  }

  var values = [];
  for (var i = 0; i < keys.length; i++) {
    values[values.length] = dict[keys[i]];
  }

  var sortedValues = values.sort(sortNumber);
  return sortedValues;
}

// this is needed to sort values as integers
function sortNumber(a, b) {
  return a - b;
}

module.exports = router;
