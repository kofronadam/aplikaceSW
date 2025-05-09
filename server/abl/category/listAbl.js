const categoryDao = require("../../dao/category-dao.js");

async function ListAbl(req, res) {
  try {
    const categoryList = categoryDao.list();
    res.json({ itemList: categoryList });
  } catch (e) {
    res.status(500).json({ category: e.category });
  }
}

module.exports = ListAbl;