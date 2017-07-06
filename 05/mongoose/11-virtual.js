// Один-ко-многим: Вывод юзера с детьми

const mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/test');

const userSchema = new mongoose.Schema({
  email: {
    type:     String,
    required: 'Укажите email', // true for default message
    unique:   true
  },
  name: String,
  surname: String
});

userSchema.virtual('fullName')
  .get(function() {
    return this.name + ' ' + this.surname
  })
  .set(function(value) {
    [this.name, this.surname] = value.trim().split(/\s+/);
  });

const User = mongoose.model('User', userSchema);

let user = new User({
  name: "Vasya",
  surname: "Petrov"
});
{
  email: ,
  password: ,
}
user.fullName = 'lal lala';
console.log(user.fullName); // Vasya Petrov

user.fullName = "Petya Ivanov";

console.log(user.fullName);
