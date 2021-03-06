define([
  'jquery',
  'lib/asciigenerator',
  'settings',
  'lib/jquery.form'
], function ($, AsciiGenerator, Settings) {

  /**
   * Main application
   * @name App
   * @class App
   * @constructor
   */
  function App() {};

  var a = App.prototype;

  /**
   * @memberOf App
   * @name init
   * @method
   * @return {undefined}
   */
  a.init = function () {
    console.log(this);
    this.setup();
    this.bindEvents();
  }

  /**
   * Caches dom queries and stores jQuery objects on instance
   * @memberOf App
   * @name setup
   * @method
   * @return {undefined}
   */
  a.setup = function () {
    var $e = this.$el = $('#app');
    this.$fileDrop = $e.find('#file-drop');
    this.$imageUploadForm = $e.find('#image-upload');
    this.$messageContainer = $e.find('#message-container');
    this.$message = $e.find('#message');
    this.$image = $e.find('#image');
    this.$output = $e.find('#output');
    this.$textColsInput = $e.find('#text-cols').val(Settings.textCols);
    this.$characterPaletteInput = $e.find('#character-palette').val(Settings.characterPalette);
    this.asciiGenerator = new AsciiGenerator();
  }

  /**
   * Sets up event handlers
   * @memberOf App
   * @name bindEvents
   * @method
   * @return {undefined}
   */
  a.bindEvents = function () {
    var self = this;

    this.$fileDrop.on('dragenter', function () { self.onFileDropDragEnter.apply(self, arguments); });
    this.$fileDrop.on('dragleave', function () { self.onFileDropDragLeave.apply(self, arguments); });
    this.$fileDrop.on('dragover', function () { self.onFileDropDragOver.apply(self, arguments); });
    this.$fileDrop.on('drop', function () { self.cancel.apply(self, arguments); });
    this.$fileDrop.on('drop', function () { self.onFileDropDrop.apply(self, arguments); });
    this.$fileDrop.on('dragend', function () { self.cancel.apply(self, arguments); });
    this.$textColsInput.on('change', function () { self.onTextColsInputChange.apply(self, arguments); });
    this.$characterPaletteInput.on('keyup', function () { self.onCharacterPaletteInputChange.apply(self, arguments); });
    this.$imageUploadForm.on('submit', function () { self.onImageUploadFormSubmit.apply(self, arguments); });
  }
  
  /**
   * Handles changes to "width (incolumns of text)" field
   * @memberOf App
   * @name onTextColsInputChange
   * @method
   * @return {undefined}
   */
  a.onTextColsInputChange = function (e) {
    Settings.textCols = e.target.value;
    this.updateOutput();
  }
  
  /**
   * Handles changes to "Character Palette(Dark to Light)" field
   * @memberOf App
   * @name onCharacterPaletteInputChange
   * @method
   * @return {undefined}
   */
  a.onCharacterPaletteInputChange = function (e) {
    Settings.characterPalette = e.target.value;
    this.updateOutput();
  }
  
  /**
   * Handles drag enter on file-drop area
   * @memberOf App
   * @name onFileDropDragEnter
   * @method
   * @return {undefined}
   */
  a.onFileDropDragEnter = function (e) {
    this.cancel(e);
    this.$fileDrop.addClass('hover');
  }
  
  /**
   * Handles drag leave on file-drop area
   * @memberOf App
   * @name onFileDropDragLeave
   * @method
   * @return {undefined}
   */
  a.onFileDropDragLeave = function (e) {
    this.cancel(e);
    this.$fileDrop.removeClass('hover');
  }
  
  /**
   * Handles drag over event
   * @memberOf App
   * @name onFileDropDragOver
   * @method
   * @return {undefined}
   */
  a.onFileDropDragOver = function (e) {
    this.cancel(e);
  }
  
  /**
   * Handles file being dropped into file drop area
   * @memberOf App
   * @name onFileDropDrop
   * @method
   * @return {undefined}
   */
  a.onFileDropDrop = function (e) {
    var file = e.originalEvent.dataTransfer.files[0],
      src = URL.createObjectURL(file);
    
    this.cancel(e);

    this.setImage(src);
  }
  
  /**
   * Handles file form submission
   * @memberOf App
   * @name onImageUploadFormSubmit
   * @method
   * @return {undefined}
   */
  a.onImageUploadFormSubmit = function (e) {
    var self = this;

    self.cancel(e);

    if(self.$imageUploadForm.find('input').val() === '') {
      self.showMessage('You haven\'t chosen a file yet!', 'error');
      return;
    }

    self.$imageUploadForm.ajaxSubmit({
      error: function (xhr) {
        console.log('error: ' + xhr.status);
      },
      success: function (res) {
        console.log('success');
        self.setImage(res['image-file'].path.replace('static/', ''));
      }
    });
  }
  
  /**
   * Sets current image
   * @memberOf App
   * @name setImage
   * @method
   * @param {string} src Source of the new image
   * @return {undefined}
   */
  a.setImage = function (src) {
    var self = this,
      image = new Image();

    self.$image.css({
      'opacity': 0
    });
    
    image.onload = function () {
      self.resetMessage();
      self.$image.attr('src', src);
      self.$image.animate({
        'opacity': 1
      });
      self.image = image;
      self.updateOutput();
    }

    image.onerror = function (error) {
      console.log(arguments);
    }

    image.src = src;

    this.$fileDrop.removeClass('hover');
  }
  
  /**
   * Updates output field where ascii art is rendered
   * @memberOf App
   * @name updateOutput
   * @method
   * @param {string} src Source of the new image
   * @return {undefined}
   */
  a.updateOutput = function () {
    if (!this.image) {
      return;
    }
    var self = this,
      string = self.asciiGenerator.generateAscii(self.image),
      h = string.match(/\n/g).length * 24;

    self.$output.css({
      height: h + 'px'
    }).text(string);
  }

  a.cancel = function (e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  
  /**
   * Shows a message
   * @memberOf App
   * @name showMessage
   * @method
   * @param {string} message Message to be displayed
   * @param {string} type Message type
   * @return {undefined}
   */
  a.showMessage = function (message, type) {
    var type = type || 'info';
    this.$messageContainer.removeClass();
    this.$messageContainer.addClass('control-group ' + type);
    this.$message.html(message);
  }
  
  /**
   * Resets message area
   * @memberOf App
   * @name resetMessage
   * @method
   * @return {undefined}
   */
  a.resetMessage = function () {
    this.$messageContainer.removeClass();
    this.$message.html(''); 
  }

  return App;

});