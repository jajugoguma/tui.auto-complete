module.exports = {
  downloads: function(pkg) {
    var extensions = ['.js', '.min.js'];
    var result = {};
    var i, len, filename;

    for (i = 0, len = extensions.length; i < len; i += 1) {
      filename = pkg.name + extensions[i];
      result[filename] = 'https://uicdn.toast.com/' + pkg.name + '/v' + pkg.version + '/' + filename;
    }

    return result;
  }
};