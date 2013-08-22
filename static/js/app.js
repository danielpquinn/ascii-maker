define([
  'jquery'
], function ($) {

  function App() {};

  var a = App.prototype;

  a.init = function () {
    console.log(this);
    this.setup();
    this.bindEvents();
  }

  a.setup = function () {
    var $e = this.$el = $('#app');
    this.$drop = $e.find('.drop');
  }

  a.bindEvents = function () {
    this.$drop.on('ondragenter', function (e) {
      console.log(e);
    });
  }

  return App;

});