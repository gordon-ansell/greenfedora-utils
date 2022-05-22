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
const Cache = require('./src/cache');
const CacheGroup = require('./src/cacheGroup');
const FsUtils = require('./src/fsUtils');
const EventManager = require('./src/eventManager');
const Benchmarks = require('./src/benchmarks');

const ResourceProcessor = require('./src/gf/resourceProcessor');
const AssetProcessor = require('./src/gf/assetProcessor');
const TemplateProcessor = require('./src/gf/templateProcessor');

const NunjucksShortcode = require('./src/gf/template/nunjucksShortcode');

const HtmlAttribs = require('./src/html/htmlAttribs');
const HtmlGenerator = require('./src/html/htmlGenerator');
const HtmlFigure = require('./src/html/htmlFigure');
const ComplexImage = require('./src/html/ComplexImage');


module.exports = {
    Logger,
    syslog,
    GfError,
    GfPath,
    GfString,
    GfRegex,
    Merge,
    Cache,
    CacheGroup,
    FsUtils,
    EventManager,
    Benchmarks,

    ResourceProcessor,
    AssetProcessor,
    TemplateProcessor,

    NunjucksShortcode,

    HtmlAttribs,
    HtmlGenerator,
    HtmlFigure,
    ComplexImage
};
