
const { Contact } = require("../Validations/contactShema");
const { createNotFoundHttpError } = require("../helpers/index");


async function getAll(req, res, next) {
    const { _id: owner } = req.user;

    const contacts = await Contact.find()

    if (contacts) {
        return res.json({
            data: contacts,
        });
    }
    return next(createNotFoundHttpError());
}

async function getAllUser(req, res, next) {
    const { _id: owner } = req.user;
    
    // const { userId } = req.body;
    

    const contacts = await Contact.find({ owner })
    if (contacts) {
        return res.json({
            data: contacts,
        });
    }
    return next(createNotFoundHttpError());
}


async function create(req, res, next) {
    const { _id: owner, email } = req.user;
    console.log(email);
    const contact = req.body;
    
    const createdContact = await Contact.create({...contact,owner,email});
    if (createdContact) {
        return res.status(201).json({
        data: {
        contacts: createdContact,
        },
    });
    }
}

async function deleteById(req, res, next) {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (contact) {
        await Contact.findByIdAndDelete(id);
        return res.json({ data: { contact } });
    }
    return next(createNotFoundHttpError());
}


async function findOneById(req, res, next) {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
        return next(createNotFoundHttpError());
    }
    return res.json({ data: { contact } });
}


async function updateById(req, res, next) {
    const { id } = req.params;
    const updateContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!updateContact) {
        throw new NotFound(`Contact with id=${id} not found`);
    }
    return res.status(201).json({contact: updateContact});
}

async function updateStatusContact(req, res, next) {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const result = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
    if (!result) {
        throw new NotFound(`Not found`);
    }
    return res.status(200).json({ status: "success", code: 200, data: { result }, });
};

module.exports = {
  getAll,
  getAllUser,
  create,
  deleteById,
  updateById,
  findOneById,
  updateStatusContact
};