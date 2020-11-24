var counter = 0
chrome.webNavigation.onCompleted.addListener(function({tabid, url}) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log(request.message)
        var httpRequest = new XMLHttpRequest()
        httpRequest.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                const obj = JSON.parse(this.responseText)
                //console.log(obj.title)
                if(obj.notify){
                    var notifOptions = {
                        type: 'basic',
                        iconUrl: 'icon_128.png',
                        title: obj.title,
                        message: obj.description
                    }
                    chrome.notifications.create(`id${counter}`, notifOptions, function(id){
                        chrome.storage.local.set({[`${id}`]: obj.link}, function() {
                            console.log(`[${id}] Value is set to ${obj.link}`);
                        });
                        counter++
                    })
                }
            }
        }
        var data = {
            site: url,
            title: request.message
        }
        httpRequest.open("POST", 'http://localhost:3333');
        httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        httpRequest.send(JSON.stringify(data));
    })
})

chrome.notifications.onClicked.addListener(function (id){
    chrome.storage.local.get(`${id}` , function(result) {
        chrome.tabs.create({url: result[id]});
      });
})

