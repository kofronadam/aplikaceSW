const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const trackerDao = require("../../dao/tracker-dao.js");
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    skiresort: { type: "string", maxLength: 150 },  //TODO: zkontrolovat 
    activity: { type: "number" },
    date: { type: "string", format: "date" },
    note: { type: "string", maxLength: 250 },
    categoryId: { type: "string" },
  },
  required: ["skiresort", "aktivita", "date", "categoryId"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let tracker = req.body;

    // validate input
    const valid = ajv.validate(schema, tracker);      //TODO: nelze vytvorit, vraci chybu
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // validate date
    if (new Date(tracker.date) >= new Date()) {
      res.status(400).json({
        code: "invalidDate",
        message: `date must be current day or a day in the past`,
        validationError: ajv.errors,
      });
      return;
    }

    // check if categoryId exists
    const category = categoryDao.get(tracker.categoryId);

    if (!category) {
      res.status(400).json({
        code: "categoryDoesNotExist",
        message: `category with id ${tracker.categoryId} does not exist`,
        validationError: ajv.errors,
      });
      return;
    }

    // store tracker to persistent storage
    tracker = trackerDao.create(tracker);
    tracker.category = category;

    // return properly filled dtoOut
    res.json(tracker);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;