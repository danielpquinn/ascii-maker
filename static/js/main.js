require.config({
  paths: {
    'jquery': 'components/jquery/jquery'
  }
});

require([
  'app'
], function(App) {

  var app = new App();

  $(function () {
    app.init();
  });

});