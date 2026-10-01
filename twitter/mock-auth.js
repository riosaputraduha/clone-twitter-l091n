const state = new URL(location.href).searchParams.get('state');
const status = document.querySelector('#status');

if (!window.opener || !state || !/^[0-9a-f-]{36}$/i.test(state)) {
  document.querySelectorAll('button, input').forEach((control) => { control.disabled = true; });
  status.textContent = 'Open this demo using Continue with Google on the local page.';
} else {
  function sendResult(result) {
    window.opener.postMessage({
      type: 'mock-oauth-callback',
      state,
      status: result,
      ...(result === 'success' ? { code: `mock-${crypto.randomUUID()}` } : {}),
    }, location.origin);
    status.textContent = result === 'success'
      ? 'Mock callback sent. You can close this window.'
      : 'Cancellation sent. You can close this window.';
    window.close();
  }

  document.querySelector('#mock-form').addEventListener('submit', (event) => {
    event.preventDefault();
    sendResult('success');
  });
  document.querySelector('#cancel').addEventListener('click', () => sendResult('cancelled'));
}
