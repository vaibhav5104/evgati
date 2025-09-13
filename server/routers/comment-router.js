const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment-controller");
const validate = require("../middlewares/validate");
const { createCommentSchema } = require("../validators/comment-validator");

router.post("/", validate(createCommentSchema), commentController.addComment);
router.get("/:stationId", commentController.getStationComments);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
