export function getOutlookUrl(email, subject = '', body = '') {
  const encSubject = encodeURIComponent(subject);
  const encBody = encodeURIComponent(body);
  return `https://outlook.live.com/default.aspx?rru=compose&to=${email}&subject=${encSubject}&body=${encBody}`;
}

export function handleMailClick(e, email, subject = '', body = '') {
  // Detect mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!isMobile) {
    e.preventDefault();
    const url = getOutlookUrl(email, subject, body);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
