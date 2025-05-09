const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const categoryFolderPath = path.join(__dirname, "storage", "categoryList");

// Method to read an category from a file
function get(categoryId) {
  try {
    const filePath = path.join(categoryFolderPath, `${categoryId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadCategory", category: error.category };
  }
}

// Method to write an category to a file
function create(category) {
  try {
    const categoryList = list();
    if (categoryList.some((item) => item.name === category.name)) {
      throw {
        code: "uniqueNameAlreadyExists",
        message: "exists category with given name",
      };
    }
    category.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(categoryFolderPath, `${category.id}.json`);
    const fileData = JSON.stringify(category);
    fs.writeFileSync(filePath, fileData, "utf8");
    return category;
  } catch (error) {
    throw { code: "failedToCreateCategory", category: error.category };
  }
}

// Method to update category in a file
function update(category) {
  try {
    const currentCategory = get(category.id);
    if (!currentCategory) return null;

    if (category.name && category.name !== currentCategory.name) {
      const categoryList = list();
      if (categoryList.some((item) => item.name === category.name)) {
        throw {
          code: "uniqueNameAlreadyExists",
          message: "exists category with given name",
        };
      }
    }

    const newCategory = { ...currentCategory, ...category };
    const filePath = path.join(categoryFolderPath, `${category.id}.json`);
    const fileData = JSON.stringify(newCategory);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newCategory;
  } catch (error) {
    throw { code: "failedToUpdateCategory", category: error.category };
  }
}

// Method to remove an category from a file
function remove(categoryId) {
  try {
    const filePath = path.join(categoryFolderPath, `${categoryId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveCategory", category: error.category };
  }
}

// Method to list categorys in a folder
function list() {
  try {
    const files = fs.readdirSync(categoryFolderPath);
    const categoryList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(categoryFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    return categoryList;
  } catch (error) {
    throw { code: "failedToListCategorys", category: error.category };
  }
}

// get categoryMap
function getCategoryMap() {
  const categoryMap = {};
  const categoryList = list();
  categoryList.forEach((category) => {
    categoryMap[category.id] = category;
  });
  return categoryMap;
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  getCategoryMap,
};
