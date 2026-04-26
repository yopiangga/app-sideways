const feedid = require('./modules/feedid');

feedid.tempo.bisnis().then((res) => {
    console.log(res.data.posts);
});