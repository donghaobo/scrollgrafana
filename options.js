// Saves options to chrome.storage
function save_options() {
  var switch_interval = document.getElementById('switch_interval').value;
  var job_interval = document.getElementById('job_interval').value;
  var job_end_wait = document.getElementById('job_end_wait').value;
  var job_start_wait = document.getElementById('job_start_wait').value;
  chrome.storage.sync.set({
    switch_interval: switch_interval,
    job_interval: job_interval,
    job_end_wait: job_end_wait,
    job_start_wait: job_start_wait
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    switch_interval: 60,
    job_interval: 200,
    job_end_wait: 2000,
    job_start_wait: 2000
  }, function(items) {
      document.getElementById('switch_interval').value = items.switch_interval;
      document.getElementById('job_interval').value = items.job_interval;
      document.getElementById('job_end_wait').value = items.job_end_wait;
      document.getElementById('job_start_wait').value = items.job_start_wait;
  });
}
function start_switch() {
    save_options();
    chrome.runtime.sendMessage({msg:"start_switch"});
    document.getElementById('status').textContent = "switching";
}
function stop_switch() {
    save_options();
    document.getElementById('status').textContent = "waiting scroll end...";
    chrome.runtime.sendMessage({msg:"stop_switch"});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('start').addEventListener('click', start_switch);
document.getElementById('stop').addEventListener('click', stop_switch);

