/**
 * Created by code on 4/28/16.
 */
'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/summoner', require('./api/summoner'));
  app.use('/api/lobby', require('./api/lobby'));
  app.use('/api/dailies', require('./api/dailies'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*', function(req, res) {
    res.redirect('/');
  });
};
