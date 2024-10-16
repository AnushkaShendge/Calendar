const mongoose = require('mongoose')
const {Schema} = mongoose

const eventSchema = new mongoose.Schema({
    title: String,
    start: Date,
    end: Date
  });
  
const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel