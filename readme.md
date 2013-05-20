# Phonegap OAuth Example Application

This is a simple example of how to authenticate with an oauth service
via your own server from a Phonegap application.

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


