/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var Shared = __webpack_require__(/*! ./shared */ \"./src/shared.js\");\n\nvar ws = new WebSocket('ws://localhost:8080');\nvar cells = document.querySelectorAll('.cell');\nvar info = document.querySelector('#game-info');\nvar board = document.querySelector('.board');\nvar newGameBtn = document.querySelector('#new-game');\nvar isGameOver = false;\nvar mark = null;\nvar streams = Shared.createStream();\n\nws.onopen = function onopen() {\n  console.log('Conectado');\n  info.textContent = 'Aguardando por jogador...';\n};\n\nws.onclose = function close() {\n  console.log('Desconectado');\n};\n\nws.onerror = function error() {\n  console.log('Não foi possível conectar-se ao servidor');\n  info.textContent = 'Não foi possível conectar-se ao servidor';\n};\n\nws.onmessage = function (message) {\n  var streams = message.data.split(';');\n\n  for (var i = 0; i < streams.length; i++) {\n    var stream = streams[i].split('-');\n\n    switch (parseInt(stream[0])) {\n      case Shared.Events.GAME_START:\n        document.querySelector('#mark').classList.remove('hidden');\n        info.classList.add('text-right');\n        board.classList.remove('hidden');\n        break;\n\n      case Shared.Events.CHANGE_TURN:\n        var value = parseInt(stream[1]);\n\n        if (mark == value) {\n          info.textContent = 'Sua vez!';\n        } else {\n          info.textContent = 'Vez do ' + (value == 1 ? 'X' : 'O');\n        }\n\n        break;\n\n      case Shared.Events.CHANGE_CELL:\n        var values = stream[1].split(',');\n        var cell = parseInt(values[0]);\n        var mark2 = parseInt(values[1]);\n        var cellNode = document.querySelector('#cell-' + cell);\n        cellNode.textContent = mark2 == 1 ? 'X' : 'O';\n        break;\n\n      case Shared.Events.GAME_OVER:\n        info.textContent = (parseInt(stream[1]) == 1 ? 'X' : 'O') + ' venceu!';\n        newGameBtn.classList.remove('hidden');\n        isGameOver = true;\n        break;\n\n      case Shared.Events.GAME_TIED:\n        info.textContent = 'Empate!';\n        isGameOver = true;\n        break;\n\n      case Shared.Events.YOU_ARE:\n        mark = parseInt(stream[1]);\n        document.querySelector('#mark').textContent = \"Voc\\xEA \\xE9 o \".concat(mark == 1 ? 'X' : 'O');\n        break;\n\n      case Shared.Events.WINNER_CELLS:\n        var _cells = stream[1].split(',');\n\n        for (var _i = 0; _i < _cells.length; _i++) {\n          var cellId = _cells[_i];\n          document.querySelector(\"#cell-\".concat(cellId)).classList.add('cell-winner');\n        }\n\n        break;\n\n      default:\n        break;\n    }\n  }\n};\n\nfunction onClickCell(event) {\n  if (ws.readyState == 1 && !isGameOver) {\n    // aberto\n    var cell = event.target.id.split('-');\n    cell.shift();\n    ws.send(streams.build(Shared.Events.CHANGE_CELL, parseInt(cell[0])).output());\n  }\n}\n\nfor (var i = 0; i < cells.length; i++) {\n  var el = cells[i];\n  el.addEventListener('click', onClickCell);\n}\n\nnewGameBtn.addEventListener('click', function (event) {\n  mark = null;\n  isGameOver = false;\n  board.classList.add('hidden');\n  document.querySelector('#mark').classList.add('hidden');\n  info.classList.remove('text-right');\n  info.textContent = 'Aguardando por jogador...';\n  streams.output();\n\n  for (var _i2 = 0; _i2 < 9; _i2++) {\n    var $cell = document.querySelector(\"#cell-\".concat(_i2));\n    $cell.classList.remove('cell-winner');\n    $cell.textContent = '';\n  }\n\n  this.classList.add('hidden');\n  ws.send(streams.build(Shared.Events.FIND_GAME).output());\n});\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ }),

/***/ "./src/shared.js":
/*!***********************!*\
  !*** ./src/shared.js ***!
  \***********************/
/*! exports provided: DataStream, Events, Values */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DataStream\", function() { return DataStream; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Events\", function() { return Events; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Values\", function() { return Values; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar DataStream =\n/*#__PURE__*/\nfunction () {\n  function DataStream() {\n    _classCallCheck(this, DataStream);\n\n    this.streams = [];\n  }\n\n  _createClass(DataStream, [{\n    key: \"build\",\n    value: function build(event, value) {\n      var stream = [];\n      stream.push(event.toString());\n\n      if (value !== undefined) {\n        if (Array.isArray(value)) {\n          stream.push(value.join(','));\n        } else {\n          stream.push(value.toString());\n        }\n      }\n\n      this.streams.push(stream);\n      return this;\n    }\n  }, {\n    key: \"output\",\n    value: function output() {\n      var result = [];\n\n      for (var i = 0; i < this.streams.length; i++) {\n        var stream = this.streams[i];\n        result.push(stream.join('-'));\n      }\n\n      this.streams.splice(0, this.streams.length);\n      return result.join(';');\n    }\n  }]);\n\n  return DataStream;\n}();\nvar Events = {\n  GAME_START: 0,\n  GAME_END: 1,\n  GAME_OVER: 2,\n  GAME_TIED: 3,\n  CHANGE_CELL: 4,\n  YOU_ARE: 5,\n  CHANGE_TURN: 6,\n  WINNER_CELLS: 7,\n  FIND_GAME: 8\n};\nvar Values = {\n  NONE: 0,\n  CROSS: 1,\n  CIRCLE: 2\n};\n\n//# sourceURL=webpack:///./src/shared.js?");

/***/ })

/******/ });