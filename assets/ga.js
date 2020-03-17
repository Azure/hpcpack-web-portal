$(() => {
  if (window.location.search && document.referrer) {
    let params = new URLSearchParams(window.location.search);
    let ver = params.get('myVersion');
    if (ver) {
      let url = new URL(document.referrer);
      let hostname = url.hostname;
      gtag('event', 'checkUpdate', {
        event_category: hostname,
        event_label: ver
      });
    }
  }
});
