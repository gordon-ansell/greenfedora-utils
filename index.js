/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const { Logger, syslog } = require('./src/logger');
const GfError = require('./src/gfError');
const GfPath = require('./src/gfPath');
const GfString = require('./src/gfString');
const GfRegex = require('./src/gfRegex');
const Merge = require('./src/merge');
const FileCache = require('./src/fileCache');
const FsUtils = require('./src/fsUtils');
const MD5 = require('./src/md5');
const EventManager = require('./src/eventManager');
const Benchmarks = require('./src/benchmarks');
const duration = require('./src/duration');

const ResourceProcessor = require('./src/gf/resourceProcessor');
const AssetProcessor = require('./src/gf/assetProcessor');
const TemplateProcessor = require('./src/gf/templateProcessor');

const NunjucksShortcode = require('./src/gf/template/nunjucksShortcode');
const Preprocessor = require('./src/gf/template/preprocessor');
const Postprocessor = require('./src/gf/template/postprocessor');

const HtmlAttribs = require('./src/html/htmlAttribs');
const HtmlGenerator = require('./src/html/htmlGenerator');
const HtmlFigure = require('./src/html/htmlFigure');
const ComplexImage = require('./src/html/complexImage');


module.exports = {
    Logger,
    syslog,
    GfError,
    GfPath,
    GfString,
    GfRegex,
    Merge,
    FileCache,
    FsUtils,
    MD5,
    EventManager,
    Benchmarks,
    duration,

    ResourceProcessor,
    AssetProcessor,
    TemplateProcessor,

    NunjucksShortcode,
    Preprocessor,
    Postprocessor,

    HtmlAttribs,
    HtmlGenerator,
    HtmlFigure,
    ComplexImage
};
