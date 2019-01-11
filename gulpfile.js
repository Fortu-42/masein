var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var header = require("gulp-header");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var pkg = require("./package.json");
var autoprefixer = require("gulp-autoprefixer");
var reload = browserSync.reload;

// Compiles SCSS files from /scss into /css
gulp.task("sass", function(done) {
  return gulp
    .src("scss/style.scss")
    .pipe(autoprefixer())
    .pipe(sass())
    .pipe(gulp.dest("css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
  done();
});

// Minify compiled CSS
gulp.task("minify-css", function(done) {
  return gulp
    .src("css/style.css")
    .pipe(
      cleanCSS({
        compatibility: "ie8"
      })
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
  done();
});

// Minify custom JS
gulp.task("minify-js", function(done) {
  return gulp
    .src("js/script.js")
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("js"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
  done();
});

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task("copy", function(done) {
  gulp
    .src([
      "node_modules/bootstrap/dist/**/*",
      "!**/npm.js",
      "!**/bootstrap-theme.*",
      "!**/*.map"
    ])
    .pipe(gulp.dest("vendor/bootstrap"));

  gulp
    .src([
      "node_modules/jquery/dist/jquery.js",
      "node_modules/jquery/dist/jquery.min.js"
    ])
    .pipe(gulp.dest("vendor/jquery"));
  gulp
    .src(["node_modules/magnific-popup/dist/*"])
    .pipe(gulp.dest("vendor/magnific-popup"));

  gulp
    .src(["node_modules/scrollreveal/dist/scrollreveal.min.js"])
    .pipe(gulp.dest("vendor/scrollreveal"));

  gulp
    .src(["node_modules/jquery.easing/*.js"])
    .pipe(gulp.dest("vendor/jquery-easing"));

  gulp
    .src(["node_modules/owl.carousel/*.js"])
    .pipe(gulp.dest("vendor/owlCarousel"));

  gulp
    .src([
      "node_modules/font-awesome/**",
      "!node_modules/font-awesome/**/*.map",
      "!node_modules/font-awesome/.npmignore",
      "!node_modules/font-awesome/*.txt",
      "!node_modules/font-awesome/*.md",
      "!node_modules/font-awesome/*.json"
    ])
    .pipe(gulp.dest("vendor/font-awesome"));

  done();
});

// Default task
gulp.task("default", gulp.series("sass", "minify-css", "minify-js", "copy"));

// Configure the browserSync task
gulp.task("browserSync", function(done) {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
  done();
});

// Dev task with browserSync
gulp.task(
  "dev",
  gulp.series("browserSync", "sass", "minify-css", "minify-js", function(done) {
    gulp.watch("scss/*.scss", gulp.parallel(["sass"]));
    gulp.watch("css/style.css", gulp.parallel(["minify-css"]));
    gulp.watch("js/script.js", gulp.parallel(["minify-js"]));
    // Reloads the browser whenever HTML or JS files change
    gulp.watch("*.html", gulp.parallel(browserSync.reload));
    gulp.watch("js/**/*.js", gulp.parallel(browserSync.reload));
    done();
  })
);
