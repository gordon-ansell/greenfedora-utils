/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const FsUtils = require('./fsUtils');
const GfError = require('./gfError');
const GfPath = require('./gfPath');
const { syslog } = require('./logger');
const MD5 = require('./md5');
const debug = require("debug")("GreenFedora-Util:FileCache");

// Local error.
class GfFileCacheError extends GfError {};

/**
 * File cache.
 */
class FileCache
{
    /**
     * Cache path.
     * @member  {string}
     */
    cachePath = null;

    /**
     * Site path.
     * @member  {string}
     */
    sitePath = null;

    /**
     * The cache data.
     * @member  {Map}
     */
    data = {};

    /**
     * Check type.
     * @member  {string}
     */
    checkType = 'stats';

    /**
     * Constructor.
     * 
     * @param   {string}        cachePath               Path to the actual cache.
     * @param   {string}        sitePath                Site path.
     * @param   {string}        checkType               Type to check.
     * 
     * @return  {FileCache}
     */
    constructor(cachePath, sitePath, checkType = 'stats')
    {
        this.cachePath = cachePath;
        this.sitePath = sitePath;
        this.checkType = checkType;
        this.data = new Map();
    }

    /**
     * Load a cache from disk.
     * 
     * @return  {FileCache}
     */
    load()
    {
        if (!fs.existsSync(this.cachePath)) {
            debug(`No saved file cache found at ${this.cachePath}. This may be okay, but just saying.`);
            this.data = new Map();
        } else {
            debug(`Loading file cache from ${this.cachePath}.`);
            let serialised = fs.readFileSync(this.cachePath, 'utf8');
            this.data = new Map(JSON.parse(serialised));
        }
        return this;
    }

    /**
     * Save a cache to disk.
     * 
     * @return  {void}
     */
    save()
    {
        if (!fs.existsSync(path.dirname(this.cachePath))) {
            fs.mkdirSync(path.dirname(this.cachePath), {recurse: true});
            let serialised = JSON.stringify(Array.from(this.data.entries()));
            fs.writeFileSync(this.cachePath, serialised, 'utf8');
        } else {
            let serialised = JSON.stringify(Array.from(this.data.entries()));
            fs.writeFileSync(this.cachePath, serialised, 'utf8');
        }
    }

    /**
     * Run a cache check.
     * 
     * @param   {string}    name    Name to run it against.
     * @param   {boolean}   autoup  Auto update?
     * 
     * @return  {boolean}           True if file has been modified, else false.
     */
    check(name, autoup = true)
    {
        name = GfPath.addLeadingSlash(name.replace(this.sitePath, ''));
        let filePath = path.join(this.sitePath, name);
        let current = fs.statSync(filePath);

        if ('stats' === this.checkType) {

            if (!this.has(name)) {
                debug(`File '${name}' new to cache with values, mtime: ${current.mtimeMs}, size: ${current.size}.`);
                if (autoup) {
                    this.add(name, {mtimeMs: current.mtimeMs, size: current.size});
                }
                return true;
            }

            let cached = this.get(name);

            if (current.mtimeMs > cached.mtimeMs || current.size !== cached.size) {
                debug(`File '${name}' has been modified, updating cache, mtime: ${current.mtimeMs}, size: ${current.size}.`);
                if (autoup) {
                    this.set(name, {mtimeMs: current.mtimeMs, size: current.size});
                }
                return true;
            }

        } else if ('statsdata' === this.checkType) {

            if (!this.has(name)) {
                debug(`File '${name}' new to cache with values, mtime: ${current.mtimeMs}, size: ${current.size}.`);
                return true;
            }

            let cached = this.get(name);

            if (current.mtimeMs > cached.mtimeMs || current.size !== cached.size) {
                debug(`File '${name}' has been modified, updating cache, mtime: ${current.mtimeMs}, size: ${current.size}.`);
                return true;
            }

        } else if ('md5' === this.checkType) {

            let md5 = (new MD5).md5(fs.readFileSync(filePath, 'utf-8'));

            if (!this.has(name)) {
                debug(`File '${name}' new to cache with values, size: ${current.size}, md5: ${md5}.`);
                this.add(name, {md5: md5, size: current.size});
                return true;
            }

            let cached = this.get(name);

            if (md5 !== cached.md5 || current.size !== cached.size) {
                debug(`File '${name}' has been modified, updating cache, size: ${current.size}, md5: ${md5}.`);
                this.set(name, {md5: md5, size: current.size});
                return true;
            }
         
        } else {
            throw new GfFileCacheError(`Invalid cache check type ${this.checkType}.`);          
        }

        debug(`File ${name} is cached but has not been modified.`);

        return false;
    }

    /**
     * See if we have an item.
     * 
     * @param   {any}       name    Name of item.
     * 
     * @return  {boolean}
     */
    has(name)
    {
        name = GfPath.addLeadingSlash(name.replace(this.sitePath, ''));
        return this.data.has(name);
    }

    /**
     * Get some data for a given name.
     * 
     * @param   {string}    name        Name of item to get.
     * 
     * @return  {any}                   Item data or null.
     */
    get(name)
    {
        name = GfPath.addLeadingSlash(name.replace(this.sitePath, ''));
        if (this.has(name)) {
            return this.data.get(name);
        }
        return null;
    }

    /**
     * Set some data.
     * 
     * @param   {string}    name        Name of item to set.
     * @param   {any}       val         Data value.
     * 
     * @return  {CacheGroup}
     */
    set(name, val)
    {
        name = GfPath.addLeadingSlash(name.replace(this.sitePath, ''));
        this.data.set(name, val);
        return this;
    }

    /**
     * Add some data.
     * 
     * @param   {string}    name        Name of item to add.
     * @param   {any}       val         Data value.
     * 
     * @return  {CacheGroup}
     * 
     * @throws  {GfCacheGroupError}     On errors.
     */
    add(name, val)
    {
        name = GfPath.addLeadingSlash(name.replace(this.sitePath, ''));
        if (this.has(name)) {
            throw new GfFileCacheError(`We already have a cache item called '${name}'. Maybe use 'set' instead?`);
        }
        return this.set(name, val);
    }

    /**
     * Delete some data.
     * 
     * @param   {string}    name        Name of item to delete.
     * 
     * @return  {CacheGroup}
     * 
     * @throws  {GfCacheGroupError}     On errors.
     */
    del(name)
    {
        name = GfPath.addLeadingSlash(name.replace(this.sitePath, ''));
        if (this.has(name)) {
            delete this.data.delete(name);
        }
        return this;
    }
}

module.exports = FileCache;