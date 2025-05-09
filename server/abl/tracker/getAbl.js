const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const trackerDao = require("../../dao/tracker-dao.js");
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read tracker by given id
    const tracker = trackerDao.get(reqParams.id);
    if (!tracker) {
      res.status(404).json({
        code: "trackerNotFound",
        message: `Tracker ${reqParams.id} not found`,
      });
      return;
    }

    // get related category
    const category = categoryDao.get(tracker.categoryId);
    tracker.category = category;

    // return properly filled dtoOut
    res.json(tracker);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = GetAbl;