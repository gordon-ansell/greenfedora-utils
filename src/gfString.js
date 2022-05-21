/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const path = require('path');
const lodashset = require("lodash/set");
const normalize = require('normalize-path');
const GfError = require('./gfError');

// Local error.
class GfStringError extends GfError {};

/**
 * String utilities.
 */
class GfString
{
    /**
    * Convert tabs to spaces.
    * 
    * @param   {string}    str         Target string.
    * @param   {number}    spaceNum    Number of spaces.
    * 
    * @return  {string}                Ourself.
    */
    static tabsToSpaces(str, spaceNum = 2)
    {
        let spaces = ' '.repeat(spaceNum);
        const reg = new RegExp('\t', 'g')
        return str.replace(reg, spaces);
    }

    /**
     * Count the words in a string.
     * 
     * @param   {string}    str         Target string.
     * 
     * @return  {number}                Number of words.
     */
    static countWords(str)
    {
        if (!str) {
            return 0;
        }
        let s = str.replace(/(^\s*)|(\s*$)/gi, "");      // Exclude  start and end white-space.
        s = s.replace(/[ ]{2,}/gi, " ");                 // 2 or more spaces to 1.
        s = s.replace(/\n /, "\n");                      // Exclude newline with a start spacing.
        return s.split(' ').filter(function (str) { return str != ""; }).length;
    }

    /**
     * Upper case words.
     * 
     * @param   {string}    str         Target string.
     * 
     * @return  {string}                Processed string.
     */
    static ucwords(str)
    {
        let ret = str.replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
            function (letter)
            {
                return letter.toUpperCase();
            });
        return ret;
    }

    /**
     * Upper case first letter.
     * 
     * @param   {string}    str         Target string.
     * 
     * @return  {string}                Processed string.
     */
    static ucfirst(str)
    {
        return String(str).charAt(0).toUpperCase() + String(str).slice(1);
    }

    /**
     * Lower case first letter.
     * 
     * @param   {string}    str         Target string.
     * 
     * @return  {string}                Processed string.
     */
    static lcfirst(str)
    {
        return String(str).charAt(0).toLowerCase() + String(str).slice(1);
    }

    /**
     * Replace all of one character with another.
     * 
     * @param   {string}    str     Target string.
     * @param   {string}    search  Character to search for.
     * @param   {string}    rep     Character to replace with.
     * 
     * @return  {string}            Processed string.
     */
    static replaceAll(str, search, rep)
    {
        return str.split(search).join(rep);
    }

    /**
     * Slugify.
     * 
     * @param   {string}    str     Target string.
     * @param   {object}    opts    Options.
     * 
     * @return  {string}            Output string.
     */
    static slugify(str, opts = { replacement: '-', lower: true, strict: true })
    {
        let charMap = JSON.parse('{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","¢":"cent","£":"pound","¤":"currency","¥":"yen","©":"(c)","ª":"a","®":"(r)","º":"o","À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"th","ÿ":"y","Ā":"A","ā":"a","Ă":"A","ă":"a","Ą":"A","ą":"a","Ć":"C","ć":"c","Č":"C","č":"c","Ď":"D","ď":"d","Đ":"DJ","đ":"dj","Ē":"E","ē":"e","Ė":"E","ė":"e","Ę":"e","ę":"e","Ě":"E","ě":"e","Ğ":"G","ğ":"g","Ģ":"G","ģ":"g","Ĩ":"I","ĩ":"i","Ī":"i","ī":"i","Į":"I","į":"i","İ":"I","ı":"i","Ķ":"k","ķ":"k","Ļ":"L","ļ":"l","Ľ":"L","ľ":"l","Ł":"L","ł":"l","Ń":"N","ń":"n","Ņ":"N","ņ":"n","Ň":"N","ň":"n","Ő":"O","ő":"o","Œ":"OE","œ":"oe","Ŕ":"R","ŕ":"r","Ř":"R","ř":"r","Ś":"S","ś":"s","Ş":"S","ş":"s","Š":"S","š":"s","Ţ":"T","ţ":"t","Ť":"T","ť":"t","Ũ":"U","ũ":"u","Ū":"u","ū":"u","Ů":"U","ů":"u","Ű":"U","ű":"u","Ų":"U","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","ź":"z","Ż":"Z","ż":"z","Ž":"Z","ž":"z","ƒ":"f","Ơ":"O","ơ":"o","Ư":"U","ư":"u","ǈ":"LJ","ǉ":"lj","ǋ":"NJ","ǌ":"nj","Ș":"S","ș":"s","Ț":"T","ț":"t","˚":"o","Ά":"A","Έ":"E","Ή":"H","Ί":"I","Ό":"O","Ύ":"Y","Ώ":"W","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"H","Θ":"8","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"3","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"W","Ϊ":"I","Ϋ":"Y","ά":"a","έ":"e","ή":"h","ί":"i","ΰ":"y","α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"h","θ":"8","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"3","ο":"o","π":"p","ρ":"r","ς":"s","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"w","ϊ":"i","ϋ":"y","ό":"o","ύ":"y","ώ":"w","Ё":"Yo","Ђ":"DJ","Є":"Ye","І":"I","Ї":"Yi","Ј":"J","Љ":"LJ","Њ":"NJ","Ћ":"C","Џ":"DZ","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ж":"Zh","З":"Z","И":"I","Й":"J","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"H","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"U","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ж":"zh","з":"z","и":"i","й":"j","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"u","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ё":"yo","ђ":"dj","є":"ye","і":"i","ї":"yi","ј":"j","љ":"lj","њ":"nj","ћ":"c","ѝ":"u","џ":"dz","Ґ":"G","ґ":"g","Ғ":"GH","ғ":"gh","Қ":"KH","қ":"kh","Ң":"NG","ң":"ng","Ү":"UE","ү":"ue","Ұ":"U","ұ":"u","Һ":"H","һ":"h","Ә":"AE","ә":"ae","Ө":"OE","ө":"oe","฿":"baht","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"f","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","Ẁ":"W","ẁ":"w","Ẃ":"W","ẃ":"w","Ẅ":"W","ẅ":"w","ẞ":"SS","Ạ":"A","ạ":"a","Ả":"A","ả":"a","Ấ":"A","ấ":"a","Ầ":"A","ầ":"a","Ẩ":"A","ẩ":"a","Ẫ":"A","ẫ":"a","Ậ":"A","ậ":"a","Ắ":"A","ắ":"a","Ằ":"A","ằ":"a","Ẳ":"A","ẳ":"a","Ẵ":"A","ẵ":"a","Ặ":"A","ặ":"a","Ẹ":"E","ẹ":"e","Ẻ":"E","ẻ":"e","Ẽ":"E","ẽ":"e","Ế":"E","ế":"e","Ề":"E","ề":"e","Ể":"E","ể":"e","Ễ":"E","ễ":"e","Ệ":"E","ệ":"e","Ỉ":"I","ỉ":"i","Ị":"I","ị":"i","Ọ":"O","ọ":"o","Ỏ":"O","ỏ":"o","Ố":"O","ố":"o","Ồ":"O","ồ":"o","Ổ":"O","ổ":"o","Ỗ":"O","ỗ":"o","Ộ":"O","ộ":"o","Ớ":"O","ớ":"o","Ờ":"O","ờ":"o","Ở":"O","ở":"o","Ỡ":"O","ỡ":"o","Ợ":"O","ợ":"o","Ụ":"U","ụ":"u","Ủ":"U","ủ":"u","Ứ":"U","ứ":"u","Ừ":"U","ừ":"u","Ử":"U","ử":"u","Ữ":"U","ữ":"u","Ự":"U","ự":"u","Ỳ":"Y","ỳ":"y","Ỵ":"Y","ỵ":"y","Ỷ":"Y","ỷ":"y","Ỹ":"Y","ỹ":"y","‘":"\'","’":"\'","“":"\\\"","”":"\\\"","†":"+","•":"*","…":"...","₠":"ecu","₢":"cruzeiro","₣":"french franc","₤":"lira","₥":"mill","₦":"naira","₧":"peseta","₨":"rupee","₩":"won","₪":"new shequel","₫":"dong","€":"euro","₭":"kip","₮":"tugrik","₯":"drachma","₰":"penny","₱":"peso","₲":"guarani","₳":"austral","₴":"hryvnia","₵":"cedi","₸":"kazakhstani tenge","₹":"indian rupee","₽":"russian ruble","₿":"bitcoin","℠":"sm","™":"tm","∂":"d","∆":"delta","∑":"sum","∞":"infinity","♥":"love","元":"yuan","円":"yen","﷼":"rial"}');

        let slug = str.split('')
            // Replace characters based on charMap.
            .reduce(function (result, ch)
            {
                return result + (charMap[ch] || ch)
            }, '')

            // Remove not allowed characters.
            .replace(/[^\w\s$*_+~.()'"!\-:@]+/g, '')

            // Trim leading/trailing spaces.
            .trim()

            // Convert spaces to replacement character and also remove duplicates of the replacement character.
            .replace(new RegExp('[\\s' + opts.replacement + ']+', 'g'), opts.replacement);

        if (opts.lower) {
            slug = slug.toLowerCase()
        }

        if (opts.strict) {
            // Remove anything besides letters, numbers, and the replacement char.
            slug = slug.replace(new RegExp('[^a-zA-Z0-9' + opts.replacement + ']', 'g'), '')
        }

        return slug;
    }

    /**
     * Deslugify string.
     * 
     * @param   {string}    str     Target string.
     * @param   {string}    srep    The character to be replaced woth blanks.
     * 
     * @return  {string}            Output string.
     */
    static deslugify(str, srep = '-')
    {
        return GfString.replaceAll(srep, ' ');
    }

    /**
     * Trim a character from front and end of string.
     * 
     * @param   {string}    str     Target string.
     * @param   {string}    ch      The character to trim.
     * 
     * @return  {string}            Output string.
     */
    static trimChar(str, ch = ' ')
    {
        let ret = str;

        while (ret.charAt(0) == ch) {
            ret = ret.substring(1);
        }

        while (ret.charAt(ret.length - 1) == ch) {
            ret = ret.substring(0, ret.length - 1);
        }

        return ret;
    }

    /**
     * Truncate a string.
     * 
     * @param   {string}    str     Target string.
     * @param   {number}    words   Number of words.
     * 
     * @return  {string}            Output string.
     */
    static truncate(str, words)
    {
        return str.split(" ").splice(0, words).join(" ");
    }

    /**
     * See if a character is upper case.
     * 
     * @param   {string}    str     Target string.
     * @param   {number}    pos     Position to test.
     * 
     * @return  {boolean}           True if it is, else false.     
     */
    static isCharUpper(str, pos)
    {
        let character = str.charAt(pos);
        if (!isNaN(character * 1)) {
            return false;
        } else if (character == character.toUpperCase()) {
            return true;
        }
        return false;
    }

    /**
     * See if a character is lower case.
     * 
     * @param   {string}    str     Target string.
     * @param   {number}    pos     Position to test.
     * 
     * @return  {boolean}           True if it is, else false.     
     */
    static isCharLower(str, pos)
    {
        let character = str.charAt(pos);
        if (!isNaN(character * 1)) {
            return false;
        } else if (character == character.toLowerCase()) {
            return true;
        }
        return false;
    }
}

module.exports = GfString;