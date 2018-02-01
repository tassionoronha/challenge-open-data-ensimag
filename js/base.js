
$(window).on('hashchange', function () {
  routePage(window.location.hash);
}).trigger('hashchange');

function routePage(hash) {
  if (hash === "" || hash === "#") {
    path = "home";
  } else {
    path = hash.substr(1, hash.length - 1);
  }
  $("main").load("html/" + path + ".html", function (res, status) {
    if (status == "error") {
      $("main").load("html/error.html");
      highlightNavbar(null);
    } else {
      highlightNavbar(hash);
    }
  });
}

function highlightNavbar(hash) {
  var links = $(".nav > .navbar-nav > a");
  if (hash !== null) {
    if (hash === "" || hash === "#home") {
      hash = "#";
    }
    var slashIdx = hash.indexOf("/");
    if (slashIdx !== -1) {
      hash = hash.substr(slashIdx);
    }
    links = links.filter("[href=\"" + hash + "\"]").addClass("active").siblings();
  }
  links.removeClass("active");
}

function loadJSON(paths, callback) {
  var isArray = Array.isArray(paths);
  if (!isArray) {
    paths = [paths];
  }
  var promises = paths.map(function (x) {
    return $.ajax({
      url: x,
      dataType: "json"
    });
  });
  $.when(...promises).then(function () {
    var datas = Array.prototype.map.call(arguments, x => x[0]);
    if (!isArray) {
      datas = datas[0];
    }
    callback(null, datas);
  }, function (err) {
    callback(err);
  });
}
