cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/nl.x-services.plugins.socialsharing/www/SocialSharing.js",
        "id": "nl.x-services.plugins.socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/cc.fovea.cordova.purchase/www/store-ios.js",
        "id": "cc.fovea.cordova.purchase.InAppPurchase",
        "clobbers": [
            "store"
        ]
    },
    {
        "file": "plugins/uk.co.ilee.gamecenter/www/gamecenter.js",
        "id": "uk.co.ilee.gamecenter.GameCenter",
        "clobbers": [
            "gamecenter"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.statusbar/www/statusbar.js",
        "id": "org.apache.cordova.statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "nl.x-services.plugins.socialsharing": "4.3.15",
    "cc.fovea.cordova.purchase": "3.10.1",
    "uk.co.ilee.gamecenter": "0.3.0",
    "org.apache.cordova.statusbar": "0.1.10",
    "org.apache.cordova.splashscreen": "1.0.0"
}
// BOTTOM OF METADATA
});