/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const { GfError } = require('../../gfError');

class GfPreprocessorError extends GfError {};

/**
 * Template preprocessor.
 */
class Preprocessor
{
    /**
     * Name.
     * @member  {string}
     */
    name = null;

    /**
     * Config.
     * @member  {Config}
     */
    config = null;

    /**
     * Constructor.
     * 
     * @param   {string}    name        Preprocessor name.
     * @param   {Config}    config      Configs.
     * 
     * @return  {Preprocessor}
     */
    constructor(name, config)
    {
        this.name = name;
        this.config = config;
    }


    /**
     * Preprocess a string.
     * 
     * @param   {string}    content     Content to preprocess.
     * @param   {string}    permalink   Permalink for post.
     * @param   {string}    filePath    File path.
     * @param   {boolean}   [rss=false] For RSS?
     * 
     * @return  {string}
     */
    preprocessString(content, permalink, filePath, rss = false)
    {
        throw new GfPreprocessorError(`You must override the 'preprocessString' method.`)
    }
 }

module.exports = Preprocessor;