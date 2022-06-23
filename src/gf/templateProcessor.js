/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';
const ResourceProcessor = require('./resourceProcessor');
const debug = require("debug")("GreenFedora-Utils:TemplateProcessor");

/**
 * Template processing (base) class.
 */
class TemplateProcessor extends ResourceProcessor
{
    /**
     * Preprocessors.
     * @member  {object[]} 
     */
    preprocessors = [];

    /**
     * Postprocessors.
     * @member  {object[]}
     */
    postprocessors = [];

    /**
     * Constructor.
     * 
     * @param   {Config}    config              Configs.
     * @param   {object}    [options={}]        Options.
     * @param   {object}    [engineOptions={}]  Engine options.
     * 
     * @return  {TemplateProcessor}
     */
    constructor(config, options = {}, engineOptions = {})
    {
        super(config, options, engineOptions);
    }

    /**
     * Add a preprocessor.
     * 
     * @param   {object}    pp      Preprocessor object.
     * 
     * @return  {TemplateProcessor}
     */
    addPreprocessor(pp)
    {
        this.preprocessors.push(pp);
        return this;
    }

    /**
     * Add a postprocessor.
     * 
     * @param   {object}    pp      Preprocessor object.
     * 
     * @return  {TemplateProcessor}
     */
    addPostprocessor(pp)
    {
        this.postprocessors.push(pp);
        return this;
    }

    /**
     * See if the passed string needs compilation.
     * 
     * @param   {string}    str     String to check.
     * @param   {object}    tagOpts Tag options.
     * 
     * @return  {boolean}   
     */
    needsCompliation(str, tagOpts = {})
    {
        let tags = tagOpts;

        let bs = tags.blockStart || "{%";
        let vs = tags.variableStart || "{{";
        let cs = tags.commentStart || "{#";

        for (let chk of [bs, vs, cs]) {
            if (-1 !== str.indexOf(chk)) {
                return true;
            }
        }

        return false;
    }
}

module.exports = TemplateProcessor;