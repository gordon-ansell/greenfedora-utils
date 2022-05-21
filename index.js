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

module.exports = {
    Logger,
    syslog,
    GfError,
    GfPath,
    Merge,
    Cache,
    CacheGroup,
    FsUtils,
    EventManager,
    Benchmarks,

    ResourceProcessor,
    AssetProcessor,
    TemplateProcessor,

    NunjucksShortcode
};
