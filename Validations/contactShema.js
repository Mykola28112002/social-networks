const {Schema,model} = require('mongoose')
const contactSchema = new Schema(
  {
    owner: {
      type: Schema.ObjectId,
      ref: 'users',
    },
    email: String,
    message: String
  }
);

const Contact = model("message", contactSchema)

module.exports = {
  Contact
}
