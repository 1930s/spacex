This repository contains my solution to a coding exercise that is part of the selection process for software engineering interns at [SpaceX](http://spacex.com). The exercise specification calls for a web application that plots NASA ground station coordinates on an interactive map. 

![screenshot](http://i.imgur.com/fx1bb.png "screenshot")

The back end is implemented in [Ruby](http://ruby-lang.org) using the [Sinatra](http://sinatrarb) microframework. The server hosts the static files for the HTML/CSS/JS interface and connects to NASA's SOAP web service to access ground station coordinates. The coordinates are transformed into JSON and asynchronously loaded by the front end interface.

This exercise was completed on Mac OS X 10.7.2 using Ruby MRI 1.9.3 but it should be portable across operating systems and Ruby implementations. 

### Setup instructions
1. [Install Ruby](http://www.ruby-lang.org/en/downloads/), if necessary
2. Install Bundler, if necessary: `gem install bundler`
3. Clone the repository: `git clone git://github.com/dylanvee/spacex.git`
4. Change directory into your clone of the repository
4. Install the dependencies: `bundle install`
5. Start the server: `foreman start`
6. Open [http://localhost:5000](http://localhost:5000) in your browser

I would be happy to host a live demo of the project for a short period of time if that would be more convenient. 

### A note about reverse geocoding
The specification noted that each station's marker image should be a flag icon corresponding to the country in which the station is located. This requires the use of a reverse geocoding service, which translates latitude/longitude coordinates into human-readable addresses. However, I encountered extremely aggressive rate limits when attempting to use the Google Maps reverse geocoding API, so aggressive that I couldn't resolve more than a few coordinate pairs in a minute. I initially wrote the code such that the reverse geocoding calls would take place in parallel on the back end for performance reasons, but even moving these calls to the client-side JavaScript did not mitigate the API restrictions. Therefore, while both my server- and client-side geocoding versions are accessible in the git repository, I have chosen to remove this functionality from the final product. 
