// ==UserScript==
// @name       Instagram Picture Downloader
// @namespace  http://cybai.github.io/
// @version    1.0
// @description  Just download photo of each post directly.
// @match      http://instagram.com/*
// @author  CYBAI
// ==/UserScript==

(function(){
    var InstaPicDownloader = function() {
        var _this = this;
        var likeBtn = document.getElementsByClassName('timelineLikeButton');

        this._settings = {
            CLIENT_ID: '9cd8b44c776b4bfcb257fc24e9c3af5d',
            userId: null,
            userName: null
        };
        
        this.ICONS = {
            // download icon from 'https://www.iconfinder.com/icons/63431/arrow_down_download_icon#size=32'
            homeDownload: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC4UlEQVRYR+2WW4hPQRzHd1FsUR6kaLctErmUB4lNYXPJLVEoIQ9uq/BA2WVbf0K8UKTkkgflTp5cQ5Tw4C6EFEkh93LJ9fOtGY0x55w5u2lf/lOfzjm/OfOb7/zmN5fSkmYupc3cf0lRQFMjUMYUyscX+NmY6cwroDWdDIXR0B86QQt4AzfgOJyG17Fi8ggYg9MC9DPOH/J8Bt+hA/QAReQprIdtpi5VS4yAVnhYBXXwAbbCXrgHX413+SkHRWYB9IIjMCcrGlkCFN6NsBAuwDzTcdqo2lHZAEvgLEyE90kNsgTMNqE8xXOSiYD11Z2X9vDLGBSRj05HS3lfBztAfoIlTUAFLa7CZxgIzz0Px/ge6Qio5l1RcstuPqbBMDgTUpAmQGFcadRrFH45iWGEYxwcEFCJ7SZchlGO2D/NkgS04Y9roPlUQin5/HICgyJgS0iA6nbCDOPnge8kSUBPfrwD+2BqoHOZYgUoCQ/DFDgQK2A4Pyrx6mFNggDlgMJqSxUvlwL/9sF2C5bD2lgB4/nxKGj5bfYaKfvbwiZQp7bMMh3d5+muhq58PwJtTrWxAmwECjRQIrpFWb0LWoI/heexSby77vvyfT1vBJQDt+EQaO78sgXDfM/4iu8hcNezq71yaTIcjI2AXQXaaLQK3noNtTqUIwOMXSehknV/QKz2AonoDdGrQH5WQAFCeaB6OTwHOog2wOJA592waTlfBJ0T/xzZMTuhTrtB8DjQwUxs02EcfPLqdY5oCidAo3ZC+VNmbzcj0Hp+GehEKyK0UWn5LjPtdSoGS9ZhpHqdhotMKJV4V5KcGXtHnqtBB1CTT0P5dO8D3/jWEtwD2lzegU5DXUS6wFioAZ0B2v3mQurtKCsC7mCVRNoT7I3oBe+6Ef0AJaIEqDwBbTqaOuVPaskjQI7snVBbsIR0BiWbRqmzQ9vzf7sThkZib8W6M9iLSdag/6rPG4FczmN+LgooRuA3sA+TIXFR74YAAAAASUVORK5CYII=',
            // download icon from 'https://www.iconfinder.com/icons/216183/download_icon#size=32'
            // profileDownload: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACHklEQVRYR+2XO0tcQRiG1SgmRtRCQv5ABCVE8dZaqKUhwQta2ESSQgubgGLhDUTUTgQRxRSBiAoKtqJYm4hgELz9gQgWCppE8PK8MMq4zu7Z3eNhLRx4mD3nzPd+7/nmzAybnJTglpzg/El+DbwzL7AV74v4MVBI0k2TWL9/x2PCj4F6Es6ZpA30808GnioQZAVyEG+BNdgwicJ9hKU8r4ApOPYyFe0qGEOoDc6gBlbBZaCS+0uQAaPQ/lAGlFwm1P7CB8gGexmecL0IL8y4VvpxPwZyCV6GbWiGYfhqBP/R/4BP5vobfRM8N9cj9B3wHQqgGo5cZiJNQRcBAyZomv4zdEOPx1v18bwfJi2D0hqM1cAvAkrgP2heJ2AFeiOYUHI9r4Iv8B7SQVplsRh4w+A9E7BAXxsS7DJxk9weqtiP5kYe/X6oiXBTYJe/kaBZh3vbhCu5QhQ7Y2Kd0xDOgE65IjiFV6Dl52pD3LyCzjDPtRwP4SVIsziaCtjl1wmnk85Pk0adEZD2gS3mqoBd/riPWSuJNG6m8N40uAz8JEDbqcqu8msa/LRMgv+ApkPa5V4VOGdAGmhnW/eT2YpV0iyQtpblbXNV4IKnKQ+UOFRG2qmP3sAlDqM9JWMtlLSfeVUg4Qa0sQTVpH3n+3KVOkgDerE7OV0GdhmkgyOItoNovtc38JoBb4PIjqb+PWlTirgPBJTbLRvUcov6Ja4B/s9qIbK55IoAAAAASUVORK5CYII='            
        };
        
        this._url = {
            api: {
                url: 'https://api.instagram.com/v1/',
                search: 'users/search?q=',
                media: 'users/id/media/recent'
            }
        };
        
        this.locationRegex = {
            homepage: /\.com\/$/,
            profile: /http:\/\/instagram\.com\/([^p\/].+)/,
            single: /\.com\/(p.+)/
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
                        this.setAttribute('href', src);
                        this.setAttribute('download', name);
                    } else {
                        console.log('This may be a video!');
                    }
                }, false);
            }
        };
        
        this.profile = {
            appendButtons: function() {
                var statusbar = document.getElementsByClassName('user-stats')[0];
                var dlBtn = document.createElement('li');
                dlBtn.id = 'album-download';
                var spanAbove = document.createElement('span');
                spanAbove.className = 'number-stat';
                spanAbove.innerText = 'Album';
                var spanBelow = document.createElement('span');
                spanBelow.innerText = 'download';
                dlBtn.appendChild(spanAbove);
                dlBtn.appendChild(spanBelow);
                statusbar.appendChild(dlBtn);
                _this.profile.bindEvents(statusbar.lastChild);
            },
            checkButtons: function() {
                if (!document.getElementById('album-download')) {
                    _this.profile.appendButtons();
                } else {
                    console.log('Button existed!');
                }
                
                _this.profile.setUserIdAndName();
            },
            bindEvents: function(elem) {
                elem.addEventListener('click', function() {
                    var api = _this._url.api;
                    _this._sendRequest(api.url + api.media.replace(/id/, _this._settings.userId) + '?count=-1&client_id=' + _this._settings.CLIENT_ID, function (xhr) {
                        var resp = JSON.parse(xhr.responseText);
                        for (var i = 0; i < resp.data.length; i++) {
                            var tempLink = document.createElement('a');
                            tempLink.href = resp.data[i].images.standard_resolution.url;
                            tempLink.download = _this._settings.userName + '_' + i;
                            tempLink.click();
                        }
                    });
                }, false);
            },
            setUserIdAndName: function () {
                var api = _this._url.api;
                var name = location.href.replace(_this.locationRegex.profile, '$1');
                _this._sendRequest(api.url + api.search + name + '&client_id=' + _this._settings.CLIENT_ID, function (xhr) {
                    var resp = JSON.parse(xhr.responseText);
                    if (resp.data[0].username === name) {
                        _this._settings.userId = resp.data[0].id;
                        _this._settings.userName = resp.data[0].full_name.replace(/[^\w]/g, '');
                    }
                });
            },
        };
        
        this.single = {
            appendButtons: function() {
                var ulParent = document.getElementsByClassName('Dropdown')[0];
                var ul = ulParent.childNodes[1];
                var dlBtn = document.createElement('li');
                dlBtn.id = 'single-download';
                var link = document.createElement('a');
                link.href = 'javascript:;';
                link.role = 'button';
                var spanBelow = document.createElement('span');
                spanBelow.innerText = 'Download this pic';
                link.appendChild(spanBelow);
                dlBtn.appendChild(link);
                ul.appendChild(dlBtn);
                _this.single.bindEvents(dlBtn);
            },
            checkButtons: function() {
                if (!document.getElementById('single-download')) {
                    _this.single.appendButtons();
                } else {
                    console.log('Button existed!');
                }
            },
            bindEvents: function(elem) {
                elem.addEventListener('click', function() {
                    var src = document.getElementsByClassName('LikeableFrame')[0].childNodes[0].getAttribute('src');
                    var name = src.replace(/http:\/\/(.+\.com)\/(.*\/)*(.+\.jpg)/, '$3');
                    var link = elem.childNodes[0];
                    if (src) {
                        link.setAttribute('href', src);
                        link.setAttribute('download', name);
                    } else {
                        console.log('This may be a video!');
                    }
                }, false);
            }
        };
        
        this._sendRequest = function (url, callback) {
            GM_xmlhttpRequest({
                url: url,
                method: 'GET',
                onload: callback
            });
        };

        GM_addStyle('a.insta-download { position: relative; float: left; display: inline-block; height: 100%; width: 48px; -webkit-user-select: none; -moz-user-select: none; user-select: none; background: url(' + this.ICONS.homeDownload + ') no-repeat; border-right: 1px solid #ddd; -webkit-box-shadow: 1px 0 0 rgba(255,255,255,.9); -moz-box-shadow: 1px 0 0 rgba(255,255,255,.9); box-shadow: 1px 0 0 rgba(255,255,255,.9); background-position: center; opacity: .3; } a.insta-download:hover { opacity: .7; } ');
    };

    console.clear();
    
    InstaPicDownloader = new InstaPicDownloader();
    
    window.onload = InstaPicDownloader.checkLocation();

    var target = document.getElementsByTagName('body')[0];
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            InstaPicDownloader.checkLocation(mutation);
        });
    });
    
    var config = { attributes: true, childList: true, characterData: true };
    
    observer.observe(target, config);

}());