const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat', { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true)