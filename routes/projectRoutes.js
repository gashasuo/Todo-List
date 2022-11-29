const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isProjectOwner, isItemOwner } = require("../middleware");

const Item = require("../models/item");
const Project = require("../models/project");
const User = require("../models/user");
const AppError = require("../utils/AppError");

const projectController = require("../controllers/projectController");
const { getEditProjectForm } = require("../controllers/projectController");
const { postEditProject } = require("../controllers/projectController");
const { getProjectDetails } = require("../controllers/projectController");
const { deleteProject } = require("../controllers/projectController");
const { updateProjectComplete } = require("../controllers/projectController");
const { updateProjectIncomplete } = require("../controllers/projectController");
const {
	updateAllProjectItemsComplete,
} = require("../controllers/projectController");

//show all projects
router.get("/", isLoggedIn, projectController.index);

//create project - get
router.get("/new", isLoggedIn, projectController.getNewProjectForm);

//create project - post
router.post("/", isLoggedIn, projectController.postNewProject);

//edit project - get
router.get("/:id/edit", isLoggedIn, isProjectOwner, getEditProjectForm);

//edit project - put
router.put("/:id", isLoggedIn, isProjectOwner, postEditProject);

//show project details
router.get("/:id", isLoggedIn, isProjectOwner, getProjectDetails);

//delete project
router.delete("/:id", isLoggedIn, isProjectOwner, deleteProject);

//update project as completed - put
router.put("/:id/markComplete", updateProjectComplete);

//update project as not completed - put
router.put("/:id/markIncomplete", updateProjectIncomplete);

//update all project items completed - put
router.put("/:id/markAllitemsComplete", updateAllProjectItemsComplete);

module.exports = router;
