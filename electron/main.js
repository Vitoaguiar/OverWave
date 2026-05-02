import { app, BrowserWindow, ipcMain } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow;

const getDecksFilePath = () => {
  if (app.isPackaged) {
    return path.join(app.getPath("userData"), "data", "decks.json");
  }

  return path.join(app.getAppPath(), "src", "data", "decks.json");
};

const readDecksFile = async () => {
  const filePath = getDecksFilePath();

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (Array.isArray(parsed?.decks)) {
      return parsed.decks;
    }
  } catch (error) {
    return [];
  }

  return [];
};

const writeDecksFile = async (decks) => {
  const filePath = getDecksFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify({ decks }, null, 2), "utf-8");
  return decks;
};

const sanitizeDeck = (deck) => {
  const id = typeof deck?.id === "string" ? deck.id.trim() : "";
  const name = typeof deck?.name === "string" ? deck.name.trim() : "";
  const owner = typeof deck?.owner === "string" ? deck.owner.trim() : "";

  if (!id || !name) {
    return null;
  }

  const picks = Array.isArray(deck?.picks) ? deck.picks : [];
  const totalPoints = Number.isFinite(Number(deck?.totalPoints))
    ? Number(deck?.totalPoints)
    : 0;
  const teamSize = Number.isFinite(Number(deck?.teamSize))
    ? Number(deck?.teamSize)
    : picks.length;
  const now = new Date().toISOString();

  return {
    id,
    name,
    owner,
    picks,
    totalPoints,
    teamSize,
    createdAt: typeof deck?.createdAt === "string" ? deck.createdAt : now,
    updatedAt: typeof deck?.updatedAt === "string" ? deck.updatedAt : now
  };
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, "overwaveicon.png"),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    minimizable: true,
    maximizable: true,
    resizable: true,
    closable: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("decks:load", async () => readDecksFile());

  ipcMain.handle("decks:save", async (_event, deck) => {
    const sanitized = sanitizeDeck(deck);
    if (!sanitized) {
      return readDecksFile();
    }

    const decks = await readDecksFile();
    const next = [sanitized, ...decks.filter((item) => item.id !== sanitized.id)];
    await writeDecksFile(next);
    return next;
  });

  ipcMain.handle("decks:delete", async (_event, deckId) => {
    const id = typeof deckId === "string" ? deckId.trim() : "";
    if (!id) {
      return readDecksFile();
    }

    const decks = await readDecksFile();
    const next = decks.filter((item) => item.id !== id);
    await writeDecksFile(next);
    return next;
  });

  ipcMain.handle("window:setAlwaysOnTop", (_event, enabled) => {
    if (mainWindow) {
      mainWindow.setAlwaysOnTop(Boolean(enabled), "screen-saver");
      return mainWindow.isAlwaysOnTop();
    }
    return false;
  });

  ipcMain.handle("window:setClickThrough", (_event, enabled) => {
    if (mainWindow) {
      mainWindow.setIgnoreMouseEvents(Boolean(enabled), { forward: true });
    }
    return true;
  });

  ipcMain.on("window:minimize", () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  ipcMain.on("window:maximize", () => {
    if (!mainWindow) return;

    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("window:close", () => {
    if (mainWindow) {
      mainWindow.close();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
