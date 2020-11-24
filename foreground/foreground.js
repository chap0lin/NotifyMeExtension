let title = document.getElementsByTagName('title')
console.log(title[0].innerText)
chrome.runtime.sendMessage({message: title[0].innerText})