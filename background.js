// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var stop_switch = 0
chrome.alarms.onAlarm.addListener(function () {
    console.log("timeout refresh");
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        console.log("timeout reload");
        if (tabs[0]) {
            chrome.tabs.reload(tabs[0].id);
        }
    });
    switch_tab();
});
function switch_tab() {
    chrome.alarms.clear('timeout');
    if (stop_switch) {
        return;
    }
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        if (!tabs[0]) {
            return;
        }
        // Sort tabs according to their index in the window.
        tabs.sort((a, b) => { return a.index < b.index; });
        let activeIndex = tabs.findIndex((tab) => { return tab.active; });
        let lastTab = tabs.length - 1;
        let newIndex = -1;
        newIndex = activeIndex === 0 ? lastTab : activeIndex - 1;
        console.log("switch to idx:" + newIndex + ", url:" + tabs[newIndex].url);
        chrome.tabs.update(tabs[newIndex].id, {active: true, highlighted: true});
        chrome.tabs.sendMessage(tabs[newIndex].id, {msg: "start"});
        chrome.storage.sync.get({
            switch_interval: 120
        }, function(items) {
            chrome.alarms.create('timeout', {delayInMinutes: items.switch_interval / 60.0})
        });
    });
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request) {
            if (request.msg == "stop_switch") {
                stop_switch = 1;
                sendResponse({msg: "ok"});
            } else if (request.msg == "start_switch") {
                stop_switch = 0;
                switch_tab();
                sendResponse({msg: "ok"});
            }
        }
        if (sender.tab && sender.tab.active) {
            console.log("from a content script:" + sender.tab.url + ", received " + request.msg);
            if (request.msg == "end") {
                sendResponse({msg: "goodbye"});
                switch_tab();
            }
        }
    }
);

