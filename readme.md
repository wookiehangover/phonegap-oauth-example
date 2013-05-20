# Phonegap OAuth Example Application

This is a simple example of how to authenticate with an oauth service
via your own server from a Phonegap application.

tl;dr - take a look at `www/js/index.js` and `views/index.ejs` to see
the gist of what's going on here--passing back user information from an
auth server to a phonegap client using HTML5 postMessage.

## Setup

To get started, run

    make install

Which will install the cordova build tool (globally, watch out) and the
npm dependencies for the auth server.

To use this demo, you'll need to create an application with an oauth 2
providor that works with [authom](https://github.com/jed/authom), such
as [Instagram](http://instagram.com/developer/clients/register/).

Run the node server with

    instagram_id=xxxx instagram_secret=xxxx node server

Where `instagram_id` and `instagram_secret` are oauth credentials. Once
the server's running, build and run a client through the simulator.

    cordova platform add ios
    cordova build ios
    cordova simulate ios

Or open the Xcode project that's located in
`platforms/ios/HelloCordova.xcodeproj` if you're interested in seeing
the actual console output from the app.

Once the simulator is running, click the "login" link on the homepage
and you'll be logged into the application server using oauth 2, and
passing that information back to your phonegap app.

## Next Steps

First off, a note about security: this should only be done over https in
production environments. If you're feeling paranoid, you should hash the
data with a secret that's shared by the phonegap client app and the
server--but you'd still be vulnerable to someone picking apart the app
to get at it if they really wanted to since it would have to be
implemented in JavaScript (or a cordova plugin if you got really fancy
and platform-specific.)

Keep in mind that this is exposing logged in user information with
JavaScript, so at a minimum you should think about keeping the iframe
url relatively obscure, explicitly filtering out non-file protocol
iframe loads or use a querystring parameter that would be known only to
the client and the server and filter based on that (hell, you could even
implement oauth 2 on the signing server too.)

The next step is to take the auth token that's being passed back from
the auth server and embed it into outgoing requests. This can usually be
done with a querystring or Authorization header by way of an
`auth_token` (for instance, using omniauth in Ruby this works
out-of-the-box.)



