const asyncHandler = require("express-async-handler");

const Contact = require("../models/address");

// Controller to get all the contacts of a specific user
// route: /api/contacts
// protected routed
// method: GET
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user: req.user.id });
  res.status(201).json(contacts);
});

// Controller to get a single contact of a specific user
// route: /api/contacts/:id
// protected routed
// method: GET
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(400);
    throw new Error("Contact not found");
  }

  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (contact.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.status(200).json(contact);
});

// Controller to add a contact to an existing list list of contacts for a specific user
// route: /api/contacts
// protected routed
// method: POST
const addContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user: req.user,
  });

  res.status(200).json(contact);
});

// Controller to add a list contact to an existing list of contacts for a specific user
// route: /api/contacts/bulk
// protected routed
// method: POST

const addContacts = asyncHandler(async (req, res) => {
  const contacts = req.body;

  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }

  const bulkContacts = [];

  for (contact of contacts) {
    contact = await Contact.create({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      user: req.user,
    });
    bulkContacts.push(contact);
  }

  res.status(201).json(bulkContacts);
});

// Controller to update a contact from the list of contact for a specific user
// route: /api/contacts/:id
// protected routed
// method: PATCH

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(400);
    throw new Error("Contact not found");
  }

  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (contact.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedContact = await Contact.findOneAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedContact);
});

// Controller to add a contact to the list of contact for a specific user
// route: /api/contacts/:id
// protected routed
// method: DELETE

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (contact.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await contact.remove();

  res.status(200).json(`Contact with id: ${req.params.id} deleted`);
});

module.exports = {
  getContact,
  getContacts,
  addContact,
  updateContact,
  addContacts,
  deleteContact,
};
