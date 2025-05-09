const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const trackerFolderPath = path.join(
  __dirname,
  "storage",
  "trackerList"
);

// Method to read an tracker from a file
function get(trackerId) {
  try {
    const filePath = path.join(trackerFolderPath, `${trackerId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadTracker", message: error.message };
  }
}

// Method to write an tracker to a file
function create(tracker) {
  try {
    tracker.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(trackerFolderPath, `${tracker.id}.json`);
    const fileData = JSON.stringify(tracker);
    fs.writeFileSync(filePath, fileData, "utf8");
    return tracker;
  } catch (error) {
    throw { code: "failedToCreateTracker", message: error.message };
  }
}

// Method to update tracker in a file
function update(tracker) {
  try {
    const currentTracker = get(tracker.id);
    if (!currentTracker) return null;
    const newTracker = { ...currentTracker, ...tracker };
    const filePath = path.join(trackerFolderPath, `${tracker.id}.json`);
    const fileData = JSON.stringify(newTracker);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newTracker;
  } catch (error) {
    throw { code: "failedToUpdateTracker", message: error.message };
  }
}

// Method to remove an tracker from a file
function remove(trackerId) {
  try {
    const filePath = path.join(trackerFolderPath, `${trackerId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveTracker", message: error.message };
  }
}

// Method to list tracker in a folder
function list(filter = {}) {
  try {
    const files = fs.readdirSync(trackerFolderPath);
    let trackerList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(trackerFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    const filterDate = filter.date
      ? new Date(filter.date).getMonth()
      : new Date().getMonth();
    trackerList = trackerList.filter(
      (item) => new Date(item.date).getMonth() === filterDate
    );
    trackerList.sort((a, b) => new Date(a.date) - new Date(b.date));

    return trackerList;
  } catch (error) {
    throw { code: "failedToListTracker", message: error.message };
  }
}

// Method to list tracker by categoryId
function listByCategoryId(categoryId) {
  const trackerList = list();
  return trackerList.filter((item) => item.categoryId === categoryId);
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  listByCategoryId,
};