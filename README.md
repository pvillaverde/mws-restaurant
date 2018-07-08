# Mobile Web Specialist Certification Course
---

# Student's notes


## Running using local machine

### Installing

Make sure to install dependencies through:

```sh
npm install
```

### Running
Run gulp. It's default task will create www folder with  production resources

```sh
gulp
```

Run server with npm's http-server. I've had some issues with SimpleHTTPServer and fetch API.
- -p 8000 is port 8000(just as SimpleHTTPServer)
- -g to serve gziped js, css, html
```sh
http-server -p 8000 -g
```

## Built With

* Gulp (Full list on gulp-dependencies on package.json)
* Sass
* [NormalizeCSS](https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css)
* [MaterialIcons](https://material.io/tools/icons/)
