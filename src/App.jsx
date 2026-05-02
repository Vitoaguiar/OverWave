import { useEffect, useMemo, useState } from "react";
import resonators from "./data/resonators.json";
import TournamentDraft from "./components/TournamentDraft";

const RESONATORS = resonators;

const LEVELS = ["c0", "c1", "c2", "c3", "c4", "c5", "c6"];
const LEVEL_LABELS = {
  c0: "C0",
  c1: "C1",
  c2: "C2",
  c3: "C3",
  c4: "C4",
  c5: "C5",
  c6: "C6"
};

const ELEMENT_ORDER = ["Aero", "Havoc", "Spectro", "Glacio", "Fusion", "Electro"];
const ELEMENT_SET = new Set(ELEMENT_ORDER);

const PALETTE_OPTIONS = [
  {
    id: "classic",
    label: "Classic",
    colors: {
      Aero: "34, 197, 94",
      Havoc: "244, 63, 94",
      Spectro: "251, 191, 36",
      Glacio: "56, 189, 248",
      Fusion: "249, 115, 22",
      Electro: "139, 92, 246",
      Unassigned: "148, 163, 184"
    }
  },
  {
    id: "neon",
    label: "Neon",
    colors: {
      Aero: "16, 185, 129",
      Havoc: "236, 72, 153",
      Spectro: "250, 204, 21",
      Glacio: "59, 130, 246",
      Fusion: "251, 146, 60",
      Electro: "168, 85, 247",
      Unassigned: "148, 163, 184"
    }
  },
  {
    id: "muted",
    label: "Muted",
    colors: {
      Aero: "20, 83, 45",
      Havoc: "124, 45, 18",
      Spectro: "120, 53, 15",
      Glacio: "30, 58, 138",
      Fusion: "124, 45, 18",
      Electro: "76, 29, 149",
      Unassigned: "100, 116, 139"
    }
  }
];

const CARD_SIZE_OPTIONS = [
  {
    id: "sm",
    label: "Small",
    cardClass: "min-w-[140px] p-2",
    iconClass: "h-10 w-10"
  },
  {
    id: "md",
    label: "Medium",
    cardClass: "min-w-[160px] p-3",
    iconClass: "h-12 w-12"
  },
  {
    id: "lg",
    label: "Large",
    cardClass: "min-w-[190px] p-4",
    iconClass: "h-14 w-14"
  }
];

const SORT_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "name", label: "Name" },
  { id: "cost", label: "Cost (C0)" },
  { id: "rarity", label: "Rarity" }
];

const THEME_OPTIONS = [
  {
    id: "abyss",
    label: "Abyss",
    background:
      "radial-gradient(1200px 500px at 80% -10%, rgba(14, 116, 144, 0.28), transparent 60%), radial-gradient(900px 400px at -10% 20%, rgba(234, 179, 8, 0.16), transparent 60%), linear-gradient(160deg, rgba(2, 6, 23, 0.92), rgba(15, 23, 42, 0.86))",
    panelRgb: "15, 23, 42"
  },
  {
    id: "storm",
    label: "Storm",
    background:
      "radial-gradient(1200px 500px at 80% -10%, rgba(59, 130, 246, 0.24), transparent 60%), radial-gradient(900px 400px at -10% 20%, rgba(56, 189, 248, 0.18), transparent 60%), linear-gradient(160deg, rgba(2, 8, 23, 0.92), rgba(15, 25, 42, 0.86))",
    panelRgb: "12, 20, 38"
  },
  {
    id: "ember",
    label: "Ember",
    background:
      "radial-gradient(1200px 500px at 80% -10%, rgba(249, 115, 22, 0.22), transparent 60%), radial-gradient(900px 400px at -10% 20%, rgba(217, 70, 239, 0.12), transparent 60%), linear-gradient(160deg, rgba(23, 7, 2, 0.94), rgba(32, 14, 6, 0.88))",
    panelRgb: "30, 15, 10"
  }
];

const FONT_OPTIONS = [
  {
    id: "league",
    label: "League Spartan",
    stack: '"League Spartan", "Trebuchet MS", "Verdana", sans-serif'
  },
  {
    id: "segoe",
    label: "Segoe UI",
    stack: '"Segoe UI", "Segoe UI Variable", "Verdana", sans-serif'
  },
  {
    id: "bahnschrift",
    label: "Bahnschrift",
    stack: '"Bahnschrift", "Segoe UI", "Verdana", sans-serif'
  },
  {
    id: "gothic",
    label: "Century Gothic",
    stack: '"Century Gothic", "Trebuchet MS", "Verdana", sans-serif'
  },
  {
    id: "candara",
    label: "Candara",
    stack: '"Candara", "Segoe UI", "Verdana", sans-serif'
  },
  {
    id: "georgia",
    label: "Georgia",
    stack: '"Georgia", "Times New Roman", serif'
  },
  {
    id: "clean",
    label: "Trebuchet",
    stack: '"Trebuchet MS", "Verdana", sans-serif'
  },
  {
    id: "serif",
    label: "Palatino",
    stack: '"Palatino Linotype", "Book Antiqua", serif'
  }
];

const SETTINGS_SECTIONS = [
  {
    id: "overlay",
    label: "Overlay Settings",
    description: "Appearance, opacity, and scale."
  },
  {
    id: "resonators",
    label: "Resonators Settings",
    description: "Cards, sorting, and colors."
  },
  {
    id: "layout",
    label: "Layout Settings",
    description: "Show or hide sections."
  },
  {
    id: "draft",
    label: "Draft Rules",
    description: "Points and team limits."
  },
  {
    id: "decks",
    label: "Deck Settings",
    description: "Auto-save and naming."
  },
  {
    id: "shortcuts",
    label: "Shortcuts",
    description: "Keyboard controls."
  },
  {
    id: "behavior",
    label: "Behavior",
    description: "Always-on-top and click-through."
  }
];

const ROVER_ICON_MAP = {
  "rover-spectro": "srover",
  "rover-havoc": "hrover",
  "rover-aero": "arover"
};

const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));

const getElementStyle = (element, palette, intensity) => {
  const rgb = palette.colors[element] || palette.colors.Unassigned || "148, 163, 184";
  const borderAlpha = clampValue(0.45 * intensity, 0.12, 0.9);
  const backgroundAlpha = clampValue(0.12 * intensity, 0.04, 0.5);
  return {
    color: `rgb(${rgb})`,
    borderColor: `rgba(${rgb}, ${borderAlpha})`,
    backgroundColor: `rgba(${rgb}, ${backgroundAlpha})`
  };
};

const getCost = (resonator, level) => resonator.costs[level] ?? 0;

const normalizeName = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const slugify = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const getIconName = (resonator) =>
  ROVER_ICON_MAP[resonator.id] || resonator.id.replace(/-/g, "");

function DraftPanel({
  ownerKey,
  title,
  subtitle,
  settings,
  grouped,
  unassigned,
  resonatorMap,
  resonatorByName,
  elementStyleFor,
  panelStyle,
  cardStyle,
  selectedStyle,
  cardSizeClass,
  cardIconSizeClass,
  cardNameClass,
  cardSelectClass,
  cardButtonClass
}) {
  const [selectedLevels, setSelectedLevels] = useState(() =>
    RESONATORS.reduce((acc, resonator) => {
      acc[resonator.id] = "c0";
      return acc;
    }, {})
  );
  const [team, setTeam] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [savedDecks, setSavedDecks] = useState([]);
  const [importText, setImportText] = useState("");
  const [importStatus, setImportStatus] = useState("");

  const selectedIds = useMemo(() => new Set(team.map((pick) => pick.id)), [team]);
  const totalPoints = team.reduce((sum, pick) => sum + pick.cost, 0);
  const teamSize = team.length;
  const minTeam = settings.minTeam;
  const maxTeam = settings.maxTeam;
  const maxPoints = settings.maxPoints;
  const enforcePointsCap = settings.enforcePointsCap;

  const filterDecks = (decks) =>
    decks.filter(
      (deck) =>
        deck?.owner === ownerKey ||
        (typeof deck?.id === "string" && deck.id.startsWith(`${ownerKey}-`)) ||
        (!deck?.owner && ownerKey === "p1")
    );

  useEffect(() => {
    const loadDecks = async () => {
      const decks = await window.overwave?.loadDecks?.();
      if (Array.isArray(decks)) {
        setSavedDecks(filterDecks(decks));
      }
    };

    loadDecks();
  }, [ownerKey]);

  useEffect(() => {
    if (!settings.autoSaveEnabled) return;
    const name = settings.autoSaveName.trim() || "Auto-save";
    const deck = {
      id: `${ownerKey}-${slugify(name)}`,
      owner: ownerKey,
      name,
      picks: team,
      totalPoints,
      teamSize,
      updatedAt: new Date().toISOString()
    };

    const savePromise = window.overwave?.saveDeck?.(deck);
    if (savePromise?.then) {
      savePromise.then((decks) => {
        if (Array.isArray(decks)) {
          setSavedDecks(filterDecks(decks));
        }
      });
    }
  }, [settings.autoSaveEnabled, settings.autoSaveName, team, totalPoints, teamSize, ownerKey]);

  const updateLevel = (id, level) => {
    setSelectedLevels((prev) => ({
      ...prev,
      [id]: level
    }));

    const resonator = resonatorMap.get(id);
    if (!resonator) return;

    setTeam((prev) =>
      prev.map((pick) =>
        pick.id === id
          ? {
              ...pick,
              level,
              cost: getCost(resonator, level)
            }
          : pick
      )
    );
  };

  const addPick = (resonator) => {
    const level = selectedLevels[resonator.id] || "c0";
    const cost = getCost(resonator, level);

    if (selectedIds.has(resonator.id)) return;
    if (team.length >= maxTeam) return;
    if (enforcePointsCap && totalPoints + cost > maxPoints) return;

    setTeam((prev) => [
      ...prev,
      {
        id: resonator.id,
        name: resonator.name,
        element: resonator.element,
        level,
        cost
      }
    ]);
  };

  const removePick = (id) => {
    setTeam((prev) => prev.filter((pick) => pick.id !== id));
  };

  const resetTeam = () => {
    setTeam([]);
  };

  const handleSaveDeck = async () => {
    const trimmedName = deckName.trim();
    if (!trimmedName) return;

    const deck = {
      id: `${ownerKey}-${slugify(trimmedName)}`,
      owner: ownerKey,
      name: trimmedName,
      picks: team,
      totalPoints,
      teamSize,
      updatedAt: new Date().toISOString()
    };

    const decks = await window.overwave?.saveDeck?.(deck);
    if (Array.isArray(decks)) {
      setSavedDecks(filterDecks(decks));
    }
  };

  const handleDeleteDeck = async (deckId) => {
    const decks = await window.overwave?.deleteDeck?.(deckId);
    if (Array.isArray(decks)) {
      setSavedDecks(filterDecks(decks));
    }
  };

  const handleDeleteByName = async () => {
    const trimmedName = deckName.trim();
    if (!trimmedName) return;
    await handleDeleteDeck(`${ownerKey}-${slugify(trimmedName)}`);
  };

  const handleLoadDeck = (deck) => {
    if (!deck) return;

    const picks = Array.isArray(deck.picks) ? deck.picks : [];
    const normalized = picks.map((pick) => {
      const levelRaw = typeof pick.level === "string" ? pick.level.toLowerCase() : "c0";
      const level = LEVELS.includes(levelRaw) ? levelRaw : "c0";
      const resonator = pick.id
        ? resonatorMap.get(pick.id)
        : pick.name
          ? resonatorByName.get(normalizeName(pick.name))
          : null;

      if (!resonator) {
        return {
          id: pick.id,
          name: pick.name,
          element: pick.element,
          level,
          cost: Number(pick.cost) || 0
        };
      }

      return {
        id: resonator.id,
        name: resonator.name,
        element: resonator.element,
        level,
        cost: getCost(resonator, level)
      };
    });

    setTeam(normalized.filter((pick) => pick && pick.id));
    setSelectedLevels((prev) => {
      const next = { ...prev };
      normalized.forEach((pick) => {
        if (pick?.id) {
          next[pick.id] = pick.level;
        }
      });
      return next;
    });
    if (deck.name) {
      setDeckName(deck.name);
    }
  };

  const handleImportDeck = () => {
    const raw = importText.trim();
    if (!raw) return;

    const tokens = raw.split(",").map((token) => token.trim()).filter(Boolean);
    const picks = [];
    const missing = [];
    const seen = new Map();

    tokens.forEach((token) => {
      const match = token.match(/(.+?)(?:S|s|C|c)([0-6])$/);
      const namePart = match ? match[1].trim() : token;
      const level = match ? `c${match[2]}` : "c0";
      const resonator = resonatorByName.get(normalizeName(namePart));

      if (!resonator) {
        missing.push(namePart);
        return;
      }

      const pick = {
        id: resonator.id,
        name: resonator.name,
        element: resonator.element,
        level,
        cost: getCost(resonator, level)
      };

      if (seen.has(resonator.id)) {
        const index = seen.get(resonator.id);
        picks[index] = pick;
      } else {
        seen.set(resonator.id, picks.length);
        picks.push(pick);
      }
    });

    setTeam(picks);
    setSelectedLevels((prev) => {
      const next = { ...prev };
      picks.forEach((pick) => {
        next[pick.id] = pick.level;
      });
      return next;
    });

    if (missing.length > 0) {
      setImportStatus(
        `Imported ${picks.length} resonators. Missing: ${missing
          .slice(0, 5)
          .join(", ")}${missing.length > 5 ? ` (+${missing.length - 5})` : ""}`
      );
    } else {
      setImportStatus(`Imported ${picks.length} resonators.`);
    }
  };

  const canSaveDeck = team.length > 0 && deckName.trim().length > 0;
  const canDeleteByName = deckName.trim().length > 0;
  const canImportDeck = importText.trim().length > 0;

  const listForElement = (list) => {
    if (settings.sortBy === "name") {
      return [...list].sort((left, right) => left.name.localeCompare(right.name));
    }
    if (settings.sortBy === "cost") {
      return [...list].sort(
        (left, right) => (left.costs?.c0 ?? 0) - (right.costs?.c0 ?? 0)
      );
    }
    if (settings.sortBy === "rarity") {
      return [...list].sort(
        (left, right) =>
          (right.rarity ?? 0) - (left.rarity ?? 0) || left.name.localeCompare(right.name)
      );
    }
    return list;
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">{title}</p>
          <h2 className="mt-1 text-2xl font-display text-slate-50">{subtitle}</h2>
          <p className="mt-1 text-xs text-slate-400">Draft builder controls</p>
        </div>
        <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
          <div className="rounded-2xl border border-cyan-400/30 px-4 py-3" style={panelStyle}>
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Total</div>
            <div className="mt-2 text-2xl font-semibold text-slate-50">
              {totalPoints}
              <span className="text-xs text-slate-400"> / {maxPoints}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700/60 px-4 py-3" style={panelStyle}>
            <div className="text-xs uppercase tracking-[0.3em] text-slate-300">Resonators</div>
            <div className="mt-2 text-2xl font-semibold text-slate-50">
              {teamSize}
              <span className="text-xs text-slate-400"> / {maxTeam}</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">Min: {minTeam}</div>
          </div>
        </div>
      </header>

      <section className="space-y-5">
        {ELEMENT_ORDER.map((element) => {
          const list = grouped[element] || [];
          const elementStyle = elementStyleFor(element);
          const listToRender = listForElement(list);

          return (
            <div
              key={element}
              className="rounded-2xl border border-slate-700/60 p-4"
              style={panelStyle}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border"
                    style={elementStyle}
                  >
                    <img
                      src={`./Attribute/${element}.png`}
                      alt={element}
                      className="h-10 w-10 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="text-sm uppercase tracking-[0.35em] text-slate-200">
                      {element}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {list.length} resonators
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">Select any {element} resonator below.</div>
              </div>

              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {listToRender.map((resonator) => {
                  const level = selectedLevels[resonator.id] || "c0";
                  const cost = getCost(resonator, level);
                  const isSelected = selectedIds.has(resonator.id);
                  const isTeamFull = teamSize >= maxTeam;
                  const isOverPoints = totalPoints + cost > maxPoints;
                  const isBlocked = !isSelected && (isTeamFull || (enforcePointsCap && isOverPoints));

                  return (
                    <div
                      key={resonator.id}
                      className={`${cardSizeClass} rounded-2xl border border-slate-700/60`}
                      style={cardStyle}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`flex ${cardIconSizeClass} items-center justify-center overflow-hidden rounded-full border`}
                          style={elementStyle}
                        >
                          <img
                            src={`./ResonatorsIcons/${getIconName(resonator)}.png`}
                            alt={resonator.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className={`mt-2 font-semibold text-slate-100 ${cardNameClass}`}>
                          {resonator.name}
                        </div>
                      </div>

                      <div className="mt-3">
                        <select
                          className={`w-full rounded-xl border border-slate-700/60 bg-slate-950/80 text-slate-200 focus:border-cyan-400/60 focus:outline-none ${cardSelectClass}`}
                          value={level}
                          onChange={(event) => updateLevel(resonator.id, event.target.value)}
                        >
                          {LEVELS.map((option) => {
                            const optionCost = resonator.costs[option];
                            const optionLabel = `${LEVEL_LABELS[option]} - ${optionCost} pts`;
                            return (
                              <option key={option} value={option}>
                                {optionLabel}
                              </option>
                            );
                          })}
                        </select>
                        <button
                          className={`mt-2 w-full rounded-xl border uppercase tracking-[0.3em] transition disabled:cursor-not-allowed disabled:border-slate-600/60 disabled:text-slate-500 ${cardButtonClass} ${
                            isSelected
                              ? "border-rose-400/60 text-rose-200 hover:border-rose-300/80 hover:text-rose-100"
                              : "border-cyan-400/60 text-cyan-100 hover:border-cyan-300 hover:text-white"
                          }`}
                          onClick={() => (isSelected ? removePick(resonator.id) : addPick(resonator))}
                          disabled={isBlocked}
                        >
                          {isSelected ? "Remove" : "Select"}
                        </button>
                        <div className="mt-2 text-[10px] text-slate-500">Cost: {cost} pts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {settings.showUnassigned && unassigned.length > 0 ? (
          <div className="rounded-2xl border border-amber-500/40 p-4" style={panelStyle}>
            <div className="text-sm uppercase tracking-[0.35em] text-amber-200">
              Unassigned
            </div>
            <div className="mt-2 text-xs text-amber-100">
              {unassigned.length} resonators do not have an element assigned yet.
            </div>
          </div>
        ) : null}
      </section>

      {settings.showSelected ? (
        <section className="rounded-2xl border border-slate-700/60 p-4" style={panelStyle}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm uppercase tracking-[0.35em] text-slate-300">Selected</h3>
            <button
              className="rounded-xl border border-slate-700/70 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={resetTeam}
              disabled={team.length === 0}
            >
              Reset
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {team.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700/70 p-3 text-xs text-slate-400">
                No resonators selected yet.
              </div>
            ) : (
              team.map((pick) => (
                <div
                  key={pick.id}
                  className="flex items-center justify-between rounded-xl border border-slate-700/50 px-3 py-2 text-xs"
                  style={selectedStyle}
                >
                  <div>
                    <div className="font-semibold text-slate-100">{pick.name}</div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {LEVEL_LABELS[pick.level]} · {pick.element} · {pick.cost} pts
                    </div>
                  </div>
                  <button
                    className="rounded-lg border border-slate-600/70 px-2 py-1 text-[11px] text-slate-300 transition hover:border-rose-300/70 hover:text-rose-200"
                    onClick={() => removePick(pick.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      ) : null}

      {settings.showDecks ? (
        <section className="rounded-2xl border border-slate-700/60 p-4" style={panelStyle}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm uppercase tracking-[0.35em] text-slate-300">Decks</h3>
            <div className="text-[11px] text-slate-500">Saved in data/decks.json</div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <input
              className="w-full rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
              placeholder="Deck name"
              value={deckName}
              onChange={(event) => setDeckName(event.target.value)}
            />
            <button
              className="rounded-xl border border-cyan-400/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100 transition hover:border-cyan-300 hover:text-white disabled:cursor-not-allowed disabled:border-slate-600/60 disabled:text-slate-500"
              onClick={handleSaveDeck}
              disabled={!canSaveDeck}
              type="button"
            >
              Save Deck
            </button>
            <button
              className="rounded-xl border border-rose-400/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-rose-200 transition hover:border-rose-300 hover:text-rose-100 disabled:cursor-not-allowed disabled:border-slate-600/60 disabled:text-slate-500"
              onClick={handleDeleteByName}
              disabled={!canDeleteByName}
              type="button"
            >
              Delete Deck
            </button>
          </div>

          {settings.showImport ? (
            <>
              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
                <textarea
                  className="min-h-[92px] w-full rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                  placeholder="QiuyuanS0,SigrikaS0,YangyangS6"
                  value={importText}
                  onChange={(event) => setImportText(event.target.value)}
                />
                <button
                  className="h-fit rounded-xl border border-cyan-400/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100 transition hover:border-cyan-300 hover:text-white disabled:cursor-not-allowed disabled:border-slate-600/60 disabled:text-slate-500"
                  onClick={handleImportDeck}
                  disabled={!canImportDeck}
                  type="button"
                >
                  Import Deck
                </button>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Format: NameS0 or NameC0 separated by commas.
              </div>
              {importStatus ? (
                <div className="mt-2 text-[11px] text-slate-400">{importStatus}</div>
              ) : null}
            </>
          ) : null}

          <div className="mt-4 grid gap-2">
            {savedDecks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700/70 p-3 text-xs text-slate-400">
                No saved decks yet.
              </div>
            ) : (
              savedDecks.map((deck) => {
                const pickCount = Number.isFinite(Number(deck.teamSize))
                  ? Number(deck.teamSize)
                  : Array.isArray(deck.picks)
                    ? deck.picks.length
                    : 0;
                const points = Number.isFinite(Number(deck.totalPoints))
                  ? Number(deck.totalPoints)
                  : Array.isArray(deck.picks)
                    ? deck.picks.reduce((sum, pick) => sum + (Number(pick.cost) || 0), 0)
                    : 0;

                return (
                  <div
                    key={deck.id || deck.name}
                    className="flex cursor-pointer flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700/50 px-3 py-2 transition hover:border-cyan-400/40"
                    style={cardStyle}
                    onClick={() => handleLoadDeck(deck)}
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{deck.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {pickCount} picks · {points} pts
                      </div>
                    </div>
                    <button
                      className="rounded-lg border border-rose-400/60 px-2 py-1 text-[11px] text-rose-200 transition hover:border-rose-300 hover:text-rose-100"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteDeck(deck.id);
                      }}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>
      ) : null}
    </section>
  );
}

export default function App() {
  const [isEditMode, setIsEditMode] = useState(true);
  const [showTournamentDraft, setShowTournamentDraft] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState("overlay");
  const [settings, setSettings] = useState({
    theme: "abyss",
    font: "league",
    uiScale: 1,
    overlayOpacity: 0.7,
    topBarOpacity: 0.85,
    panelOpacity: 0.78,
    cardOpacity: 0.68,
    selectedOpacity: 0.72,
    cardSize: "md",
    compactMode: false,
    sortBy: "default",
    elementPalette: "classic",
    elementIntensity: 1,
    showSelected: true,
    showDecks: true,
    showImport: true,
    showUnassigned: true,
    enforcePointsCap: true,
    maxPoints: 500,
    minTeam: 14,
    maxTeam: 17,
    autoSaveEnabled: false,
    autoSaveName: "Auto-save",
    shortcutsEnabled: true,
    alwaysOnTop: true,
    clickThrough: false
  });

  const resonatorMap = useMemo(
    () => new Map(RESONATORS.map((resonator) => [resonator.id, resonator])),
    []
  );

  const resonatorByName = useMemo(() => {
    const map = new Map();
    RESONATORS.forEach((resonator) => {
      map.set(normalizeName(resonator.name), resonator);
    });
    return map;
  }, []);

  const { grouped, unassigned } = useMemo(() => {
    const base = ELEMENT_ORDER.reduce((acc, element) => {
      acc[element] = [];
      return acc;
    }, {});
    const extra = [];

    RESONATORS.forEach((resonator) => {
      if (ELEMENT_SET.has(resonator.element)) {
        base[resonator.element].push(resonator);
      } else {
        extra.push(resonator);
      }
    });

    return { grouped: base, unassigned: extra };
  }, []);

  useEffect(() => {
    window.overwave?.setAlwaysOnTop?.(settings.alwaysOnTop);
  }, [settings.alwaysOnTop]);

  useEffect(() => {
    window.overwave?.setClickThrough?.(settings.clickThrough);
  }, [settings.clickThrough]);

  useEffect(() => {
    if (!settings.shortcutsEnabled) return;

    const handleKeyDown = (event) => {
      const target = event.target;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (event.key === "F1") {
        event.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      }
      if (event.key === "F2") {
        event.preventDefault();
        setIsEditMode((prev) => !prev);
      }
      if (event.ctrlKey && event.shiftKey && event.code === "KeyC") {
        event.preventDefault();
        setSettings((prev) => ({
          ...prev,
          clickThrough: !prev.clickThrough
        }));
      }
      if (event.ctrlKey && event.shiftKey && event.code === "KeyA") {
        event.preventDefault();
        setSettings((prev) => ({
          ...prev,
          alwaysOnTop: !prev.alwaysOnTop
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings.shortcutsEnabled]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNumberSetting = (key, rawValue, options = {}) => {
    const nextValue = Number(rawValue);
    if (Number.isNaN(nextValue)) return;

    const min = Number.isFinite(options.min) ? options.min : nextValue;
    const max = Number.isFinite(options.max) ? options.max : nextValue;
    const clamped = clampValue(nextValue, min, max);

    setSettings((prev) => ({
      ...prev,
      [key]: clamped
    }));
  };

  const updateMinTeam = (rawValue) => {
    const nextValue = Number(rawValue);
    if (Number.isNaN(nextValue)) return;

    setSettings((prev) => {
      const min = clampValue(nextValue, 1, 30);
      const max = Math.max(prev.maxTeam, min);
      return {
        ...prev,
        minTeam: min,
        maxTeam: max
      };
    });
  };

  const updateMaxTeam = (rawValue) => {
    const nextValue = Number(rawValue);
    if (Number.isNaN(nextValue)) return;

    setSettings((prev) => {
      const max = clampValue(nextValue, 1, 30);
      const min = Math.min(prev.minTeam, max);
      return {
        ...prev,
        minTeam: min,
        maxTeam: max
      };
    });
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleMinimize = () => {
    window.overwave?.minimize?.();
  };

  const handleMaximize = () => {
    window.overwave?.maximize?.();
  };

  const handleClose = () => {
    window.overwave?.close?.();
  };

  const openTournamentDraft = () => {
    setShowTournamentDraft(true);
    setIsSettingsOpen(false);
  };

  const closeTournamentDraft = () => {
    setShowTournamentDraft(false);
  };

  const activeTheme = useMemo(
    () => THEME_OPTIONS.find((option) => option.id === settings.theme) || THEME_OPTIONS[0],
    [settings.theme]
  );
  const activeFont = useMemo(
    () => FONT_OPTIONS.find((option) => option.id === settings.font) || FONT_OPTIONS[0],
    [settings.font]
  );
  const activePalette = useMemo(
    () =>
      PALETTE_OPTIONS.find((option) => option.id === settings.elementPalette) ||
      PALETTE_OPTIONS[0],
    [settings.elementPalette]
  );
  const activeCardSize = useMemo(
    () => CARD_SIZE_OPTIONS.find((option) => option.id === settings.cardSize) || CARD_SIZE_OPTIONS[1],
    [settings.cardSize]
  );

  const cardSizeClass = activeCardSize.cardClass;
  const cardIconSizeClass = activeCardSize.iconClass;
  const cardNameClass = settings.compactMode ? "text-[10px]" : "text-xs";
  const cardSelectClass = settings.compactMode
    ? "px-2 py-1 text-[10px]"
    : "px-2 py-2 text-[11px]";
  const cardButtonClass = settings.compactMode
    ? "px-2 py-1 text-[10px]"
    : "px-2 py-2 text-[11px]";

  const overlayStyle = {
    fontFamily: activeFont.stack
  };
  const backgroundStyle = {
    background: activeTheme.background,
    opacity: settings.overlayOpacity
  };
  const topBarStyle = {
    backgroundColor: `rgba(${activeTheme.panelRgb}, ${settings.topBarOpacity})`
  };
  const panelStyle = {
    backgroundColor: `rgba(${activeTheme.panelRgb}, ${settings.panelOpacity})`
  };
  const cardStyle = {
    backgroundColor: `rgba(${activeTheme.panelRgb}, ${settings.cardOpacity})`
  };
  const selectedStyle = {
    backgroundColor: `rgba(${activeTheme.panelRgb}, ${settings.selectedOpacity})`
  };
  const modalStyle = {
    backgroundColor: `rgba(${activeTheme.panelRgb}, ${Math.min(
      settings.panelOpacity + 0.15,
      0.95
    )})`
  };
  const contentStyle = {
    transform: `scale(${settings.uiScale})`,
    transformOrigin: "top center"
  };

  const elementStyleFor = (element) =>
    getElementStyle(element, activePalette, settings.elementIntensity);

  const dragClass = isEditMode ? "drag-region" : "";

  return (
    <div className="min-h-screen text-slate-100" style={overlayStyle}>
      <div className="fixed inset-0 -z-10 pointer-events-none" style={backgroundStyle} />
      {isSettingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-10">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={closeSettings}
          />
          <div
            className="no-drag relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-700/70"
            style={modalStyle}
          >
            <div className="grid md:grid-cols-[220px_1fr]">
              <aside className="border-b border-slate-800/60 bg-slate-950/60 p-4 md:border-b-0 md:border-r">
                <div className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">
                  Settings
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-50">
                  Overlay Controls
                </div>

                <nav className="mt-6 space-y-2">
                  {SETTINGS_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      className={`flex w-full flex-col gap-1 rounded-xl border px-3 py-2 text-left text-xs transition ${
                        activeSettingsSection === section.id
                          ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-100"
                          : "border-slate-700/70 text-slate-300 hover:border-cyan-400/40"
                      }`}
                      onClick={() => setActiveSettingsSection(section.id)}
                      type="button"
                    >
                      <span className="text-[11px] uppercase tracking-[0.3em]">
                        {section.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {section.description}
                      </span>
                    </button>
                  ))}
                </nav>
              </aside>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">
                      {SETTINGS_SECTIONS.find((section) => section.id === activeSettingsSection)
                        ?.label || "Settings"}
                    </div>
                    <div className="mt-1 text-xl font-semibold text-slate-50">
                      Configure
                    </div>
                  </div>
                  <button
                    className="rounded-xl border border-slate-700/70 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-100"
                    onClick={closeSettings}
                    type="button"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-6 grid gap-4">
                  {activeSettingsSection === "overlay" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <span className="text-sm text-slate-100">Theme</span>
                        <select
                          className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:outline-none"
                          value={settings.theme}
                          onChange={(event) => updateSetting("theme", event.target.value)}
                        >
                          {THEME_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <span className="text-sm text-slate-100">Font</span>
                        <select
                          className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:outline-none"
                          value={settings.font}
                          onChange={(event) => updateSetting("font", event.target.value)}
                        >
                          {FONT_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="mt-2 text-sm text-slate-300" style={{ fontFamily: activeFont.stack }}>
                          Preview: OverWave Draft Overlay
                        </div>
                      </label>

                      <label className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-100">UI scale</span>
                          <span className="text-xs text-slate-400">
                            {Math.round(settings.uiScale * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.8"
                          max="1.2"
                          step="0.05"
                          value={settings.uiScale}
                          onChange={(event) => updateSetting("uiScale", Number(event.target.value))}
                          className="h-2 w-full accent-cyan-400"
                        />
                      </label>

                      <label className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-100">Background opacity</span>
                          <span className="text-xs text-slate-400">
                            {Math.round(settings.overlayOpacity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.01"
                          max="1"
                          step="0.05"
                          value={settings.overlayOpacity}
                          onChange={(event) =>
                            updateSetting("overlayOpacity", Number(event.target.value))
                          }
                          className="h-2 w-full accent-cyan-400"
                        />
                      </label>

                      <label className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-100">Top bar opacity</span>
                          <span className="text-xs text-slate-400">
                            {Math.round(settings.topBarOpacity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="1"
                          step="0.05"
                          value={settings.topBarOpacity}
                          onChange={(event) => updateSetting("topBarOpacity", Number(event.target.value))}
                          className="h-2 w-full accent-cyan-400"
                        />
                      </label>

                      <label className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-100">Panel opacity</span>
                          <span className="text-xs text-slate-400">
                            {Math.round(settings.panelOpacity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="1"
                          step="0.05"
                          value={settings.panelOpacity}
                          onChange={(event) => updateSetting("panelOpacity", Number(event.target.value))}
                          className="h-2 w-full accent-cyan-400"
                        />
                      </label>

                      <label className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-100">Card opacity</span>
                          <span className="text-xs text-slate-400">
                            {Math.round(settings.cardOpacity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="1"
                          step="0.05"
                          value={settings.cardOpacity}
                          onChange={(event) => updateSetting("cardOpacity", Number(event.target.value))}
                          className="h-2 w-full accent-cyan-400"
                        />
                      </label>

                      <label className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-100">Selected list opacity</span>
                          <span className="text-xs text-slate-400">
                            {Math.round(settings.selectedOpacity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="1"
                          step="0.05"
                          value={settings.selectedOpacity}
                          onChange={(event) => updateSetting("selectedOpacity", Number(event.target.value))}
                          className="h-2 w-full accent-cyan-400"
                        />
                      </label>
                    </div>
                  ) : null}

                  {activeSettingsSection === "resonators" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <span className="text-sm text-slate-100">Card size</span>
                        <select
                          className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:outline-none"
                          value={settings.cardSize}
                          onChange={(event) => updateSetting("cardSize", event.target.value)}
                        >
                          {CARD_SIZE_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div>
                          <div className="text-sm text-slate-100">Compact mode</div>
                          <div className="text-[11px] text-slate-400">Smaller text and tighter spacing.</div>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-cyan-400"
                          checked={settings.compactMode}
                          onChange={() => updateSetting("compactMode", !settings.compactMode)}
                        />
                      </label>

                      <label className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <span className="text-sm text-slate-100">Sort by</span>
                        <select
                          className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:outline-none"
                          value={settings.sortBy}
                          onChange={(event) => updateSetting("sortBy", event.target.value)}
                        >
                          {SORT_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <span className="text-sm text-slate-100">Element palette</span>
                        <select
                          className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:outline-none"
                          value={settings.elementPalette}
                          onChange={(event) => updateSetting("elementPalette", event.target.value)}
                        >
                          {PALETTE_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-100">Element intensity</span>
                          <span className="text-xs text-slate-400">
                            {Math.round(settings.elementIntensity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.6"
                          max="1.6"
                          step="0.1"
                          value={settings.elementIntensity}
                          onChange={(event) =>
                            updateSetting("elementIntensity", Number(event.target.value))
                          }
                          className="h-2 w-full accent-cyan-400"
                        />
                      </label>
                    </div>
                  ) : null}

                  {activeSettingsSection === "layout" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        { key: "showSelected", label: "Show Selected" },
                        { key: "showDecks", label: "Show Decks" },
                        { key: "showImport", label: "Show Import" },
                        { key: "showUnassigned", label: "Show Unassigned" }
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3"
                        >
                          <span className="text-sm text-slate-100">{item.label}</span>
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-cyan-400"
                            checked={settings[item.key]}
                            onChange={() => updateSetting(item.key, !settings[item.key])}
                          />
                        </label>
                      ))}
                    </div>
                  ) : null}

                  {activeSettingsSection === "draft" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <span className="text-sm text-slate-100">Max points</span>
                        <input
                          type="number"
                          min="100"
                          max="2000"
                          className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:outline-none"
                          value={settings.maxPoints}
                          onChange={(event) =>
                            updateNumberSetting("maxPoints", event.target.value, { min: 100, max: 2000 })
                          }
                        />
                      </label>

                      <label className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <span className="text-sm text-slate-100">Min team size</span>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:outline-none"
                          value={settings.minTeam}
                          onChange={(event) => updateMinTeam(event.target.value)}
                        />
                      </label>

                      <label className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <span className="text-sm text-slate-100">Max team size</span>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:outline-none"
                          value={settings.maxTeam}
                          onChange={(event) => updateMaxTeam(event.target.value)}
                        />
                      </label>

                      <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div>
                          <div className="text-sm text-slate-100">Enforce points cap</div>
                          <div className="text-[11px] text-slate-400">Block picks over the limit.</div>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-cyan-400"
                          checked={settings.enforcePointsCap}
                          onChange={() => updateSetting("enforcePointsCap", !settings.enforcePointsCap)}
                        />
                      </label>
                    </div>
                  ) : null}

                  {activeSettingsSection === "decks" ? (
                    <div className="grid gap-4">
                      <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div>
                          <div className="text-sm text-slate-100">Auto-save deck</div>
                          <div className="text-[11px] text-slate-400">Save current picks automatically.</div>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-cyan-400"
                          checked={settings.autoSaveEnabled}
                          onChange={() => updateSetting("autoSaveEnabled", !settings.autoSaveEnabled)}
                        />
                      </label>

                      <label className="flex flex-col gap-2 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <span className="text-sm text-slate-100">Auto-save name</span>
                        <input
                          className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:outline-none"
                          value={settings.autoSaveName}
                          onChange={(event) => updateSetting("autoSaveName", event.target.value)}
                          disabled={!settings.autoSaveEnabled}
                        />
                      </label>
                    </div>
                  ) : null}

                  {activeSettingsSection === "shortcuts" ? (
                    <div className="grid gap-4">
                      <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div>
                          <div className="text-sm text-slate-100">Enable shortcuts</div>
                          <div className="text-[11px] text-slate-400">Use keyboard commands.</div>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-cyan-400"
                          checked={settings.shortcutsEnabled}
                          onChange={() => updateSetting("shortcutsEnabled", !settings.shortcutsEnabled)}
                        />
                      </label>
                      <div className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-xs text-slate-300">
                        <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Keys</div>
                        <div className="mt-2 space-y-1">
                          <div>F1: Toggle settings</div>
                          <div>F2: Toggle edit/in-game</div>
                          <div>Ctrl + Shift + A: Toggle always-on-top</div>
                          <div>Ctrl + Shift + C: Toggle click-through</div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {activeSettingsSection === "behavior" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div>
                          <div className="text-sm text-slate-100">Always on top</div>
                          <div className="text-[11px] text-slate-400">Keep overlay above other windows.</div>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-cyan-400"
                          checked={settings.alwaysOnTop}
                          onChange={() => updateSetting("alwaysOnTop", !settings.alwaysOnTop)}
                        />
                      </label>
                      <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3">
                        <div>
                          <div className="text-sm text-slate-100">Click-through</div>
                          <div className="text-[11px] text-slate-400">Ignore mouse input for the overlay.</div>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-cyan-400"
                          checked={settings.clickThrough}
                          onChange={() => updateSetting("clickThrough", !settings.clickThrough)}
                        />
                      </label>
                      <div className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-[11px] text-slate-400 sm:col-span-2">
                        Tip: use Ctrl + Shift + C to toggle click-through if you cannot click the UI.
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-0" style={contentStyle}>
        <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-b-2xl border border-slate-700/70 px-4 py-3 ${isEditMode ? "drag-region" : ""}`}
          style={topBarStyle}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center">
              <img
                src="./overwaveicon.png"
                alt="OverWave"
                className="h-10 w-10 object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.35em] text-slate-100">OverWave</div>
              <div className="text-[11px] text-slate-400">Overlay Draft Builder</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="no-drag rounded-xl border border-slate-700/70 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-100"
              onClick={openSettings}
              type="button"
            >
              Settings
            </button>
            <button
              className="no-drag rounded-xl border border-emerald-400/50 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-emerald-100 transition hover:border-emerald-300 hover:text-white"
              onClick={openTournamentDraft}
              type="button"
            >
              Draft Console
            </button>
            <button
              className={`no-drag rounded-xl border px-3 py-2 text-[11px] uppercase tracking-[0.3em] transition ${
                isEditMode
                  ? "border-cyan-400/50 text-cyan-100"
                  : "border-slate-700/70 text-slate-400"
              }`}
              onClick={toggleEditMode}
              type="button"
            >
              {isEditMode ? "Edit Mode" : "In-Game"}
            </button>
            <div className="no-drag flex items-center gap-1">
              <button
                className="no-drag rounded-lg border border-slate-700/70 px-2 py-1 text-xs text-slate-300 transition hover:border-cyan-300/70 hover:text-cyan-100"
                onClick={handleMinimize}
                type="button"
                aria-label="Minimize"
              >
                -
              </button>
              <button
                className="no-drag rounded-lg border border-slate-700/70 px-2 py-1 text-xs text-slate-300 transition hover:border-cyan-300/70 hover:text-cyan-100"
                onClick={handleMaximize}
                type="button"
                aria-label="Maximize"
              >
                []
              </button>
              <button
                className="no-drag rounded-lg border border-rose-400/40 px-2 py-1 text-xs text-rose-200 transition hover:border-rose-300/70 hover:text-rose-100"
                onClick={handleClose}
                type="button"
                aria-label="Close"
              >
                X
              </button>
            </div>
          </div>
        </div>

        {showTournamentDraft ? (
          <div className="mt-6 rounded-2xl border border-slate-700/70 p-4" style={panelStyle}>
            <TournamentDraft onBack={closeTournamentDraft} />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <DraftPanel
              ownerKey="p1"
              title="Player 1"
              subtitle="Main Draft"
              settings={settings}
              grouped={grouped}
              unassigned={unassigned}
              resonatorMap={resonatorMap}
              resonatorByName={resonatorByName}
              elementStyleFor={elementStyleFor}
              panelStyle={panelStyle}
              cardStyle={cardStyle}
              selectedStyle={selectedStyle}
              cardSizeClass={cardSizeClass}
              cardIconSizeClass={cardIconSizeClass}
              cardNameClass={cardNameClass}
              cardSelectClass={cardSelectClass}
              cardButtonClass={cardButtonClass}
            />
            <DraftPanel
              ownerKey="p2"
              title="Player 2"
              subtitle="Opponent Draft"
              settings={settings}
              grouped={grouped}
              unassigned={unassigned}
              resonatorMap={resonatorMap}
              resonatorByName={resonatorByName}
              elementStyleFor={elementStyleFor}
              panelStyle={panelStyle}
              cardStyle={cardStyle}
              selectedStyle={selectedStyle}
              cardSizeClass={cardSizeClass}
              cardIconSizeClass={cardIconSizeClass}
              cardNameClass={cardNameClass}
              cardSelectClass={cardSelectClass}
              cardButtonClass={cardButtonClass}
            />
          </div>
        )}
      </div>
    </div>
  );
}
