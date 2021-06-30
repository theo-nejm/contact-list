const mongoose = require('mongoose');
const validator = require('validator')

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  number: { type: String, required: false, default: "" },
  creationDate: { type: Date, default: Date.now }
});

const ContactModel = mongoose.model('Contact', ContactSchema);

function Contact(body) {
  this.body = body;
  this.errors = []
  this.contact = null;
} 

Contact.prototype.register = async function() {
  this.validate()

  if(this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body);
}

Contact.prototype.validate = function() {
  this.cleanUp()
  
  // Fields validation
  if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido!')
  if (!this.body.name) this.errors.push('Nome é um campo obrigatório.')
  if (!this.body.email && !this.body.number) this.errors.push('É necessário cadastrar pelo menos o e-mail ou o telefone.')
}

Contact.prototype.cleanUp = function() {
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    name: this.body.contactName,
    surname: this.body.contactSurname,
    email: this.body.contactEmail,
    number: this.body.contactNumber,
  }
}

Contact.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.validate();
  if (this.errors.length > 0) return;
  
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true })
}

// Static methods
Contact.searchById = async function(id) {
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findById(id)
  return contact;
}

Contact.searchContacts = async function() {
  const contacts = await ContactModel.find()
    .sort({ creationDate: -1 })
  return contacts;
}

Contact.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contact = await ContactModel.findOneAndDelete({ _id: id })
    
  return contact;
}

module.exports = Contact;
