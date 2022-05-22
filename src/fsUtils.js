/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const GfError = require('./gfError');
const GfRegex = require('./gfRegex');

/**
 * File system utilities.
 */
class FsUtils
{
    /**
     * Make a directory recursively.
     * 
     * @param   {string}    dir     Directory to make.
     * 
     * @return  {void}
     */
    static mkDirRecurse(path)
    {
        fs.mkdirSync(path, { recursive: true })
    }

    /**
     * Make a directory recursively (async version).
     * 
     * @param   {string}    dir     Directory to make.
     * 
     * @return  {Promise}
     */
    static async mkDirRecurseAsync(path)
    {
        return fs.mkdir(path, { recursive: true })
    }

    /**
     * Delete a folder recursively.
     * 
     * @param   {string}    dir     Directory to clean.
     * @param   {boolean}   force   Force?
     * 
     * @return  {boolean}           True if it worked else false.              
     */
    static deleteFolderRecursive(dir, force = true)
    {
        let rmdOpts = {recursive: true, maxRetries: 5, force: force};

        try {
            if (fs.existsSync(dir)) {
                fs.readdirSync(dir).forEach((file) => {
                    const curPath = path.join(dir, file);
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        FsUtils.deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmSync(dir, rmdOpts);
            }
        } catch (err) {
            throw new GfError("Error in deleteFolderRecursive: " + err.message, '', err);
        }
        return true;
    }
 
    /**
     * Clean a directory.
     * 
     * @param   {string}    dir     Directory to clean.
     * @param   {string}    qual    Qualifier.
     * 
     * @return  {boolean}           True if we cleaned it, else false.
     */
    static cleanDir(dir, qual = '*')
    {
        if (fs.existsSync(dir)) {
            rimraf.sync(path.join(dir, qual));
            return true;
        }
        return false;
    }

    /**
     * Copy a directory.
     * 
     * @param   {string}    from    Directory to copy from.
     * @param   {string}    to      Directory to copy to.
     * @param   {object}    opts    Options.   
     */
    static copyDir(from, to, opts = {fileNotBeginsWith: ['.']})
    {
        if (!fs.existsSync(from)) {
            syslog.warning("Directory does not exist for copy (although this might be ignorable).", from);
            return;
        }

        let fnbwRegex = null;

        if (opts.fileNotBeginsWith) {
            let ap = GfRegex.sanitizeFileRegex(opts.fileNotBeginsWith);
            if (ap != '') {
                fnbwRegex = new RegExp("^(" + ap + ")", 'i');
            }
        }
        
        let fneRegex = null;

        if (opts.fileNotExt) {
            let ap = GfRegex.sanitizeExtRegex(opts.fileNotExt);
            if (ap != '') {
                fneRegex = new RegExp("^(" + ap + ")", 'i');
            }
        }

        let entries = fs.readdirSync(from);

        entries.forEach((entry) => {


            let fromPath = path.join(from, entry);
            let toPath = path.join(to, entry);
            let stats = fs.statSync(fromPath);
            
            let go = true;
            if (stats.isFile() && fnbwRegex != null) {
                if (null !== fnbwRegex.exec(path.basename(fromPath))) {
                    go = false;
                }
            }

            if (stats.isFile() && path.extname(fromPath) && fneRegex != null) {
                if (null !== fneRegex.exec(path.extname(fromPath))) {
                    go = false;
                }
            }

            if (go) {
            
                if (stats.isFile()) {
                    FsUtils.copyFile(fromPath, toPath);
                } else if (stats.isDirectory()) {
                    FsUtils.copyDir(fromPath, toPath, opts);
                }
            
            }

        });
    }

    /**
     * Copy a directory (async).
     * 
     * @param   {string}    from    Directory to copy from.
     * @param   {string}    to      Directory to copy to.
     * @param   {object}    opts    Options.   
     */
    static async copyDirAsync(from, to, opts = {fileNotBeginsWith: ['.']})
    {
        if (!fs.existsSync(from)) {
            syslog.warning("Directory does not exist for async copy (although this might be ignorable).", from);
            return;
        }

        let fnbwRegex = null;

        if (opts.fileNotBeginsWith) {
            let ap = GfRegex.sanitizeFileRegex(opts.fileNotBeginsWith);
            if (ap != '') {
                fnbwRegex = new RegExp("^(" + ap + ")", 'i');
            }
        }
        
        let fneRegex = null;

        if (opts.fileNotExt) {
            let ap = GfRegex.sanitizeExtRegex(opts.fileNotExt);
            if (ap != '') {
                fneRegex = new RegExp("^(" + ap + ")", 'i');
            }
        }

        let entries = fs.readdirSync(from);

        await Promise.all(entries.map(async entry => {

            let fromPath = path.join(from, entry);
            let toPath = path.join(to, entry);
            let stats = fs.statSync(fromPath);
            
            let go = true;
            if (stats.isFile() && fnbwRegex != null) {
                if (null !== fnbwRegex.exec(path.basename(fromPath))) {
                    go = false;
                }
            }

            if (stats.isFile() && path.extname(fromPath) && fneRegex != null) {
                if (null !== fneRegex.exec(path.extname(fromPath))) {
                    go = false;
                }
            }

            if (go) {
            
                if (stats.isFile()) {
                    FsUtils.copyFileAsync(fromPath, toPath);
                } else if (stats.isDirectory()) {
                    FsUtils,copyDirAsync(fromPath, toPath, opts);
                }
            
            }

        }));
    }
 

    /**
     * Copy a file.
     * 
     * @param   {string}    from        From file.
     * @param   {string}    to          To file.
     * @param   {number}    mode        Mode for creating directories along the way.
     */
    static copyFile(from, to, mode = 0o777) 
    {
        FsUtils.mkDirRecurse(path.dirname(to), mode);
        if (fs.existsSync(path.dirname(to))) {
            try {
                fs.copyFileSync(from, to);
            } catch (err) {
                throw new GfError(`Could not copy to ${to}\\n${err}`, '', err);
            }
        } else {
            throw new GfError(`Cannot copy file to ${to} because directory does not exist.`);
        }
    }

    /**
     * Copy a file (async).
     * 
     * @param   {string}    from        From file.
     * @param   {string}    to          To file.
     * @param   {number}    mode        Mode for creating directories along the way.
     */
    static async copyFileAsync(from, to, mode = 0o777) 
    {
        await FsUtils.mkDirRecurseAsync(path.dirname(to), mode);
        if (fs.existsSync(path.dirname(to))) {
            try {
                fs.copyFileSync(from, to);
            } catch (err) {
                throw new GfError(`Could not copy to ${to}\\n${err}`, '', err);
            }
        } else {
            throw new GfError(`Cannot copy file to ${to} because directory does not exist.`);
        }
    }
}

module.exports = FsUtils;