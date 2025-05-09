const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const trackerDao = require("../../dao/tracker-dao.js");
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    date: { type: "string" },
  },
  required: [],
  additionalProperties: false,
};

async function ListAbl(req, res) {
  try {
    const filter = req.query?.date ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, filter);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const trackerList = trackerDao.list(filter);

    // get category map
    const categoryMap = categoryDao.getCategoryMap();

    // return properly filled dtoOut
    res.json({ itemList: trackerList, categoryMap });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;