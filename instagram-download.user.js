// ==UserScript==
// @name       Instagram Picture Downloader
// @namespace  http://cybai.github.io/
// @version    0.1
// @description  Just download photo of each post directly.
// @match      http://instagram.com/*
// @author  CYBAI
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js
// ==/UserScript==

(function(){
    var InstaPicDownloader = function() {
        var self = this;
        var html = '<a href="javascript:;" class="insta-download">&nbsp;</a>';
        var likeBtn = document.getElementsByClassName('timelineLikeButton');
        
        this.ICONS = {
            // download icon from 'https://www.iconfinder.com/icons/63431/arrow_down_download_icon#size=32'
            download: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC4UlEQVRYR+2WW4hPQRzHd1FsUR6kaLctErmUB4lNYXPJLVEoIQ9uq/BA2WVbf0K8UKTkkgflTp5cQ5Tw4C6EFEkh93LJ9fOtGY0x55w5u2lf/lOfzjm/OfOb7/zmN5fSkmYupc3cf0lRQFMjUMYUyscX+NmY6cwroDWdDIXR0B86QQt4AzfgOJyG17Fi8ggYg9MC9DPOH/J8Bt+hA/QAReQprIdtpi5VS4yAVnhYBXXwAbbCXrgHX413+SkHRWYB9IIjMCcrGlkCFN6NsBAuwDzTcdqo2lHZAEvgLEyE90kNsgTMNqE8xXOSiYD11Z2X9vDLGBSRj05HS3lfBztAfoIlTUAFLa7CZxgIzz0Px/ge6Qio5l1RcstuPqbBMDgTUpAmQGFcadRrFH45iWGEYxwcEFCJ7SZchlGO2D/NkgS04Y9roPlUQin5/HICgyJgS0iA6nbCDOPnge8kSUBPfrwD+2BqoHOZYgUoCQ/DFDgQK2A4Pyrx6mFNggDlgMJqSxUvlwL/9sF2C5bD2lgB4/nxKGj5bfYaKfvbwiZQp7bMMh3d5+muhq58PwJtTrWxAmwECjRQIrpFWb0LWoI/heexSby77vvyfT1vBJQDt+EQaO78sgXDfM/4iu8hcNezq71yaTIcjI2AXQXaaLQK3noNtTqUIwOMXSehknV/QKz2AonoDdGrQH5WQAFCeaB6OTwHOog2wOJA592waTlfBJ0T/xzZMTuhTrtB8DjQwUxs02EcfPLqdY5oCidAo3ZC+VNmbzcj0Hp+GehEKyK0UWn5LjPtdSoGS9ZhpHqdhotMKJV4V5KcGXtHnqtBB1CTT0P5dO8D3/jWEtwD2lzegU5DXUS6wFioAZ0B2v3mQurtKCsC7mCVRNoT7I3oBe+6Ef0AJaIEqDwBbTqaOuVPaskjQI7snVBbsIR0BiWbRqmzQ9vzf7sThkZib8W6M9iLSdag/6rPG4FczmN+LgooRuA3sA+TIXFR74YAAAAASUVORK5CYII='
        };
            
        this.appendButtons = function(elem){
            $(elem).after(html);
            self.bindEvents(elem);
        };
            
        this.checkButtons = function() {
            Array.prototype.forEach.call(likeBtn, function(elem){
                if (elem.nextSibling.nodeName !== 'A') {
                    self.appendButtons(elem);
                }
            });
        };
        
        this.bindEvents = function(elem) {
            var dlBtn = $(elem).next();
            $(dlBtn).on('click', function(){
                var src = $(this).parent().prev().find('.Image').attr('src');
                var name = src.replace(/http:\/\/(.+\.com)\/(.*\/)*(.+\.jpg)/, '$3');
                if (src) {
                    console.log(name);
                    $(this).attr({
                        'href': src,
                        'download': name
                    });
                } else {
                    console.log('This may be a video!');
                }
            });
        };
            
        GM_addStyle('a.insta-download { position: relative; float: left; display: inline; height: 100%; width: 48px; -webkit-user-select: none; -moz-user-select: none; user-select: none; background: url(' + this.ICONS.download + ') no-repeat; border-right: 1px solid #ddd; -webkit-box-shadow: 1px 0 0 rgba(255,255,255,.9); -moz-box-shadow: 1px 0 0 rgba(255,255,255,.9); box-shadow: 1px 0 0 rgba(255,255,255,.9); background-position: center; opacity: .3; }');
    };
    
    InstaPicDownloader = new InstaPicDownloader();
    
    setInterval(InstaPicDownloader.checkButtons, 1000);
}());