/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const GfError = require('../../gfError');

class GfPostprocessorError extends GfError {};

/**
 * Template postprocessor.
 */
class Postprocessor
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
     * @return  {Postprocessor}
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
     * @param   {string}    filePath    File path.
     * @param   {boolean}   [rss=false] For RSS?
     * 
     * @return  {string}
     */
    postprocessString(content, filePath, rss = false)
    {
        throw new GfPostprocessorError(`You must override the 'postprocessString' method.`)
    }
 }

module.exports = Postprocessor;