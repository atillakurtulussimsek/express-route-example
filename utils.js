const config = require('./config');
const moment = require('moment-timezone');

exports.getIP = (req) => {
  return (typeof req.headers['x-forwarded-for'] === 'string' && req.headers['x-forwarded-for'].split(',').shift()) || req.connection?.remoteAddress || req.socket?.remoteAddress || req.connection?.socket?.remoteAddress;
};

exports.getTime = (Clean = false) => {
  if(Clean == true){ return moment().tz("Europe/Istanbul").format("HH:mm:ss"); }else{ return "**``[" + moment().tz("Europe/Istanbul").format("HH:mm:ss") + "]``**"; }
}

exports.getDate = (Clean = false) => {
    if(Clean == true){ return moment().tz("Europe/Istanbul").format("DD.MM.YYYY"); }else{ return "**``[" + moment().tz("Europe/Istanbul").format("DD.MM.YYYY") + "]``**"; }
}

exports.skipLog = (req, res) => {
    var url = req.url;
    if (url.indexOf('?') > 0)
        url = url.substr(0, url.indexOf('?'));
    if (url.match(/(js|jpg|png|ico|css|woff|woff2|eot|map)$/ig)) {
        return true;
    }
    return false;
}
