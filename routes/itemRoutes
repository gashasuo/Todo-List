const express = require("express");
const router = express.Router({ mergeParams: true });
const {
	isLoggedIn,
	isProjectOwner,
	isItemOwner,
	checkReturnTo,
} = require("../middleware");

const Item = require("../models/item");
const Project = require("../models/project");
const User = require("../models/user");
const AppError = require("../utils/AppError");

const itemController = require("../controllers/itemController");
const { index } = require("../controllers/itemController");
const { getNewItemForm } = require("../controllers/itemController");
const { postNewItem } = require("../controllers/itemController");
const { getEditItemForm } = require("../controllers/itemController");
const { postEditItem } = require("../controllers/itemController");
const { getItemDetails } = require("../controllers/itemController");
const { deleteItem } = require("../controllers/itemController");
const { updateItemComplete } = require("../controllers/itemController");
const { updateItemIncomplete } = require("../controllers/itemController");

//ITEMS
//show all items
router.get("/", isLoggedIn, index);

//create item - get
router.get("/new", isLoggedIn, getNewItemForm);

//create item - post
router.post("/", isLoggedIn, checkReturnTo, postNewItem);

//edit item - get
router.get("/:id/edit", isLoggedIn, isItemOwner, getEditItemForm);

//edit item - put
router.put("/:id", isLoggedIn, isItemOwner, postEditItem);

//show item detail
router.get("/:id", isLoggedIn, isItemOwner, getItemDetails);

//delete item
router.delete("/:id", isLoggedIn, isItemOwner, deleteItem);

//update item as completed - put
router.put("/:id/markComplete", updateItemComplete);

//update item as not completed - put
router.put("/:id/markIncomplete", updateItemIncomplete);

module.exports = router;
