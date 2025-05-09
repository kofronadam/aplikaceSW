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
    skiresort: { type: "string"},
    activity: { type: "number" },
    date: { type: "string", format: "date" },
    note: { type: "string" },
    categoryId: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let tracker = req.body;

    // validate input
    const valid = ajv.validate(schema, tracker);     
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

    // update tracker in database
    const updatedTracker = trackerDao.update(tracker);

    // check if categoryId exists
    const category = categoryDao.get(updatedTracker.categoryId);
    if (!category) {
      res.status(400).json({
        code: "categoryDoesNotExist",
        message: `Category with id ${updatedTracker.categoryId} does not exist`,
        validationError: ajv.errors,
      });
      return;
    }

    if (!updatedTracker) {
      res.status(404).json({
        code: "trackerNotFound",
        message: `Tracker ${tracker.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    updatedTracker.category = category;
    res.json(updatedTracker);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;