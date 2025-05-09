const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/tracker/getAbl");
const ListAbl = require("../abl/tracker/listAbl");
const CreateAbl = require("../abl/tracker/createAbl");
const UpdateAbl = require("../abl/tracker/updateAbl");
const DeleteAbl = require("../abl/tracker/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;