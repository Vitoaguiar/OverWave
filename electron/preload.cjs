const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("overwave", {
  version: "0.1.0",
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  setAlwaysOnTop: (enabled) => ipcRenderer.invoke("window:setAlwaysOnTop", enabled),
  setClickThrough: (enabled) => ipcRenderer.invoke("window:setClickThrough", enabled),
  loadDecks: () => ipcRenderer.invoke("decks:load"),
  saveDeck: (deck) => ipcRenderer.invoke("decks:save", deck),
  deleteDeck: (deckId) => ipcRenderer.invoke("decks:delete", deckId)
});
