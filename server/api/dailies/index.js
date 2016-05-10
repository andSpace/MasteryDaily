/**
 * Created by code on 5/3/16.
 */
var express = require('express');
var controller = require('./dailies.controller');

var router = express.Router();

router.get('/', controller.index);
//router.get('/:id', controller.show);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
