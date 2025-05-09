const Ajv = require("ajv");
const ajv = new Ajv();
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
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
        category: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read category by given id
    const category = categoryDao.get(reqParams.id);
    if (!category) {
      res.status(404).json({
        code: "categoryNotFound",
        category: `Category with id ${reqParams.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(category);
  } catch (e) {
    res.status(500).json({ category: e.category });
  }
}

module.exports = GetAbl;