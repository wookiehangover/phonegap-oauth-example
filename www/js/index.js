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
            alert(data.id);
          }, function(err){
            console.log(err);
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
      var baseUrl = 'http://lvh.me:3000/auth/' + service;
      var ref = window.open(baseUrl, '_blank', 'location=yes,transitionstyle=fliphorizontal');
      var self = this;
      var dfd = new $.Deferred();

      ref.addEventListener('loadstart', function(event) {
        if( event.url !== 'http://lvh.me:3000/' ){
          return;
        }
        ref.close();

        window.addEventListener('message', function(event){
          dfd.resolve(event.data);
          setTimeout(function(){
            $(iframe).remove();
          },0);
        });

        var iframe = document.createElement('iframe');
        iframe.src = 'http://lvh.me:3000/';

        $(iframe).appendTo('body').load(function(){
          iframe.contentWindow.postMessage('authenticate', 'http://lvh.me:3000/');
        });
      });

      setTimeout(function(){
        if( dfd.state() !== 'resolved' ){
          dfd.reject('Authentication timed out after 2 minutes');
        }
      }, 120e3);

      return dfd.promise();
    }
};
