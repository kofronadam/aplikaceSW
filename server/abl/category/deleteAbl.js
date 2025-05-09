const Ajv = require("ajv");
const ajv = new Ajv();
const categoryDao = require("../../dao/category-dao.js");
const trackerDao = require("../../dao/tracker-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    const reqParams = req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        category: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check there is no tracker related to given category
    const trackerList = trackerDao.listByCategoryId(reqParams.id);
    if (trackerList.length) {
      res.status(400).json({
        code: "categoryWithTracker",
        message: "category has related tracker and cannot be deleted",
        validationError: ajv.errors,
      });
      return;
    }

    // remove tracker from persistant storage
    categoryDao.remove(reqParams.id);

    // return properly filled dtoOut
    res.json({});
  } catch (e) {
    res.status(500).json({ category: e.category });
  }
}

module.exports = DeleteAbl;