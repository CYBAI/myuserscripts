// ==UserScript==
// @name       Instagram Picture Downloader
// @namespace  http://cybai.github.io/
// @version    0.2
// @description  Just download photo of each post directly.
// @match      http://instagram.com/*
// @author  CYBAI
// ==/UserScript==

(function(){
    var InstaPicDownloader = function() {
        var _this = this;
        var likeBtn = document.getElementsByClassName('timelineLikeButton');
        
        this.ICONS = {
            // download icon from 'https://www.iconfinder.com/icons/63431/arrow_down_download_icon#size=32'
            download: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC4UlEQVRYR+2WW4hPQRzHd1FsUR6kaLctErmUB4lNYXPJLVEoIQ9uq/BA2WVbf0K8UKTkkgflTp5cQ5Tw4C6EFEkh93LJ9fOtGY0x55w5u2lf/lOfzjm/OfOb7/zmN5fSkmYupc3cf0lRQFMjUMYUyscX+NmY6cwroDWdDIXR0B86QQt4AzfgOJyG17Fi8ggYg9MC9DPOH/J8Bt+hA/QAReQprIdtpi5VS4yAVnhYBXXwAbbCXrgHX413+SkHRWYB9IIjMCcrGlkCFN6NsBAuwDzTcdqo2lHZAEvgLEyE90kNsgTMNqE8xXOSiYD11Z2X9vDLGBSRj05HS3lfBztAfoIlTUAFLa7CZxgIzz0Px/ge6Qio5l1RcstuPqbBMDgTUpAmQGFcadRrFH45iWGEYxwcEFCJ7SZchlGO2D/NkgS04Y9roPlUQin5/HICgyJgS0iA6nbCDOPnge8kSUBPfrwD+2BqoHOZYgUoCQ/DFDgQK2A4Pyrx6mFNggDlgMJqSxUvlwL/9sF2C5bD2lgB4/nxKGj5bfYaKfvbwiZQp7bMMh3d5+muhq58PwJtTrWxAmwECjRQIrpFWb0LWoI/heexSby77vvyfT1vBJQDt+EQaO78sgXDfM/4iu8hcNezq71yaTIcjI2AXQXaaLQK3noNtTqUIwOMXSehknV/QKz2AonoDdGrQH5WQAFCeaB6OTwHOog2wOJA592waTlfBJ0T/xzZMTuhTrtB8DjQwUxs02EcfPLqdY5oCidAo3ZC+VNmbzcj0Hp+GehEKyK0UWn5LjPtdSoGS9ZhpHqdhotMKJV4V5KcGXtHnqtBB1CTT0P5dO8D3/jWEtwD2lzegU5DXUS6wFioAZ0B2v3mQurtKCsC7mCVRNoT7I3oBe+6Ef0AJaIEqDwBbTqaOuVPaskjQI7snVBbsIR0BiWbRqmzQ9vzf7sThkZib8W6M9iLSdag/6rPG4FczmN+LgooRuA3sA+TIXFR74YAAAAASUVORK5CYII='
        };
        
        this.locationRegex = {
            homepage: /\.com\/$/,
            profile: /\.com\/([^p\/].+)/,
            picture: /\.com\/(p.+)/
        };
        
        this.checkLocation = function() {
            for (regex in _this.locationRegex) {
                if (location.href.match(_this.locationRegex[regex])) {
                    _this[regex].checkButtons();
                    break;
                }
            }
        };
        
        this.homepage = {
            appendButtons: function(elem){
                var dlElem = document.createElement('a');
                dlElem.href = 'javascript:;';
                dlElem.className = 'insta-download';
                elem.parentNode.insertBefore(dlElem, elem.nextSibling);
                _this.homepage.bindEvents(elem);
            },
            checkButtons: function() {
                Array.prototype.forEach.call(likeBtn, function(elem){
                    if (elem.nextSibling.nodeName !== 'A') {
                        _this.homepage.appendButtons(elem);
                    }
                });
            },            
            bindEvents: function(elem) {
                elem.nextSibling.addEventListener('click', function() {
                    var src = this.parentNode.previousSibling.childNodes[1].getAttribute('src');
                    var name = src.replace(/http:\/\/(.+\.com)\/(.*\/)*(.+\.jpg)/, '$3');
                    if (src) {
                        console.log(name);
                        this.setAttribute('href', src);
                        this.setAttribute('download', name);
                    } else {
                        console.log('This may be a video!');
                    }
                }, false);
            }
        };
            
        GM_addStyle('a.insta-download { position: relative; float: left; display: inline-block; height: 100%; width: 48px; -webkit-user-select: none; -moz-user-select: none; user-select: none; background: url(' + this.ICONS.download + ') no-repeat; border-right: 1px solid #ddd; -webkit-box-shadow: 1px 0 0 rgba(255,255,255,.9); -moz-box-shadow: 1px 0 0 rgba(255,255,255,.9); box-shadow: 1px 0 0 rgba(255,255,255,.9); background-position: center; opacity: .3; } a.insta-download:hover { opacity: .7; } ');
    };
    
    InstaPicDownloader = new InstaPicDownloader();    

    var target = document.getElementsByTagName('body')[0];
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            InstaPicDownloader.checkLocation(mutation);
        });
    });
    
    var config = { attributes: true, childList: true, characterData: true };
    
    observer.observe(target, config);

}());