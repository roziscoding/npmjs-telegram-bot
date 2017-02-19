const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['babel']);

gulp.task('babel', ['eslint'], () => {
    gulp
        .src('./src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['es2015']
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

gulp.task('eslint', () => {
    gulp
        .src('./src/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
