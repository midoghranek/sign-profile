// packages
const { src, dest, watch, parallel, series } = require("gulp");
const connect = require("gulp-connect");
const webp = require("gulp-webp");
const sass = require("gulp-sass");
const rimraf = require("rimraf");
sass.compiler = require("sass");

// compile sass
const compileSass = (done) => {
  src("src/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("src/css"))
    .pipe(connect.reload());
  done();
};

// compile html
const compileHTML = (done) => {
  src("./src/*.html").pipe(connect.reload());
  done();
};

// webp
const image = () => {
  src("src/img/*.png").pipe(webp()).pipe(dest("src/img"));
};

// watch changes
const watchTask = () => {
  watch("src/sass/**/*.scss", compileSass);
  watch("src/*.html", compileHTML);
};

// dev server
const dev = () => {
  connect.server({
    root: ["src"],
    port: 3000,
    livereload: true,
  });
};

const clean = (done) => {
  rimraf("./build", done);
};

// build
const build = (done) => {
  src("src/sass/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(dest("build/css"));
  src("./src/*.html").pipe(dest("build"));
  src("./src/img/*.png").pipe(dest("build/img"));
  src("./src/img/*.svg").pipe(dest("build/img"));
  src("src/img/*.png").pipe(webp()).pipe(dest("build/img"));
  done();
};

// production server [build]
const start = () => {
  connect.server({
    root: ["build"],
    port: 4000,
    livereload: false,
  });
};

// tasks

// 1. gulp dev
exports.dev = parallel(image, watchTask, dev);

// 2. gulp build
exports.build = series(clean, build);

// 3. gulp start
exports.start = start;

// 4. gulp default
exports.default = series(clean, build, start);

// 5. gulp clean
exports.clean = clean;
