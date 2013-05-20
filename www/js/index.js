var app = {
    initialize: function() {
      this.bind();
    },
    bind: function() {
      var _this = this;
      document.addEventListener('deviceready', this.deviceready, false);
      $('.login').on('click', function(e){
        _this.authenticate('instagram')
          .then(function(data){
            console.log(data);
            window.alert('User id: '+ data.id);
          }, function(err){
            window.alert(err);
          });
        return false;
      });
    },
    deviceready: function() {
        // note that this is an event handler so the scope is that of the event
        // so we need to call app.report(), and not this.report()
        app.report('deviceready');
    },
    report: function(id) { 
        console.log("report:" + id);
        // hide the .pending <p> and show the .complete <p>
        document.querySelector('#' + id + ' .pending').className += ' hide';
        var completeElem = document.querySelector('#' + id + ' .complete');
        completeElem.className = completeElem.className.split('hide').join('');
    },
    authenticate: function(service){
      var dfd = new $.Deferred();
      // For the purposes of this demo the auth server is running locally on
      // port 3000
      var baseUrl = 'http://lvh.me:3000/auth/' + service;

      // Open a child browser that navigates to your auth server
      var ref = window.open(baseUrl, '_blank', 'location=yes,transitionstyle=fliphorizontal');

      // Child browsers seem to not want to fire `loadend` events consistently,
      // but the nature of the multiple-redirects involved in oauth access make
      // it so that `loadstart` works just fine
      ref.addEventListener('loadstart', function(event) {
        // Only process the authentication when the child browser returns to
        // your server's redirect uri
        if( event.url !== 'http://lvh.me:3000/' ){
          return;
        }

        // Dismiss the child browser
        ref.close();

        // Set up a postMessage event listener
        window.addEventListener('message', function(event){
          dfd.resolve(event.data);
          // Wait a tick before cleaning up the iframe
          setTimeout(function(){
            $(iframe).remove();
          },0);
        });

        // Make an iframe that loads your auth server. By the magic of shared
        // cookies, this iframe will *already be authenticated* with your auth
        // server, which has JavaScript that will respond to a postMessage
        // event with the user / auth information your app needs.
        var iframe = document.createElement('iframe');
        iframe.src = 'http://lvh.me:3000/';

        $(iframe).appendTo('body').load(function(){
          // Once the iframe is loaded, ping the page with a postMessage. This
          // will respond by triggering the handler we attached above, giving
          // you logged-in access to the server.
          iframe.contentWindow.postMessage(location.href, 'http://lvh.me:3000/');
        });
      });

      // This whole process should timeout after 2 minutes
      setTimeout(function(){
        if( dfd.state() !== 'resolved' ){
          dfd.reject('Authentication timed out after 2 minutes');
        }
      }, 120e3);

      // This *could* very well be done without using promises, but we use them
      // here because this gives this broad compatability with $.ajax
      return dfd.promise();
    }
};
