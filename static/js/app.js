define([
  'jquery',
  'lib/asciigenerator',
  'settings'
], function ($, AsciiGenerator, Settings) {

  function App() {};

  var a = App.prototype;

  a.init = function () {
    console.log(this);
    this.setup();
    this.bindEvents();
  }

  a.setup = function () {
    var $e = this.$el = $('#app');
    this.$fileDrop = $e.find('#file-drop');
    this.$messageContainer = $e.find('#message-container');
    this.$message = $e.find('#message');
    this.$image = $e.find('#image');
    this.$output = $e.find('#output');
    this.$textColsInput = $e.find('#text-cols').val(Settings.textCols);
    this.asciiGenerator = new AsciiGenerator();
  }

  a.bindEvents = function () {
    var self = this;

    this.$fileDrop.on('dragenter', function () { self.onFileDropDragEnter.apply(self, arguments); });
    this.$fileDrop.on('dragleave', function () { self.onFileDropDragLeave.apply(self, arguments); });
    this.$fileDrop.on('dragover', function () { self.onFileDropDragOver.apply(self, arguments); });
    this.$fileDrop.on('drop', function () { self.cancel.apply(self, arguments); });
    this.$fileDrop.on('drop', function () { self.onFileDropDrop.apply(self, arguments); });
    this.$fileDrop.on('dragend', function () { self.cancel.apply(self, arguments); });
    this.$textColsInput.on('change', function () { self.onTextColsInputChange.apply(self, arguments); });
  }

  a.onTextColsInputChange = function (e) {
    Settings.textCols = e.target.value;
  }

  a.onFileDropDragEnter = function (e) {
    this.cancel(e);
    this.$fileDrop.addClass('hover');
  }

  a.onFileDropDragLeave = function (e) {
    this.cancel(e);
    this.$fileDrop.removeClass('hover');
  }

  a.onFileDropDragOver = function (e) {
    this.cancel(e);
  }

  a.onFileDropDrop = function (e) {
    var self = this,
      file = e.originalEvent.dataTransfer.files[0],
      src = URL.createObjectURL(file),
      image = new Image();
    
    self.cancel(e);
    self.$image.css({
      'opacity': 0
    });
    
    image.onload = function () {
      var string = self.asciiGenerator.generateAscii(image),
        stringArray = string.split(''),
        outputString = '',
        i = 0,
        h = string.match(/\n/g).length * 24;

      self.$output.css({
        height: h + 'px'
      });
      self.$image.animate({
        'opacity': 1
      });

      function addToString() {
        outputString += stringArray[i];
        outputString += stringArray[i + 1];
        outputString += stringArray[i + 2];
        self.$output.text(outputString);
        if (i < stringArray.length - 3) {
          i += 3;
          setTimeout(addToString, 1);
        }
      }

      addToString();
    }

    image.src = src;

    self.$image.attr('src', src);
    this.$fileDrop.removeClass('hover');
  }

  a.cancel = function (e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  a.showMessage = function (message, type) {
    var type = type || 'info';
    this.$messageContainer.removeClass();
    this.$messageContainer.addClass('control-group ' + type);
    this.$message.html(message);
  }

  return App;

});