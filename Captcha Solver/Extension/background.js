browser.browserAction.onClicked.addListener(async () => {
  try {
    const screenshot = await browser.tabs.captureVisibleTab(null, { format: "png" });
    const prompt = "Describe everything visible in this screenshot.";

    const resp = await fetch("https://your-app.onrender.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_EXTENSION_TOKEN" // same token as EXTENSION_TOKEN env var on server
      },
      body: JSON.stringify({ image: screenshot, prompt })
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error('Server error', data);
      alert('Server error: ' + (data.error || 'Unknown'));
      return;
    }

    console.log('Server replied:', data);
    alert('Analysis:\n\n' + JSON.stringify(data.output, null, 2));

  } catch (err) {
    console.error('Error:', err);
    alert('Error: ' + err.message);
  }
});
