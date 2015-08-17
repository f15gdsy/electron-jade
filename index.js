var app = require('app');
var path = require('path');
var jade = require('jade');
var extend = require('util')._extend;

module.exports = function(jadeOptions, locals) {
  app.on('ready', function() {
    var protocol = require('protocol');
    var options = extend({}, jadeOptions || {});

    protocol.registerProtocol('jade', function(request) {
      var jadeFile = request.url.substr(7);

      if (jadeFile.endsWith('.jade')) {
        var compiled = jade.compileFile(jadeFile, jadeOptions)(locals);

        return new protocol.RequestStringJob({
          mimeType: 'text/html',
          data: compiled
        });
      } else {
        return new protocol.RequestFileJob(jadeFile);
      }
    }, function (error, scheme) {
      if (!error)
        console.log(scheme, ' registered successfully')
    });
  });
};
