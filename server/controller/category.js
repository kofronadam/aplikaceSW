const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/category/getAbl");
const ListAbl = require("../abl/category/listAbl");
const CreateAbl = require("../abl/category/createAbl");
const UpdateAbl = require("../abl/category/updateAbl");
const DeleteAbl = require("../abl/category/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
