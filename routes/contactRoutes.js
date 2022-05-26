const router = require("express").Router();
const {
  getContact,
  getContacts,
  addContact,
  updateContact,
  addContacts,
  deleteContact,
} = require("../controllers/contactsController");
const { protectedRoute } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protectedRoute, getContacts)
  .post(protectedRoute, addContact);

router
  .route("/:id")
  .get(protectedRoute, getContact)
  .patch(protectedRoute, updateContact)
  .delete(protectedRoute, deleteContact);

router.route("/bulk").post(protectedRoute, addContacts);

module.exports = router;
