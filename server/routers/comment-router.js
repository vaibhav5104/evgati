const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment-controller");
const validate = require("../middlewares/validate");
const { createCommentSchema } = require("../validators/comment-validator");
const { authMiddleware } = require("../middlewares/auth-middleware");


router.post("/",authMiddleware, validate(createCommentSchema), commentController.addComment);
router.get("/:stationId", commentController.getStationComments);
router.delete("/:id",authMiddleware, commentController.deleteComment);
// router.put("/:id",authMiddleware, commentController.updateComment)
router.post("/vote/:id",authMiddleware, commentController.voteComment)

module.exports = router;
