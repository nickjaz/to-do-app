'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String },
  complete: { type: Boolean, required: true, default: false },
  created: { type: Date, required: true, default: Date.now()},
  startTime: { type: Date },
  alert: { type: Boolean, default: false},
  alertTime: { type: Date },
  location: { type: String },
  priority: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('task', taskSchema);
