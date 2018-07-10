# Mobile Web Specialist Certification Course
#### _Three Stage Course Material Project - Restaurant Reviews_
#####  [Udacity Mobile Web Specialist Nanodegree](https://www.udacity.com/course/mobile-web-specialist-nanodegree--nd024) ✔️ **Passed on July 9, 2018**

---
# Project Overview

For the Restaurant Reviews projects, you will incrementally convert a static webpage to a mobile-ready web application.

In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

In **Stage Two**, you will take the responsive, accessible design you built in Stage One and connect it to an external server. You’ll begin by using asynchronous JavaScript to request JSON data from the server. You’ll store data received from the server in an offline database using IndexedDB, which will create an app shell architecture. Finally, you’ll work to optimize your site to meet performance benchmarks, which you’ll test using [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

In **Stage Three**, you will take the connected application you yu built in Stage One and Stage Two and add additional functionality. You will add a form to allow users to create their own reviews. If the app is offline, your form will defer updating to the remote database until a connection is established. Finally, you’ll work to optimize your site to meet even stricter performance benchmarks than the previous project, and test again using  [Lighthouse](https://developers.google.com/web/tools/lighthouse/).

# Getting Started

## Prerequisites
- [NodeJS](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/get-npm). Both for dependencies as for running a web server.
- NPM's [http-server](https://www.npmjs.com/package/http-server)
- Development server from [Udacity's GitHub mws-restaurant-stage-3](https://github.com/udacity/mws-restaurant-stage-3)

## Installing
Clone the repository wherever you want using:
```
git clone https://github.com/pvillaverde/mws-restaurant
```
If you with to modify or test anything, you'll need to install its dependencies by running inside the repository.

```sh
npm install
```
## Running
Make sure you have already started the backend server provided by Udacity on port 1333 (default). Then head to the `www` folder to run the web server with http-server:
```sh
http-server -p 8000 -g
```
- -p 8000 is port 8000 (you may use whiever you want)
- -g to serve gziped js, css, html

After it has started, head to your browser on [localhost](http://localhost:8000/). You can then browse throughout the restaurants provided by the backend server, mark them as favorites or post reviews on them. If you are offline, you will see them and as soon as you are back online they'll be send to the backend and stored.

## Built With

- [NormalizeCSS](https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css)
- [MaterialIcons](https://material.io/tools/icons/)
- Gulp (Full list on gulp-dependencies on package.json)
- Sass
- Sweat of warm summer [galifornian](https://www.quobis.com/2013/08/09/come-to-galifornia-galician-california/) days

## Contributing
As it was a personal project for the Nanodegree, it isn't opened for contributing. However, if you think there is some typo, bug or anything remarkable, feel free to reach me :-)

## Authors
Code base was provided by Udacity's  [mws-restaurant-stage-1](https://github.com/hmbeale/mws-restaurant-stage-1) and I've been hard coding JS,CSS HTML on it, as well as refactoring what I thought necessary.

## License
No license

## Acknowledgements
Thanks to google and Udacity for the change of enrolling on this Nanodegree. It's been quite a trip and I've learned quite a lot throught this months. Also special thanks to my code reviewses, who patiently highlight me some mistakes and improvements.
