var gulp = require("gulp")
/* var fs = require("fs") */
var plugins = require("gulp-load-plugins")()
const argv = require("yargs").argv

const env = process.env.NODE_ENV
const app_key = {
  develop: "121282fed01baaebf0433fb3ea8a9b95",
  production: "442eede02179d279dd26d2141592e071"
}

const scss_key = {
  develop: "/dev",
  production: "/pro"
}

/* 修改阿拉丁key */
gulp.task("conf", function(next) {
  gulp
    .src("./utils/ald-stat-conf.js")
    .pipe(plugins.replace(/\"[a-z|0-9]*\"/, '"' + app_key[env] + '"'))
    .pipe(gulp.dest("./utils"))
    .on("finish", next)
})
/* 修改scss变量 */
gulp.task("scssVar", function(next) {
  gulp
    .src("./variables.scss")
    .pipe(plugins.replace(/(\/dev|\/pro)/, scss_key[env]))
    .pipe(gulp.dest("./"))
    .on("finish", next)
})

gulp.task(
  "scss",
  gulp.series("scssVar", function(next) {
    gulp
      .src(["./app.scss", "./pages/**/*.scss"], { base: "." })
      .pipe(plugins.sass())
      .pipe(
        plugins.rename({
          extname: ".wxss"
        })
      )
      .pipe(gulp.dest("."))
      .on("finish", next)
  })
)
/* 修改环境变量配置项 */
gulp.task(
  "environment",
  gulp.parallel("conf", "scss", function(next) {
    console.log(env)
    gulp
      .src("./config.js")
      .pipe(
        plugins.preprocess({
          context: {
            NODE_ENV: env
          }
        })
      )
      .pipe(plugins.rename("store.js"))
      .pipe(gulp.dest("./"))
      .on("finish", next)
  })
)
