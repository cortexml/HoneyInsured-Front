var HAS_CHAT = false;


/***************************
 * Helper functions to generate
 * uuid and formatted date
 ***************************/
function getFormattedDate() {
  function pad(num) {
    var s = num + "";
    while (s.length < 2)
    s = "0" + s;
    return s;
  }

  // Pacific Time
  var date = new Date(Date.now() - (new Date().getTimezoneOffset()) * 1000 + 420000);
  var str = date.getFullYear() + "-" + pad((date.getMonth() + 1)) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
  return str;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  return getFormattedDate() + ' ' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ')
    c = c.substring(1);
    if (c.indexOf(name) == 0)
      return c.substring(name.length, c.length);
  }
  return null;
}

function isApp() {
  return ['/recommend.html', '/info.html', '/enroll.html', '/track.html'].indexOf(document.location.pathname) > -1;
}

/***************************
 * Check and generate uuid
 ***************************/
var uuid = getCookie('userId');
!uuid && ( uuid = guid());
setCookie('userId', uuid, 365);

/***************************
 * Adroll
 ***************************/
adroll_adv_id = "YWA7HE2HNNAHDI5CN7KQTD";
adroll_pix_id = "II34ABFD5JCGHBPZUCC34R"; ( function() {
    var _onload = function() {
      if (document.readyState && !/loaded|complete/.test(document.readyState)) {
        setTimeout(_onload, 10);
        return
      }
      if (!window.__adroll_loaded) {
        __adroll_loaded = true;
        setTimeout(_onload, 50);
        return
      }
      var scr = document.createElement("script");
      var host = (("https:" == document.location.protocol) ? "https://s.adroll.com" : "http://a.adroll.com");
      scr.setAttribute('async', 'true');
      scr.type = "text/javascript";
      scr.src = host + "/j/roundtrip.js";
      ((document.getElementsByTagName('head') || [null])[0] || document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
    };
    if (window.addEventListener) {
      window.addEventListener('load', _onload, false);
    } else {
      window.attachEvent('onload', _onload)
    }
  }());

/***************************
 * Perfect Audience
 ***************************/
(function() {
  window._pa = window._pa || {};
  // _pa.orderId = "myOrderId"; // OPTIONAL: attach unique conversion identifier to conversions
  // _pa.revenue = "19.99"; // OPTIONAL: attach dynamic purchase values to conversions
  // _pa.productId = "myProductId"; // OPTIONAL: Include product ID for use with dynamic ads
  var pa = document.createElement('script');
  pa.type = 'text/javascript';
  pa.async = true;
  pa.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + "//tag.marinsm.com/serve/563647cf6d7d61e2760000be.js";
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(pa, s);
})();

/***************************
 * Google analytics
 ***************************/
(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] ||
  function() {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
  m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-51673641-2', {
  'userId' : uuid
});
ga('set', 'dimension1', uuid);
ga('send', 'pageview');

/***************************
 * Mix Panel
 ***************************/
(function(f, b) {
  if (!b.__SV) {
    var a,
        e,
        i,
        g;
    window.mixpanel = b;
    b._i = [];
    b.init = function(a, e, d) {
      function f(b, h) {
        var a = h.split(".");
        2 == a.length && ( b = b[a[0]],
        h = a[1]);
        b[h] = function() {
          b.push([h].concat(Array.prototype.slice.call(arguments, 0)))
        }
      }

      var c = b;
      "undefined" !== typeof d ? c = b[d] = [] : d = "mixpanel";
      c.people = c.people || [];
      c.toString = function(b) {
        var a = "mixpanel";
        "mixpanel" !== d && (a += "." + d);
        b || (a += " (stub)");
        return a
      };
      c.people.toString = function() {
        return c.toString(1) + ".people (stub)"
      };
      i = "disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
      for ( g = 0; g < i.length; g++)
        f(c, i[g]);
      b._i.push([a, e, d])
    };
    b.__SV = 1.2;
    a = f.createElement("script");
    a.type = "text/javascript";
    a.async = !0;
    a.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
    e = f.getElementsByTagName("script")[0];
    e.parentNode.insertBefore(a, e)
  }
})(document, window.mixpanel || []);
mixpanel.init("73a4eb6c8d6921332d3501dc6af87640");
mixpanel.identify(uuid);

/****************************
 * Facebook Conversion Tracking
 ****************************/
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','//connect.facebook.net/en_US/fbevents.js');

fbq('init', '1615684582027634');
fbq('track', "PageView");

/***************************
 * Inspectlet
 ***************************/
window.__insp = window.__insp || [];
__insp.push(['wid', 1455510574]);
(function() {
  function __ldinsp() {
    var insp = document.createElement('script');
    insp.type = 'text/javascript';
    insp.async = true;
    insp.id = "inspsync";
    insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(insp, x);
  };
  document.readyState != "complete" ? (window.attachEvent ? window.attachEvent('onload', __ldinsp) : window.addEventListener('load', __ldinsp, false)) : __ldinsp();
})();
__insp.push(['tagSession', {
  userId : uuid
}]);
getCookie('email') && __insp.push(['tagSession', {
  email : getCookie('email')
}]);

/***************************
 * Zopim
 ***************************/
// only show zopim on front page
if (HAS_CHAT && !isApp() && !getCookie('email')) {
  window.$zopim || (function(d, s) {
    var z = $zopim = function(c) {
      z._.push(c)
    },
        $ = z.s = d.createElement(s),
        e = d.getElementsByTagName(s)[0];
    z.set = function(o) {
      z.set._.push(o)
    };
    z._ = [];
    z.set._ = [];
    $.async = !0;
    $.setAttribute("charset", "utf-8");
    $.src = "//v2.zopim.com/?3Bt42CkELrzU54Ua1ELOC0zA88s1cfkd";
    z.t = +new Date;
    $.type = "text/javascript";
    e.parentNode.insertBefore($, e)
  })(document, "script");
  $zopim(function() {
    $zopim.livechat.addTags(uuid);
    $zopim.livechat.offlineForm.setGreetings('Please leave us a message and we will get back to you as soon as possible.');
  });
};

/***************************
 * Intercom
 ***************************/
window.intercomSettings = {
  app_id : "g13pbvbf"
};
if (getCookie('email')) {
  window.intercomSettings.email = getCookie('email');
  window.intercomSettings.user_id = uuid;
} else if (isApp()) {
  window.intercomSettings.user_id = uuid;
}

(function() {
  var w = window;
  var ic = w.Intercom;
  if ( typeof ic === "function") {
    ic('reattach_activator');
    ic('update', intercomSettings);
  } else {
    var d = document;
    var i = function() {
      i.c(arguments)
    };
    i.q = [];
    i.c = function(args) {
      i.q.push(args)
    };
    w.Intercom = i;
    function l() {
      var s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://widget.intercom.io/widget/g13pbvbf';
      var x = d.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    }

    if (w.attachEvent) {
      w.attachEvent('onload', l);
    } else {
      w.addEventListener('load', l, false);
    }
  }
})();

if (HAS_CHAT && (isApp() || getCookie('email'))) {
  window.intercomSettings.widget = {
    activator : "#IntercomDefaultWidget"
  };
};

// allow click to chat founder
$(function() {
  $('#chat,#footer-chat-us').click(function() {
    if (isApp() || getCookie('email')) {
      Intercom('showNewMessage');
    } else {
      $zopim(function() {
        $zopim.livechat.window.show();
      });
    }
  });
});

// allow for signups
window.updateUser = function(evt, email, meta) {
  // record email in cookie
  getCookie('email') && getCookie('email') != email && (evt += ' change');
  setCookie('email', email, 365);

  // log insp
  __insp.push(['tagSession', evt]);
  __insp.push(['tagSession', {
    email : email
  }]);

  // update intercom
  var opts = {
    user_id : uuid,
    email : email,
  };

  // update mixpanel
  mpOpts = {
    "$email" : email
  }

  meta && meta.name && (opts.name = meta.name, mpOpts.$first_name = meta.name);
  mixpanel.people.set(mpOpts);
  Intercom('update', opts);
  meta && _.map(meta, function(v, k) {
    opts[k] = v;
  });
  delete opts.user_id;
  Intercom('trackEvent', evt, opts);
};

/***************************
 * Helpers
 ***************************/
// allow for events
window.tagEvent = function(evt, meta) {
  meta = meta || {};
  !meta.location && (meta.location = document.location.href);
  Intercom('trackEvent', evt, meta);
  // __insp.push(['tagSession', evt]);
  mixpanel.track(evt, meta);
  
  // facebook conversion
  if (evt=='page-recommend'){
    fbq('track', 'Lead'); 
  } else if (evt=='zip try'){
    fbq('track', 'Search');
  }
  
};
// automatically tag pages
var page = window.location.pathname.replace('.html', '').slice(1);
window.tagEvent('page-' + (page == '' ? 'index' : page));

// reporting bugs
window.reportBug = function(bug, err) {
  $.ajax({
    type : "POST",
    url : 'https://api.parse.com/1/functions/reportBug',
    data : {
      location : document.location.href,
      type : bug,
      err : err ? err : ''
    },
    dataType : "application/json",
    headers : {
      "X-Parse-Application-Id" : "1pa127tz0MzdcjTZlt4TvI4AFuexlUkUZz1hAIKD",
      "X-Parse-REST-API-Key" : "G9Rkm3bdqr1ifN00aHeDY2M0U7ebSN4TPEdvL245"
    }
  });
  window.tagEvent('bug', {
    type : bug,
    err : err
  });
};

// record zipcode
window.recordZipcode = function(zipcode, state, pushChanges, isSuccess) {
  var prevZip = getCookie('prevZip');
  var prevZips = (getCookie('allZips') && JSON.parse(getCookie('allZips'))) || [];
  var opts = {
    zip : zipcode,
    state : state
  };
  var tagName = 'Zip' + ( isSuccess ? '' : ' Fail');
  pushChanges == getCookie('email') || pushChanges;
  if (pushChanges) {
    // push previous ones to server
    _.map(prevZips, function(zs, index) {
      if (index > 0 && zs[0] != prevZips[index-1][0]) {
        window.tagEvent(zs[2] + ' Change', {
          zip : zs[0],
          state : zs[1]
        });
      } else {
        window.tagEvent(zs[2], {
          zip : zs[0],
          state : zs[1]
        });
      }
      // reset all cached zips
      setCookie('allZips', [], 365);
    });
    window.setTimeout(function() {
      if (prevZip && zipcode != prevZip) {
        window.tagEvent(tagName + ' Change', opts);
      } else {
        window.tagEvent(tagName, opts);
      }
    }, 1000);
  } else {
    prevZips.push([zipcode, state, tagName])
    setCookie('allZips', JSON.stringify(prevZips), 365);
  }

  setCookie('prevZip', [zipcode, state], 365);
  var prevStates = getCookie('prevStates') ? getCookie('prevStates') + ',' + state : state;
  setCookie('prevStates', prevStates, 365);
};

/***************************
 * Tag chat on open
 ***************************/
Intercom('onShow', function() {
  window.tagEvent('Open Chat');
});

/***************************
 * Get referrals for tagging
 ***************************/
var queryParams = window.getJsonFromUrl();
if (queryParams.ref) {
  var p = window.decodeJson(queryParams.ref);
  p.email && window.updateUser('referral', p.email, _.chain(p).pairs().filter(function(x) {
    return x[0] != 'email'
  }).object().value());
};

