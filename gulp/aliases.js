/**
 * @Author: Pablo Villaverde Castro <systems>
 * @Date:   2018-03-14
 * @Email:  pvillaverde@qualigy.com
 * @Last modified by:   systems
 * @Last modified time: 2018-04-13
 * @Copyright: Qualigy Solutions Innovation, https://qualigy.com
 */

/* eslint-env node */
var gulp = require(`gulp`);

/*gulp.task(`010_changeOrganization`, [`changeOrganization`]);*/
gulp.task(`020_dev-watch`, [`dev-watch`]);
gulp.task(`030_build`, [`build`]);
gulp.task(`040_clean`, [`clean`]);