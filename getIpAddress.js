/*
exports.getIpAddress = async (browserContext) => {
    
    const page = await browserContext.newPage()
    await page.goto("https://api.ipify.org", {
        waitUntil: 'load'
    })
    
    const ip = await page.evaluate("document.querySelectorAll('pre')[0].innerHTML;");
    console.log("2")
    await page.close()
    console.log("IP Address:", ip);
    return ip
}
*/