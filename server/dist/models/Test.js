"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
  function User(sequelize) {
    _classCallCheck(this, User);

    this.User = sequelize.define('user', {
      firstName: {
        type: _sequelize2.default.STRING
      },
      lastName: {
        type: _sequelize2.default.STRING
      }
    });
    this.sync();
  }

  _createClass(User, [{
    key: 'sync',
    value: function sync() {
      var _this = this;

      this.User.sync({ force: true }).then(function () {
        // Table created
        return _this.User.create({
          firstName: 'John',
          lastName: 'Hancock'
        });
      });
    }
  }]);

  return User;
}();

module.exports = User;