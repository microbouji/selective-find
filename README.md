#  Selective Find

This is a chrome extension that lets you narrow down your find-on-page searches (CTRL+F) by specifying, through a css selector, the exact elements inside of which you want to search. For example, writing `pre code` in the selector field allows you to search only inside the code examples of a long documentation page (this was my original motivation for writing this).

I haven't published it to the chrome web store, so to use it you'll need to download the code here, put it in a folder, and use the "Load unpacked" button from the extensions page. Once installed, `CTRL+SHIFT+F` will open the popup.

## Potential TODOs for future versions:

- Store user input to prepopulate when popup is closed and opened again
- Use chrome debugger APIs for highlighting matches instead of text selection
