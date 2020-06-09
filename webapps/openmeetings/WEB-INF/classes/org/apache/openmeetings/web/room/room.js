/*
 * Licensed MIT https://github.com/ROMB/jquery-dialogextend/blob/master/LICENSE.md
 */
(function() {
  var $;

  $ = jQuery;

  $.widget("ui.dialogExtend", {
    version: "2.0.4",
    modes: {},
    options: {
      "closable": true,
      "dblclick": false,
      "titlebar": false,
      "icons": {
        "close": "ui-icon-closethick",
        "restore": "ui-icon-newwin"
      },
      "load": null,
      "beforeRestore": null,
      "restore": null
    },
    _create: function() {
      this._state = "normal";
      if (!$(this.element[0]).data("ui-dialog")) {
        $.error("jQuery.dialogExtend Error : Only jQuery UI Dialog element is accepted");
      }
      this._verifyOptions();
      this._initStyles();
      this._initButtons();
      this._initTitleBar();
      this._setState("normal");
      this._on("load", function(e) {
        return console.log("test", e);
      });
      return this._trigger("load");
    },
    _setState: function(state) {
      $(this.element[0]).removeClass("ui-dialog-" + this._state).addClass("ui-dialog-" + state);
      return this._state = state;
    },
    _verifyOptions: function() {
      var name, _ref, _results;

      if (this.options.dblclick && !(this.options.dblclick in this.modes)) {
        $.error("jQuery.dialogExtend Error : Invalid <dblclick> value '" + this.options.dblclick + "'");
        this.options.dblclick = false;
      }
      if (this.options.titlebar && ((_ref = this.options.titlebar) !== "none" && _ref !== "transparent")) {
        $.error("jQuery.dialogExtend Error : Invalid <titlebar> value '" + this.options.titlebar + "'");
        this.options.titlebar = false;
      }
      _results = [];
      for (name in this.modes) {
        if (this["_verifyOptions_" + name]) {
          _results.push(this["_verifyOptions_" + name]());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    _initStyles: function() {
      var name, style, _results;

      if (!$(".dialog-extend-css").length) {
        style = '';
        style += '<style class="dialog-extend-css" type="text/css">';
        style += '.ui-dialog .ui-dialog-titlebar-buttonpane>a { float: right; }';
        style += '.ui-dialog .ui-dialog-titlebar-restore { width: 19px; height: 18px; }';
        style += '.ui-dialog .ui-dialog-titlebar-restore span { display: block; margin: 1px; }';
        style += '.ui-dialog .ui-dialog-titlebar-restore:hover,';
        style += '.ui-dialog .ui-dialog-titlebar-restore:focus { padding: 0; }';
        style += '.ui-dialog .ui-dialog-titlebar ::selection { background-color: transparent; }';
        style += '</style>';
        $(style).appendTo("body");
      }
      _results = [];
      for (name in this.modes) {
        _results.push(this["_initStyles_" + name]());
      }
      return _results;
    },
    _initButtons: function() {
      var buttonPane, mode, name, titlebar, _ref,
        _this = this;

      titlebar = $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar");
      buttonPane = $('<div class="ui-dialog-titlebar-buttonpane"></div>').appendTo(titlebar);
      buttonPane.css({
        "position": "absolute",
        "top": "50%",
        "right": "0.3em",
        "margin-top": "-10px",
        "height": "18px"
      });
      titlebar.find(".ui-dialog-titlebar-close").css({
        "position": "relative",
        "float": "right",
        "top": "auto",
        "right": "auto",
        "margin": 0
      }).find(".ui-icon").removeClass("ui-icon-closethick").addClass(this.options.icons.close).end().appendTo(buttonPane).end();
      buttonPane.append('<a class="ui-dialog-titlebar-restore ui-corner-all ui-state-default" href="#"><span class="ui-icon ' + this.options.icons.restore + '" title="restore">restore</span></a>').find('.ui-dialog-titlebar-restore').attr("role", "button").mouseover(function() {
        return $(this).addClass("ui-state-hover");
      }).mouseout(function() {
        return $(this).removeClass("ui-state-hover");
      }).focus(function() {
        return $(this).addClass("ui-state-focus");
      }).blur(function() {
        return $(this).removeClass("ui-state-focus");
      }).end().find(".ui-dialog-titlebar-close").toggle(this.options.closable).end().find(".ui-dialog-titlebar-restore").hide().click(function(e) {
        e.preventDefault();
        return _this.restore();
      }).end();
      _ref = this.modes;
      for (name in _ref) {
        mode = _ref[name];
        this._initModuleButton(name, mode);
      }
      return titlebar.dblclick(function(evt) {
        if (_this.options.dblclick) {
          if (_this._state !== "normal") {
            return _this.restore();
          } else {
            return _this[_this.options.dblclick]();
          }
        }
      }).select(function() {
        return false;
      });
    },
    _initModuleButton: function(name, mode) {
      var buttonPane,
        _this = this;

      buttonPane = $(this.element[0]).dialog("widget").find('.ui-dialog-titlebar-buttonpane');
      return buttonPane.append('<a class="ui-dialog-titlebar-' + name + ' ui-corner-all ui-state-default" href="#" title="' + name + '"><span class="ui-icon ' + this.options.icons[name] + '">' + name + '</span></a>').find(".ui-dialog-titlebar-" + name).attr("role", "button").mouseover(function() {
        return $(this).addClass("ui-state-hover");
      }).mouseout(function() {
        return $(this).removeClass("ui-state-hover");
      }).focus(function() {
        return $(this).addClass("ui-state-focus");
      }).blur(function() {
        return $(this).removeClass("ui-state-focus");
      }).end().find(".ui-dialog-titlebar-" + name).toggle(this.options[mode.option]).click(function(e) {
        e.preventDefault();
        return _this[name]();
      }).end();
    },
    _initTitleBar: function() {
      var handle;

      switch (this.options.titlebar) {
        case false:
          return 0;
        case "none":
          if ($(this.element[0]).dialog("option", "draggable")) {
            handle = $("<div />").addClass("ui-dialog-draggable-handle").css("cursor", "move").height(5);
            $(this.element[0]).dialog("widget").prepend(handle).draggable("option", "handle", handle);
          }
          return $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar").find(".ui-dialog-title").html("&nbsp;").end().css({
            "background-color": "transparent",
            "background-image": "none",
            "border": 0,
            "position": "absolute",
            "right": 0,
            "top": 0,
            "z-index": 9999
          }).end();
        case "transparent":
          return $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar").css({
            "background-color": "transparent",
            "background-image": "none",
            "border": 0
          });
        default:
          return $.error("jQuery.dialogExtend Error : Invalid <titlebar> value '" + this.options.titlebar + "'");
      }
    },
    state: function() {
      return this._state;
    },
    restore: function() {
      this._trigger("beforeRestore");
      this._restore();
      this._toggleButtons();
      return this._trigger("restore");
    },
    _restore: function() {
      if (this._state !== "normal") {
        this["_restore_" + this._state]();
        this._setState("normal");
        return $(this.element[0]).dialog("widget").focus();
      }
    },
    _saveSnapshot: function() {
      if (this._state === "normal") {
        this.original_config_resizable = $(this.element[0]).dialog("option", "resizable");
        this.original_config_draggable = $(this.element[0]).dialog("option", "draggable");
        this.original_size_height = $(this.element[0]).dialog("widget").outerHeight();
        this.original_size_width = $(this.element[0]).dialog("option", "width");
        this.original_size_maxHeight = $(this.element[0]).dialog("option", "maxHeight");
        this.original_position_mode = $(this.element[0]).dialog("widget").css("position");
        this.original_position_left = $(this.element[0]).dialog("widget").offset().left - $('body').scrollLeft();
        this.original_position_top = $(this.element[0]).dialog("widget").offset().top - $('body').scrollTop();
        return this.original_titlebar_wrap = $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar").css("white-space");
      }
    },
    _loadSnapshot: function() {
      return {
        "config": {
          "resizable": this.original_config_resizable,
          "draggable": this.original_config_draggable
        },
        "size": {
          "height": this.original_size_height,
          "width": this.original_size_width,
          "maxHeight": this.original_size_maxHeight
        },
        "position": {
          "mode": this.original_position_mode,
          "left": this.original_position_left,
          "top": this.original_position_top
        },
        "titlebar": {
          "wrap": this.original_titlebar_wrap
        }
      };
    },
    _toggleButtons: function(newstate) {
      var mode, name, state, _ref, _ref1, _results;

      state = newstate || this._state;
      $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar-restore").toggle(state !== "normal").css({
        "right": "1.4em"
      }).end();
      _ref = this.modes;
      for (name in _ref) {
        mode = _ref[name];
        $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar-" + name).toggle(state !== mode.state && this.options[mode.option]);
      }
      _ref1 = this.modes;
      _results = [];
      for (name in _ref1) {
        mode = _ref1[name];
        if (mode.state === state) {
          _results.push($(this.element[0]).dialog("widget").find(".ui-dialog-titlebar-restore").insertAfter($(this.element[0]).dialog("widget").find(".ui-dialog-titlebar-" + name)).end());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  });

}).call(this);

(function() {
  var $;

  $ = jQuery;

  $.extend(true, $.ui.dialogExtend.prototype, {
    modes: {
      "collapse": {
        option: "collapsable",
        state: "collapsed"
      }
    },
    options: {
      "collapsable": false,
      "icons": {
        "collapse": "ui-icon-triangle-1-s"
      },
      "beforeCollapse": null,
      "collapse": null
    },
    collapse: function() {
      var newHeight, pos;

      newHeight = $(this.element[0]).dialog("widget").find(".ui-dialog-titlebar").height() + 2;
      this._trigger("beforeCollapse");
      if (this._state !== "normal") {
        this._restore();
      }
      this._saveSnapshot();
      pos = $(this.element[0]).dialog("widget").position();
      $(this.element[0]).dialog("option", {
        "resizable": false,
        "height": newHeight,
        "maxHeight": newHeight,
        "position": [pos.left - $(document).scrollLeft(), pos.top - $(document).scrollTop()]
      }).on('dialogclose', this._collapse_restore).dialog("widget").find(".ui-dialog-buttonpane:visible").hide().end().find(".ui-dialog-titlebar").css("white-space", "nowrap").end().find(".ui-dialog-content");
      this._setState("collapsed");
      this._toggleButtons();
      return this._trigger("collapse");
    },
    _restore_collapsed: function() {
      var original;

      original = this._loadSnapshot();
      return $(this.element[0]).show().dialog("widget").find(".ui-dialog-buttonpane:hidden").show().end().find(".ui-dialog-titlebar").css("white-space", original.titlebar.wrap).end().find(".ui-dialog-content").dialog("option", {
        "resizable": original.config.resizable,
        "height": original.size.height,
        "maxHeight": original.size.maxHeight
      }).off('dialogclose', this._collapse_restore);
    },
    _initStyles_collapse: function() {
      var style;

      if (!$(".dialog-extend-collapse-css").length) {
        style = '';
        style += '<style class="dialog-extend-collapse-css" type="text/css">';
        style += '.ui-dialog .ui-dialog-titlebar-collapse { width: 19px; height: 18px; }';
        style += '.ui-dialog .ui-dialog-titlebar-collapse span { display: block; margin: 1px; }';
        style += '.ui-dialog .ui-dialog-titlebar-collapse:hover,';
        style += '.ui-dialog .ui-dialog-titlebar-collapse:focus { padding: 0; }';
        style += '</style>';
        return $(style).appendTo("body");
      }
    },
    _collapse_restore: function() {
      return $(this).dialogExtend("restore");
    }
  });

}).call(this);
/* Licensed under the Apache License, Version 2.0 (the "License") http://www.apache.org/licenses/LICENSE-2.0 */
const WB_AREA_SEL = '.room.wb.area';
const WBA_WB_SEL = '.room.wb.area .ui-tabs-panel.ui-corner-bottom.ui-widget-content:visible';
const VID_SEL = '.video.user-video';
var VideoUtil = (function() {
	const self = {};
	function _getVid(uid) {
		return 'video' + uid;
	}
	function _isSharing(c) {
		return 'sharing' === c.type && c.screenActivities.includes('sharing');
	}
	function _isRecording(c) {
		return 'sharing' === c.type
			&& c.screenActivities.includes('recording')
			&& !c.screenActivities.includes('sharing');
	}
	function _hasAudio(c) {
		return c.activities.includes('broadcastA');
	}
	function _hasVideo(c) {
		return c.activities.includes('broadcastV');
	}
	function _getRects(sel, excl) {
		const list = [], elems = $(sel);
		for (let i = 0; i < elems.length; ++i) {
			if (excl !== $(elems[i]).attr('aria-describedby')) {
				list.push(_getRect(elems[i]));
			}
		}
		return list;
	}
	function _getRect(e) {
		const win = $(e), winoff = win.offset();
		return {left: winoff.left
			, top: winoff.top
			, right: winoff.left + win.width()
			, bottom: winoff.top + win.height()};
	}
	function _container() {
		const a = $(WB_AREA_SEL);
		const c = a.find('.wb-area .tabs .ui-tabs-panel');
		return c.length > 0 ? $(WBA_WB_SEL) : a;
	}
	function _getPos(list, w, h) {
		if (Room.getOptions().interview) {
			return {left: 0, top: 0};
		}
		const wba = _container(), woffset = wba.offset()
			, offsetX = 20, offsetY = 10
			, area = {left: woffset.left, top: woffset.top, right: woffset.left + wba.width(), bottom: woffset.top + wba.height()};
		const rectNew = {
				_left: area.left
				, _top: area.top
				, right: area.left + w
				, bottom: area.top + h
				, get left() {
					return this._left
				}
				, set left(l) {
					this._left = l;
					this.right = l + w;
				}
				, get top() {
					return this._top
				}
				, set top(t) {
					this._top = t;
					this.bottom = t + h;
				}
			};
		let minY = area.bottom, posFound;
		do {
			posFound = true
			for (let i = 0; i < list.length; ++i) {
				const rect = list[i];
				minY = Math.min(minY, rect.bottom);

				if (rectNew.left < rect.right && rectNew.right > rect.left && rectNew.top < rect.bottom && rectNew.bottom > rect.top) {
					rectNew.left = rect.right + offsetX;
					posFound = false;
				}
				if (rectNew.right >= area.right) {
					rectNew.left = area.left;
					rectNew.top = Math.max(minY, rectNew.top) + offsetY;
					posFound = false;
				}
				if (rectNew.bottom >= area.bottom) {
					rectNew.top = area.top;
					posFound = true;
					break;
				}
			}
		} while (!posFound);
		return {left: rectNew.left, top: rectNew.top};
	}
	function _arrange() {
		const list = [], elems = $(VID_SEL);
		for (let i = 0; i < elems.length; ++i) {
			const v = $(elems[i]);
			v.css(_getPos(list, v.width(), v.height()));
			list.push(_getRect(v));
		}
	}
	function _askPermission(callback) {
		const perm = $('#ask-permission');
		if (undefined === perm.dialog('instance')) {
			perm.data('callbacks', []).dialog({
				appendTo: '.room.holder .room.box'
				, autoOpen: true
				, buttons: [
					{
						text: perm.data('btn-ok')
						, click: function() {
							while (perm.data('callbacks').length > 0) {
								perm.data('callbacks').pop()();
							}
							$(this).dialog('close');
						}
					}
				]
			});
		} else if (!perm.dialog('isOpen')) {
			perm.dialog('open')
		}
		perm.data('callbacks').push(callback);
	}
	function _highlight(el, count) {
		if (!el || el.length < 1 || el.hasClass('disabled') || count < 0) {
			return;
		}
		el.addClass('ui-state-highlight', 2000, function() {
			el.removeClass('ui-state-highlight', 2000, function() {
				_highlight(el, --count);
			});
		});
	}

	self.getVid = _getVid;
	self.isSharing = _isSharing;
	self.isRecording = _isRecording;
	self.hasAudio = _hasAudio;
	self.hasVideo = _hasVideo;
	self.getRects = _getRects;
	self.getPos = _getPos;
	self.container = _container;
	self.arrange = _arrange;
	self.askPermission = _askPermission;
	self.highlight = _highlight;
	return self;
})();
/* Licensed under the Apache License, Version 2.0 (the "License") http://www.apache.org/licenses/LICENSE-2.0 */
var Video = (function() {
	const self = {};
	let c, v, vc, t, f, swf, size, vol, slider, handle
		, lastVolume = 50;

	function _getExtra() {
		return t.height() + 2 + (f.is(':visible') ? f.height() : 0);
	}
	function _resizeDlg(_w, _h) {
		const h = _h + _getExtra();
		_resizeDlgArea(_w, h);
		return h;
	}
	function _vidResize(_w, _h) {
		try {
			swf[0].vidResize(Math.floor(_w), Math.floor(_h));
		} catch (err) {}
	}
	function _resizeDlgArea(_w, _h) {
		v.dialog('option', 'width', _w).dialog('option', 'height', _h);
		const h = _h - _getExtra();
		_resize(_w, h);
		if (Room.getOptions().interview) {
			v.dialog('widget').css(VideoUtil.getPos());
		}
		_vidResize(_w, h);
	}
	function _resizePod() {
		const p = v.parents('.pod,.pod-big')
			, pw = p.width(), ph = p.height();
		_resizeDlgArea(pw, ph);
	}
	function _swfLoaded() {
		if (Room.getOptions().interview) {
			v.parent().parent().removeClass('secure');
			_resizePod();
		} else {
			const h = _resizeDlg(size.width, size.height);
			v.dialog('widget').css(VideoUtil.getPos(VideoUtil.getRects(VID_SEL, VideoUtil.getVid(c.uid)), c.width, h));
		}
	}
	function _securityMode() {
		if (Room.getOptions().interview) {
			_resizeDlgArea(Math.max(300, swf.attr('width')), Math.max(200, swf.attr('height')));
			v.parent().parent().addClass('secure');
		} else {
			v.dialog('option', 'position', {my: 'center', at: 'center', of: VideoUtil.container()});
		}
	}
	function _resize(w, h) {
		vc.width(w).height(h);
		swf.attr('width', w).attr('height', h);
	}
	function _handleMicStatus(state) {
		if (!f.is(':visible')) {
			return;
		}
		if (state) {
			f.find('.off').hide();
			f.find('.on').show();
			f.addClass('ui-state-highlight');
			t.addClass('ui-state-highlight');
		} else {
			f.find('.off').show();
			f.find('.on').hide();
			f.removeClass('ui-state-highlight');
			t.removeClass('ui-state-highlight');
		}
	}
	function _handleVolume(val) {
		handle.text(val);
		const ico = vol.find('.ui-icon');
		if (val > 0 && ico.hasClass('ui-icon-volume-off')) {
			ico.toggleClass('ui-icon-volume-off ui-icon-volume-on');
			vol.removeClass('ui-state-error');
			_handleMicStatus(true);
		} else if (val === 0 && ico.hasClass('ui-icon-volume-on')) {
			ico.toggleClass('ui-icon-volume-on ui-icon-volume-off');
			vol.addClass('ui-state-error');
			_handleMicStatus(false);
		}
		if (typeof(swf[0].setVolume) === 'function') {
			swf[0].setVolume(val);
		}
	}
	function _mute(mute) {
		if (!slider) {
			return;
		}
		if (mute) {
			const val = slider.slider('option', 'value');
			if (val > 0) {
				lastVolume = val;
			}
			slider.slider('option', 'value', 0);
			_handleVolume(0);
		} else {
			slider.slider('option', 'value', lastVolume);
			_handleVolume(lastVolume);
		}
	}
	function _initContainer(_id, name, opts) {
		let contSel;
		if (opts.interview) {
			const area = $('.pod-area');
			const contId = UUID.generate();
			contSel = '#' + contId;
			area.append($('<div class="pod"></div>').attr('id', contId));
			WbArea.updateAreaClass();
		} else {
			contSel = '.room.box';
		}
		$(contSel).append(OmUtil.tmpl('#user-video', _id).attr('title', name)
				.attr('data-client-uid', c.type + c.cuid).data(self));
		return contSel;
	}
	function _initDialog(v, opts) {
		if (opts.interview) {
			v.dialog('option', 'draggable', false);
			v.dialog('option', 'resizable', false);
			v.dialogExtend({
				closable: false
				, collapsable: false
				, dblclick: false
			});
			$('.pod-area').sortable('refresh');
		} else {
			v.dialog('option', 'draggable', true);
			v.dialog('option', 'resizable', true);
			v.on('dialogresizestop', function(event, ui) {
				const w = ui.size.width - 2
					, h = ui.size.height - t.height() - 4 - (f.is(':visible') ? f.height() : 0);
				_resize(w, h);
				_vidResize(w, h);
			});
			if (VideoUtil.isSharing(c)) {
				v.on('dialogclose', function() {
					VideoManager.close(c.uid, true);
				});
			}
			v.dialogExtend({
				icons: {
					'collapse': 'ui-icon-minus'
				}
				, closable: VideoUtil.isSharing(c)
				, collapsable: true
				, dblclick: 'collapse'
			});
		}
	}
	function _init(_c, _pos) {
		c = _c;
		size = {width: c.width, height: c.height};
		const _id = VideoUtil.getVid(c.uid)
			, name = c.user.displayName
			, _w = c.self ? Math.max(300, c.width) : c.width
			, _h = c.self ? Math.max(200, c.height) : c.height
			, opts = Room.getOptions();
		const contSel = _initContainer(_id, name, opts);
		v = $('#' + _id);
		v.dialog({
			classes: {
				'ui-dialog': 'ui-corner-all video user-video' + (opts.showMicStatus ? ' mic-status' : '')
				, 'ui-dialog-titlebar': 'ui-corner-all' + (opts.showMicStatus ? ' ui-state-highlight' : '')
			}
			, width: _w
			, minWidth: 40
			, minHeight: 50
			, autoOpen: true
			, modal: false
			, appendTo: contSel
		});
		_initDialog(v, opts);
		t = v.parent().find('.ui-dialog-titlebar').attr('title', name);
		f = v.find('.footer');
		if (!VideoUtil.isSharing(c)) {
			v.parent().find('.ui-dialog-titlebar-buttonpane')
				.append($('#video-volume-btn').children().clone())
				.append($('#video-refresh-btn').children().clone());
			const volume = v.parent().find('.dropdown-menu.video.volume');
			slider = v.parent().find('.slider');
			vol = v.parent().find('.ui-dialog-titlebar-volume')
				.on('mouseenter', function(e) {
					e.stopImmediatePropagation();
					volume.toggle();
				})
				.click(function(e) {
					e.stopImmediatePropagation();
					const muted = $(this).find('.ui-icon').hasClass('ui-icon-volume-off');
					roomAction('mute', JSON.stringify({uid: c.cuid, mute: !muted}));
					_mute(!muted);
					volume.hide();
					return false;
				}).dblclick(function(e) {
					e.stopImmediatePropagation();
					return false;
				});
			v.parent().find('.ui-dialog-titlebar-refresh')
				.click(function(e) {
					e.stopImmediatePropagation();
					_refresh();
					return false;
				}).dblclick(function(e) {
					e.stopImmediatePropagation();
					return false;
				});
			volume.on('mouseleave', function() {
				$(this).hide();
			});
			handle = v.parent().find('.slider .handle');
			slider.slider({
				orientation: 'vertical'
				, range: 'min'
				, min: 0
				, max: 100
				, value: lastVolume
				, create: function() {
					handle.text($(this).slider('value'));
				}
				, slide: function(event, ui) {
					_handleVolume(ui.value);
				}
			});
			const hasAudio = VideoUtil.hasAudio(c);
			_handleMicStatus(hasAudio);
			if (!hasAudio) {
				vol.hide();
			}
		}
		vc = v.find('.video');
		vc.width(_w).height(_h);
		_reinitSwf();
		v.dialog('widget').css(_pos);
	}
	function _reinitSwf() {
		const _id = VideoUtil.getVid(c.uid);
		swf && swf.remove();
		//broadcast
		const o = Room.getOptions();
		if (c.self) {
			o.cam = c.cam;
			o.mic = c.mic;
			o.mode = 'broadcast';
		} else {
			o.mode = 'play';
		}
		o.av = c.activities.join();
		o.rights = o.rights.join();
		o.width = c.width;
		o.height = c.height;
		o.sid = c.sid;
		o.uid = c.uid;
		o.cuid = c.cuid;
		o.userId = c.user.id;
		o.pictureUri = c.user.pictureUri;
		o.broadcastId = c.broadcastId;
		o.type = c.type;
		delete o.keycode;
		swf = initSwf(vc, 'main.swf', _id + '-swf', o);
		swf.attr('width', vc.width()).attr('height', vc.height());
	}
	function _update(_c) {
		const opts = Room.getOptions();
		c.screenActivities = _c.screenActivities;
		c.activities = _c.activities;
		c.user.firstName = _c.user.firstName;
		c.user.lastName = _c.user.lastName;
		c.user.displayName = _c.user.displayName;
		const hasAudio = VideoUtil.hasAudio(c);
		_handleMicStatus(hasAudio);
		if (hasAudio) {
			vol.show();
		} else {
			vol.hide();
			v.parent().find('.dropdown-menu.video.volume').hide();
		}
		if (opts.interview && c.pod !== _c.pod) {
			c.pod = _c.pod;
			v.dialog('option', 'appendTo', '.pod.pod-' + c.pod);
		}
		const name = c.user.displayName;
		v.dialog('option', 'title', name).parent().find('.ui-dialog-titlebar').attr('title', name);
		if (typeof(swf[0].update) === 'function') {
			swf[0].update(c);
		}
	}
	function _refresh(_opts) {
		if (typeof(swf[0].refresh) === 'function') {
			const opts = _opts || {};
			if (!Room.getOptions().interview && !isNaN(opts.width)) {
				_resizeDlg(opts.width, opts.height);
			}
			try {
				swf[0].refresh(opts);
			} catch (e) {
				//swf might throw
			}
		}
	}
	function _setRights(_r) {
		if (typeof(swf[0].setRights) === 'function') {
			swf[0].setRights(_r);
		}
	}
	function _cleanup() {
		if (typeof(swf[0].cleanup) === 'function') {
			swf[0].cleanup();
		}
	}

	self.update = _update;
	self.refresh = _refresh;
	self.mute = _mute;
	self.isMuted = function() { return 0 === slider.slider('option', 'value'); };
	self.init = _init;
	self.securityMode = _securityMode;
	self.swfLoaded = _swfLoaded;
	self.client = function() { return c; };
	self.setRights = _setRights;
	self.cleanup = _cleanup;
	self.resizePod = _resizePod;
	self.reinitSwf = _reinitSwf;
	return self;
});
/* Licensed under the Apache License, Version 2.0 (the "License") http://www.apache.org/licenses/LICENSE-2.0 */
var VideoManager = (function() {
	const self = {};
	let share, inited = false;

	function _onWsMessage(jqEvent, msg) {
		try {
			if (msg instanceof Blob) {
				return; //ping
			}
			const m = jQuery.parseJSON(msg);
			if (m && 'mic' === m.type) {
				switch (m.id) {
					case 'activity':
						_micActivity(m.uid, m.active);
						onBroadcast(m);
						break;
					default:
						//no-op
				}
			}
		} catch (err) {
			//no-op
		}
	}
	function _init() {
		Wicket.Event.subscribe('/websocket/message', _onWsMessage);
		VideoSettings.init(Room.getOptions());
		share = $('.room.box').find('.icon.shared.ui-button');
		inited = true;
	}
	function _update(c) {
		if (!inited) {
			return;
		}
		for (let i = 0; i < c.streams.length; ++i) {
			const cl = JSON.parse(JSON.stringify(c)), s = c.streams[i];
			delete cl.streams;
			$.extend(cl, s);
			if (cl.self && VideoUtil.isSharing(cl) || VideoUtil.isRecording(cl)) {
				continue;
			}
			const _id = VideoUtil.getVid(cl.uid)
				, av = VideoUtil.hasAudio(cl) || VideoUtil.hasVideo(cl)
				, v = $('#' + _id);
			if (av && v.length !== 1 && !!cl.self) {
				Video().init(cl, VideoUtil.getPos(VideoUtil.getRects(VID_SEL), cl.width, cl.height + 25));
			} else if (av && v.length === 1) {
				v.data().update(cl);
			} else if (!av && v.length === 1) {
				_closeV(v);
			}
		}
		if (c.uid === Room.getOptions().uid) {
			Room.setRights(c.rights);
			const windows = $(VID_SEL + ' .ui-dialog-content');
			for (let i = 0; i < windows.length; ++i) {
				const w = $(windows[i]);
				w.data().setRights(c.rights);
			}

		}
		if (c.streams.length === 0) {
			// check for non inited video window
			const vw = $('#' + VideoUtil.getVid(c.uid));
			if (vw.length === 1) {
				_closeV(vw);
			}
		}
	}
	function _closeV(v) {
		if (v.dialog('instance') !== undefined) {
			v.dialog('destroy');
		}
		v.parents('.pod').remove();
		v.remove();
		WbArea.updateAreaClass();
	}
	function _play(c) {
		if (!inited) {
			return;
		}
		if (VideoUtil.isSharing(c)) {
			VideoUtil.highlight(share
					.attr('title', share.data('user') + ' ' + c.user.firstName + ' ' + c.user.lastName + ' ' + share.data('text'))
					.data('uid', c.uid)
					.show(), 10);
			share.tooltip().off('click').click(function() {
				const v = $('#' + VideoUtil.getVid(c.uid))
				if (v.length !== 1) {
					Video().init(c, VideoUtil.container().offset());
				} else {
					v.dialog('open');
				}
			});
		} else if ('sharing' !== c.type) {
			Video().init(c, VideoUtil.getPos(VideoUtil.getRects(VID_SEL), c.width, c.height + 25));
		}
	}
	function _close(uid, showShareBtn) {
		const _id = VideoUtil.getVid(uid), v = $('#' + _id);
		if (v.length === 1) {
			_closeV(v);
		}
		if (!showShareBtn && uid === share.data('uid')) {
			share.off('click').hide();
		}
	}
	function _find(uid) {
		return $(VID_SEL + ' div[data-client-uid="room' + uid + '"]');
	}
	function _micActivity(uid, active) {
		const u = $('#user' + uid + ' .audio-activity.ui-icon')
			, v = _find(uid).parent();
		if (active) {
			u.addClass('speaking');
			v.addClass('user-speaks')
		} else {
			u.removeClass('speaking');
			v.removeClass('user-speaks')
		}
	}
	function _refresh(uid, opts) {
		const v = _find(uid);
		if (v.length > 0) {
			v.data().refresh(opts);
		}
	}
	function _mute(uid, mute) {
		const v = _find(uid);
		if (v.length > 0) {
			v.data().mute(mute);
		}
	}
	function _clickMuteOthers(uid) {
		const s = VideoSettings.load();
		if (false !== s.video.confirmMuteOthers) {
			const dlg = $('#muteothers-confirm');
			dlg.dialog({
				buttons: [
					{
						text: dlg.data('btn-ok')
						, click: function() {
							s.video.confirmMuteOthers = !$('#muteothers-confirm-dont-show').prop('checked');
							VideoSettings.save();
							roomAction('muteOthers', uid);
							$(this).dialog('close');
						}
					}
					, {
						text: dlg.data('btn-cancel')
						, click: function() {
							$(this).dialog('close');
						}
					}
				]
			})
		}
	}
	function _muteOthers(uid) {
		const windows = $(VID_SEL + ' .ui-dialog-content');
		for (let i = 0; i < windows.length; ++i) {
			const w = $(windows[i]);
			w.data().mute('room' + uid !== w.data('client-uid'));
		}
	}

	self.init = _init;
	self.update = _update;
	self.play = _play;
	self.close = _close;
	self.securityMode = function(uid) { $('#' + VideoUtil.getVid(uid)).data().securityMode(); };
	self.swfLoaded = function(uid) { $('#' + VideoUtil.getVid(uid)).data().swfLoaded(); };
	self.refresh = _refresh;
	self.mute = _mute;
	self.clickMuteOthers = _clickMuteOthers;
	self.muteOthers = _muteOthers;
	self.micActivity = function(active) {
		OmUtil.sendMessage({
			area: 'room'
			, type: 'mic'
			, id: 'activity'
			, active: active
		});
	};
	self.destroy = function() {
		Wicket.Event.unsubscribe('/websocket/message', _onWsMessage);
	}
	return self;
})();
/* Licensed under the Apache License, Version 2.0 (the "License") http://www.apache.org/licenses/LICENSE-2.0 */
var Room = (function() {
	const self = {}, sbSide = Settings.isRtl ? 'right' : 'left';
	let options, menuHeight, chat, sb, dock, activities;

	function _init(_options) {
		options = _options;
		window.WbArea = options.interview ? InterviewWbArea() : DrawWbArea();
		const menu = $('.room.box .room.menu');
		chat = $('#chatPanel');
		activities = $('#activities');
		sb = $('.room.sidebar').css(sbSide, '0px');
		dock = sb.find('.btn-dock').button({
			icon: "ui-icon icon-undock"
			, showLabel: false
		}).click(function() {
			const offset = parseInt(sb.css(sbSide));
			if (offset < 0) {
				sb.removeClass('closed');
			}
			dock.button('option', 'disabled', true);
			const props = {};
			props[sbSide] = offset < 0 ? '0px' : (-sb.width() + 45) + 'px';
			sb.animate(props, 1500
				, function() {
					dock.button('option', 'disabled', false)
						.button('option', 'icon', 'ui-icon ' + (offset < 0 ? 'icon-undock' : 'icon-dock'));
					if (offset < 0) {
						dock.attr('title', dock.data('ttl-undock'));
						_sbAddResizable();
					} else {
						dock.attr('title', dock.data('ttl-dock'));
						sb.addClass('closed').resizable('destroy');
					}
					_setSize();
				});
		});
		dock.addClass(Settings.isRtl ? 'align-left' : 'align-right').attr('title', dock.data('ttl-undock'))
			.button('option', 'label', dock.data('ttl-undock'))
			.button('refresh');
		menuHeight = menu.length === 0 ? 0 : menu.height();
		VideoManager.init();
		if (typeof(Activities) !== 'undefined') {
			Activities.init();
		}
		sb.on("remove", function () {
			$('.ui-dialog.user-video .ui-dialog-content').each(function() {
				const v = $(this).data();
				v.cleanup();
				$(this).remove()
			});
		});
	}
	function _getSelfAudioClient() {
		const vw = $('#video' + Room.getOptions().uid);
		if (vw.length > 0) {
			const v = vw.data();
			if (VideoUtil.hasAudio(v.client())) {
				return v;
			}
		}
		return null;
	}
	function _preventKeydown(e) {
		const base = $(e.target);
		if (e.target.isContentEditable === true || base.is('textarea, input:not([readonly]):not([type=radio]):not([type=checkbox])')) {
			return;
		}
		switch (e.which) {
			case 8:  // backspace
				e.preventDefault();
				e.stopImmediatePropagation();
				return false;
		}
	}
	function __keyPressed(hotkey, e) {
		const code = OmUtil.getKeyCode(e);
		return hotkey.alt === e.altKey
			&& hotkey.ctrl === e.ctrlKey
			&& hotkey.shift === e.shiftKey
			&& hotkey.code.toUpperCase() === (code ? code.toUpperCase() : '');
	}
	function _keyHandler(e) {
		if (__keyPressed(options.keycode.arrange, e)) {
			VideoUtil.arrange();
		} else if (__keyPressed(options.keycode.muteothers, e)) {
			const v = _getSelfAudioClient();
			if (v !== null) {
				VideoManager.clickMuteOthers(Room.getOptions().uid);
			}
		} else if (__keyPressed(options.keycode.mute, e)) {
			const v = _getSelfAudioClient();
			if (v !== null) {
				v.mute(!v.isMuted());
			}
		} else if (__keyPressed(options.keycode.quickpoll, e)) {
			quickPollAction('open');
		}
		if (e.which === 27) {
			$('#wb-rename-menu').hide();
		}
	}
	function _mouseHandler(e) {
		if (e.which === 1) {
			$('#wb-rename-menu').hide();
		}
	}
	function _sbWidth() {
		if (sb === undefined) {
			sb = $('.room.sidebar');
		}
		return sb === undefined ? 0 : sb.width() + parseInt(sb.css(sbSide));
	}
	function _setSize() {
		const tw = window.innerWidth
			, th = window.innerHeight
			, sbW = _sbWidth()
			, w = tw - sbW - 8
			, ah = !!activities && activities.is(':visible') ? activities.height() : 0
			, h = th - menuHeight - 3
			, hh = h - 5
			, p = sb.find('.tabs')
			, ulh = $("ul", p).height()
			, holder = $('.room.holder')
			, fl = $('.file.list', p);
		sb.height(h - ah);
		p.height(hh - ah);
		$('.user.list', p).height(hh - ulh - ah - $('.user.header', p).height() - 5);
		$('.trees', fl).height(hh - ulh - ah - $('.trash-toolbar', fl).height() - $('.footer', fl).height() - 5);
		if (sbW > 255) {
			holder.addClass('big').removeClass('small');
		} else {
			holder.removeClass('big').addClass('small');
		}
		Chat.setHeight(h);
		if (typeof(WbArea) !== 'undefined') {
			const chW = chat.width();
			WbArea.resize(sbW + 5, chW + 5, w - chW, h);
		}
	}
	function _reload() {
		if (!!options && !!options.reloadUrl) {
			window.location.href = options.reloadUrl;
		} else {
			window.location.reload();
		}
	}
	function _close() {
		_unload();
		$(".room.holder").remove();
		$("#chatPanel").remove();
		const dlg = $('#disconnected-dlg');
		dlg.dialog({
			modal: true
			, close: _reload
			, buttons: [
				{
					text: dlg.data('reload')
					, icons: {primary: "ui-icon-refresh"}
					, click: function() {
						$(this).dialog("close");
					}
				}
			]
		});
	}
	function _sbAddResizable() {
		sb.resizable({
			handles: Settings.isRtl ? 'w' : 'e'
			, stop: function() {
				_setSize();
			}
		});
	}
	function _load() {
		if (sb !== undefined) {
			sb.ready(function() {
				_setSize();
			});
			_sbAddResizable();
		}
		$(window).on('resize.openmeetings', _setSize);
		Wicket.Event.subscribe("/websocket/closed", _close);
		Wicket.Event.subscribe("/websocket/error", _close);
		$(window).on('keydown.openmeetings', _preventKeydown);
		$(window).on('keyup.openmeetings', _keyHandler);
		$(document).click(_mouseHandler);
	}
	function _unload() {
		$(window).off('resize.openmeetings');
		Wicket.Event.unsubscribe("/websocket/closed", _close);
		Wicket.Event.unsubscribe("/websocket/error", _close);
		if (typeof(WbArea) !== 'undefined') {
			WbArea.destroy();
			window.WbArea = undefined;
		}
		if (typeof(VideoSettings) !== 'undefined') {
			VideoSettings.close();
		}
		if (typeof(VideoManager) === 'object') {
			VideoManager.destroy();
		}
		const _qconf = $('#quick-confirmation');
		if (_qconf.dialog('instance')) {
			_qconf.dialog('destroy');
		}
		$('.ui-dialog.user-video').remove();
		$(window).off('keyup.openmeetings');
		$(window).off('keydown.openmeetings');
		$(document).off('click', _mouseHandler);
		sb = undefined;
	}
	function _showClipboard(txt) {
		const dlg = $('#clipboard-dialog');
		dlg.find('p .text').text(txt);
		dlg.dialog({
			resizable: false
			, height: "auto"
			, width: 400
			, modal: true
			, buttons: [
				{
					text: dlg.data('btn-ok')
					, click: function() {
						$(this).dialog('close');
					}
				}
			]
		});
	}
	function _setQuickPollRights() {
		const close = $('#quick-vote .close');
		if (close.length === 1) {
			close.off();
			if (options.rights.includes('superModerator') || options.rights.includes('moderator') || options.rights.includes('presenter')) {
				close.show().click(function() {
					const _qconf = $('#quick-confirmation');
					_qconf.dialog({
						resizable: false
						, height: "auto"
						, width: 400
						, modal: true
						, buttons: [
							{
								text: _qconf.data('btn-ok')
								, click: function() {
									quickPollAction('close');
									$(this).dialog('close');
								}
							}
							, {
								text: _qconf.data('btn-cancel')
								, click: function() {
									$(this).dialog('close');
								}
							}
						]
					});
				});
			} else {
				close.hide();
			}
		}
	}
	function _quickPoll(obj) {
		if (obj.started) {
			let qv = $('#quick-vote');
			if (qv.length === 0) {
				const wbArea = $('.room.wb.area');
				qv = OmUtil.tmpl('#quick-vote-template', 'quick-vote');
				wbArea.append(qv);
			}
			const pro = qv.find('.control.pro')
				con = qv.find('.control.con');
			if (obj.voted) {
				pro.removeClass('clickable').off();
				con.removeClass('clickable').off();
			} else {
				pro.addClass('clickable').off().click(function() {
					quickPollAction('vote', true);
				});
				con.addClass('clickable').off().click(function() {
					quickPollAction('vote', false);
				});
			}
			pro.find('.badge').text(obj.pros);
			con.find('.badge').text(obj.cons);
			_setQuickPollRights();
		} else {
			const qv = $('#quick-vote');
			if (qv.length === 1) {
				qv.remove();
			}
		}
		OmUtil.tmpl('#quick-vote-template', 'quick-vote');
	}

	self.init = _init;
	self.getMenuHeight = function() { return menuHeight; };
	self.getOptions = function() { return typeof(options) === 'object' ? JSON.parse(JSON.stringify(options)) : {}; };
	self.setRights = function(_r) {
		options.rights = _r;
		_setQuickPollRights();
	};
	self.setSize = _setSize;
	self.load = _load;
	self.unload = _unload;
	self.showClipboard = _showClipboard;
	self.quickPoll = _quickPoll;
	return self;
})();
function startPrivateChat(el) {
	Chat.addTab('chatTab-u' + el.parent().parent().data("userid"), el.parent().parent().find('.user.name').text());
	Chat.open();
	$('#chatMessage .wysiwyg-editor').click();
}
/***** functions required by SIP   ******/
function sipBtnClick() {
	const txt = $('.sip-number');
	txt.val(txt.val() + $(this).data('value'));
}
function sipBtnEraseClick() {
	const txt = $('.sip-number')
		, t = txt.val();
	if (!!t) {
		txt.val(t.substring(0, t.length - 1));
	}
}
function sipGetKey(evt) {
	let k = -1;
	if (evt.keyCode > 47 && evt.keyCode < 58) {
		k = evt.keyCode - 48;
	}
	if (evt.keyCode > 95 && evt.keyCode < 106) {
		k = evt.keyCode - 96;
	}
	return k;
}
function sipKeyDown(evt) {
	const k = sipGetKey(evt);
	if (k > 0) {
		$('#sip-dialer-btn-' + k).addClass('ui-state-active');
	}
}
function sipKeyUp(evt) {
	const k = sipGetKey(evt);
	if (k > 0) {
		$('#sip-dialer-btn-' + k).removeClass('ui-state-active');
	}
}
/***** functions required by SWF   ******/
function typingActivity(uid, active) {
	const u = $('#user' + uid + ' .typing-activity.ui-icon');
	if (active) {
		u.addClass("typing");
	} else {
		u.removeClass("typing");
	}
}
