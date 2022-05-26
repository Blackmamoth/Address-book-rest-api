const asyncHandler = require("express-async-handler");

const Contact = require("../models/address");
const User = require("../models/user");

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user: req.user.id });
  res.status(201).json(contacts);
});

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
