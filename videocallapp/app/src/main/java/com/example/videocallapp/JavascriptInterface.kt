package com.example.videocallapp

import android.webkit.JavascriptInterface

class JavascriptInterface(val callActivity: CallActivity) {

    @JavascriptInterface
    public fun onPeerConnected() {
        callActivity.onPeerConnected()
    }

    @JavascriptInterface
    public fun onCallReceived() {
        callActivity.onCallReceived()
    }

    @JavascriptInterface
    public fun onStreamReceived() {
        callActivity.onStreamReceived()
    }

}