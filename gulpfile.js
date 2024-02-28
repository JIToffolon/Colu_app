const { series, src, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat')
const paths = {
    js: 'src/js/**/*.js'
}

//utilidades css

const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

//utilidades js

const terser = require('gulp-terser-js');
const rename = require('gulp-rename');


//Funcion que compila SASS

function css() {
    return src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css'))

}

// function minificarcss() {
//     return src('src/scss/app.scss')
//         .pipe(sass({
//             outputStyle: 'compressed'
//         }))
//         .pipe(dest('./build/css'))
// }

function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('./build/js'))
}

function watchArchivos() {

    watch('src/scss/**/*.scss', css);
    watch(paths.js, javascript) // *= la carpeta actual // **= todos los archivos con esa extension
}


exports.css = css;
// exports.minificarcss = minificarcss;
exports.watchArchivos = watchArchivos;

exports.default = series(css, javascript, watchArchivos);