System.register([], function (_export, _context) {
  "use strict";

  var _createClass, App;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('App', App = function () {
        function App() {
          _classCallCheck(this, App);

          this.list = [{ name: 'first', value: 1 }, { name: 'second', value: 2 }, { name: 'third', value: 3 }, { name: 'fourth', value: 4 }];
        }

        App.prototype.dragstart = function dragstart(_ref, item) {
          var event = _ref.detail;

          var breakpoints = this.getBreakpoints(event.target.parentElement);
          var offset = event.target.offsetTop - event.target.parentElement.offsetTop;
          event.interaction.data = { item: item, breakpoints: breakpoints, offset: offset };
          event.target.classList.add('is-dragging');
        };

        App.prototype.dragend = function dragend(_ref2) {
          var event = _ref2.detail;

          event.target.classList.remove('is-dragging');
        };

        App.prototype.drag = function drag(_ref3) {
          var event = _ref3.detail;

          var breakpoints = event.interaction.data.breakpoints;
          var position = event.clientY - event.clientY0 + event.interaction.data.offset;
          var index = breakpoints.findIndex(function (breakpoint) {
            return breakpoint > position;
          });
          if (index > -1) {
            this.moveElementToIndex(event.target, index);
          }
        };

        App.prototype.drop = function drop(_ref4) {
          var event = _ref4.detail;

          var item = event.interaction.data.item;
          var element = event.dragEvent.target;

          var newIndex = Array.from(event.target.children).indexOf(element);
          var currentIndex = this.list.indexOf(item);
          if (currentIndex !== newIndex) {
            this.list.splice(currentIndex, 1);
            this.list.splice(newIndex, 0, item);
          }
        };

        App.prototype.getBreakpoints = function getBreakpoints(parent) {
          var breakpoints = [];
          var children = Array.from(parent.children);
          children.forEach(function (child) {
            breakpoints.push(child.offsetTop - parent.offsetTop + child.offsetHeight / 2);
          });
          return breakpoints;
        };

        App.prototype.moveElementToIndex = function moveElementToIndex(element, index) {
          var parent = element.parentElement;
          var currentIndex = Array.from(parent.children).indexOf(element);
          var currentOffset = element.offsetTop;

          if (index === currentIndex) {
            return;
          }

          parent.removeChild(element);
          if (index > parent.children.length) {
            parent.append(element);
          } else {
            var sibling = parent.children[index];
            parent.insertBefore(element, sibling);
          }
        };

        _createClass(App, [{
          key: 'json',
          get: function get() {
            return JSON.stringify(this.list, null, 2);
          }
        }]);

        return App;
      }());

      _export('App', App);
    }
  };
});
//# sourceMappingURL=app.js.map
