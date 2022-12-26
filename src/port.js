var backgroundPageConnection = chrome.runtime.connect({
  name: "panel",
})
debugger
backgroundPageConnection.postMessage({
  name: "init",
  tabId: chrome.devtools.inspectedWindow.tabId,
})

export default backgroundPageConnection
