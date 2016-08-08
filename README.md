# Start project html5 sass gulp bower
Quick start frontend project, using:
- Sass (using 7-1 pattern: https://sass-guidelin.es/#architecture)
- Gulp
- Bower

##Default using librares:
- jquery
- normalize css
- bootstrap
- slick carousel

##Quick install:
- bower install
- gulp install

##Gulp tasks:
###gulp dev
When you start development. Copy files from bower folders, to app folder, and inject in html's files, in head section.

####Modules using:
  - inject

###gulp prod
When you end development. Conact and uglify js files, conact and minify css files, and inject in head section.

####Modules using:
  - conact
  - uglify
  - cleanCSS
  - inject

###gulp
When you developing already. Fast reload and compilinig.

####Modules using:
  - sass (build from all sass files, from src/sass folders to app/css)
  - browserSync (run localhot server and refresh, when change sass, js or html files)
  - autoprefixer (auto adding prefixes)

###gulp images
Optimization images in app/img folder, and copy sources files to app/img/src.

####Modules using:
  - imagemin
