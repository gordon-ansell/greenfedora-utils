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
     * Constructor.
     * 
     * @param   {string}        cachePath               Path to the actual cache.
     * @param   {string}        sitePath                Site path.
     * 
     * @return  {FileCache}
     */
    constructor(cachePath, sitePath)
    {
        this.cachePath = cachePath;
        this.sitePath = sitePath;
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
     * 
     * @return  {boolean}           True if file has been modified, else false.
     */
    check(name)
    {
        name = GfPath.addLeadingSlash(name.replace(this.sitePath, ''));
        let filePath = path.join(this.sitePath, name);
        let current = fs.statSync(filePath);

        if (!this.has(name)) {
            debug(`File '${name}' new to cache with values, mtime: ${current.mtimeMs}, size: ${current.size}.`);
            this.add(name, {mtimeMs: current.mtimeMs, size: current.size});
            return true;
        }

        let cached = this.get(name);

        if (current.mtimeMs > cached.mtimeMs || current.size !== cached.size) {
            debug(`File '${name}' has been modified, updating cache, mtime: ${current.mtimeMs}, size: ${current.size}.`);
            this.set(name, {mtimeMs: current.mtimeMs, size: current.size});
            return true;
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
        if (this.has(name)) {
            delete this.data.delete(name);
        }
        return this;
    }
}

module.exports = FileCache;