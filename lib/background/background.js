// context-menu
chrome.contextMenus.create({
    title: "屏蔽用户\"%s\"",
    contexts: ["selection"],
    onclick: (info, tab) => {
        var newStupid = info.selectionText;
        if (newStupid == "匿名用户")
            return;

        chrome.storage.sync.get(['stupids'], (item) => {
            if (item.stupids === undefined)
                chrome.storage.sync.set({ 'stupids': [newStupid] });
            else {
                if (item.stupids.indexOf(newStupid) == -1) {
                    item.stupids.push(newStupid);
                    chrome.storage.sync.set({ 'stupids': item.stupids });
                }
            }
        });
    },
    documentUrlPatterns: ["https://*.zhihu.com/*"]
});

// reload
// chrome.storage.onChanged.addListener((changes, areaName) => {
//     chrome.tabs.reload();
// });


chrome.runtime.onInstalled.addListener(function () {
    // storage inits
    // show icon in the url address
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostContains: 'zhihu' },
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });

    let init_stupids = []
    chrome.storage.sync.get(['stupids', 'anonymity-filter'], (items) => {
        if (items['anonymity-filter'] === undefined) {
            chrome.storage.sync.set({ 'anonymity-filter': false });
        }

        if (items.stupids === undefined) {
            chrome.storage.sync.set({ 'stupids': init_stupids });
        }
    });
});
