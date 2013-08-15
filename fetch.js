module.exports = (function () {
  "use strict"

  return function (html) {

    var title = html.match(/\<title\>(.*?)\<\/title\>/)
      , meta = html.match(/\<meta\s(.*?)\/?\>/g)
      , description;


    for (var i = meta.length; i--;) {
      if(meta[i].indexOf('name="description"') > -1 || meta[i].indexOf('name="Description"') > -1){
        description = meta[i].match(/content\=\"(.*?)\"/)[1];
      }
    }

    if (!title) title = 'No Title';
    if (!description) description = 'No Description';

    return {
      title: title[1],
      description: description
    };
  };

})();
