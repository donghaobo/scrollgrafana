scrollstep = 10
job_interval = 200
job_end_wait = 2000
job_start_wait = 2000

nextpos = 0
function scrollPage() {
    elm = document.getElementsByClassName("dashboard-container")[0];
    if (!elm || !elm.parentElement) {
        return 1;
    }
    elm = elm.parentElement;
    elm.scrollTo(0, nextpos);
    cur = elm.scrollTop
    if (cur < nextpos) {
        nextpos = 0;
        return 1;
    }
    nextpos += scrollstep;
    return 0;
}
function do_job() {
    finished = scrollPage();
    console.log("job return " + finished);
    if (finished) {
        setTimeout(function() {
            console.log("send end msg ");
            chrome.runtime.sendMessage({msg: "end"});
        }, job_end_wait);
    } else {
        setTimeout(do_job, job_interval);
    }
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.msg == "start") {
      chrome.storage.sync.get({
        job_interval: 200,
        job_start_wait: 2000,
        job_end_wait: 2000
      }, function(items) {
          job_interval = items.job_interval;
          job_end_wait = items.job_end_wait;
          job_start_wait = items.job_start_wait;
      });
      setTimeout(do_job, job_start_wait);
      sendResponse({msg: "ok"});
    }
  });
