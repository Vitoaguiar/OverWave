import React, { useState, useMemo, useEffect } from 'react';
import resonators from '../data/resonators.json';
import '../styles/tournamentDraft.css';

const ELEMENT_ORDER = ['Aero', 'Havoc', 'Spectro', 'Glacio', 'Fusion', 'Electro'];

const ELEMENT_ICON_MAP = {
  'Aero': 'Aero',
  'Havoc': 'Havoc',
  'Spectro': 'Spectro',
  'Glacio': 'Glacio',
  'Fusion': 'Fusion',
  'Electro': 'Electro',
};

// Sequence exactly as requested
const PICK_SEQUENCE = [
  { num: 1, type: 'ban', owner: 'Player1' },
  { num: 2, type: 'ban', owner: 'Player2' },
  { num: 3, type: 'pick', owner: 'Player1' },
  { num: 4, type: 'pick', owner: 'Player2' },
  { num: 5, type: 'pick', owner: 'Player2' },
  { num: 6, type: 'pick', owner: 'Player1' },
  { num: 7, type: 'pick', owner: 'Player1' },
  { num: 8, type: 'pick', owner: 'Player2' },
  { num: 9, type: 'ban', owner: 'Player1' },
  { num: 10, type: 'ban', owner: 'Player2' },
  { num: 11, type: 'pick', owner: 'Player2' },
  { num: 12, type: 'pick', owner: 'Player1' },
  { num: 13, type: 'pick', owner: 'Player1' },
  { num: 14, type: 'pick', owner: 'Player2' },
  { num: 15, type: 'pick', owner: 'Player2' },
  { num: 16, type: 'pick', owner: 'Player1' },
];

const getIconName = (resonator) => {
  const ROVER_ICON_MAP = {
    'rover-spectro': 'srover',
    'rover-havoc': 'hrover',
    'rover-aero': 'arover',
  };
  return ROVER_ICON_MAP[resonator.id] || resonator.id.replace(/-/g, '');
};

function ElementRow({ element, player1Picks, player2Picks, onDragStart }) {
  const resonatorMap = useMemo(
    () => new Map(resonators.map((r) => [r.id, r])),
    []
  );

  const p1Resonators = useMemo(() => {
    return player1Picks
      .map((pick) => resonatorMap.get(pick.id))
      .filter((r) => r && r.element === element);
  }, [player1Picks, element, resonatorMap]);

  const p2Resonators = useMemo(() => {
    return player2Picks
      .map((pick) => resonatorMap.get(pick.id))
      .filter((r) => r && r.element === element);
  }, [player2Picks, element, resonatorMap]);

  return (
    <div className="attribute-row">
      {/* Player 1 picks */}
      <div className="attribute-picks p1-picks">
        {p1Resonators.length === 0 ? (
          <div className="pick-card empty">-</div>
        ) : (
          p1Resonators.map((reso) => (
            <div
              key={reso.id}
              className="pick-card"
              draggable
              onDragStart={(e) => onDragStart(e, reso, 'Player1')}
            >
              <img
                src={`./ResonatorsIcons/${getIconName(reso)}.png`}
                alt={reso.name}
                className="pick-icon"
                title={reso.name}
              />
            </div>
          ))
        )}
      </div>

      {/* Center element label */}
      <div className="element-center">
        <img
          src={`./Attribute/${ELEMENT_ICON_MAP[element]}.png`}
          alt={element}
          className="element-icon"
          title={element}
        />
      </div>

      {/* Player 2 picks */}
      <div className="attribute-picks p2-picks">
        {p2Resonators.length === 0 ? (
          <div className="pick-card empty">-</div>
        ) : (
          p2Resonators.map((reso) => (
            <div
              key={reso.id}
              className="pick-card"
              draggable
              onDragStart={(e) => onDragStart(e, reso, 'Player2')}
            >
              <img
                src={`./ResonatorsIcons/${getIconName(reso)}.png`}
                alt={reso.name}
                className="pick-icon"
                title={reso.name}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function TournamentDraft({ onBack }) {
  const [decks, setDecks] = useState([]);
  const [player1Picks, setPlayer1Picks] = useState([]);
  const [player2Picks, setPlayer2Picks] = useState([]);
  const [draggedResonator, setDraggedResonator] = useState(null);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [sequenceAssignments, setSequenceAssignments] = useState({});

  useEffect(() => {
    const loadDecks = async () => {
      const allDecks = await window.overwave?.loadDecks?.();
      if (Array.isArray(allDecks)) {
        setDecks(allDecks);

        // Load deck for Player 1 (p1 owner)
        const p1Deck = allDecks.find(
          (d) => d.owner === 'p1' || (typeof d.id === 'string' && d.id.startsWith('p1-'))
        );
        if (p1Deck && Array.isArray(p1Deck.picks)) {
          setPlayer1Picks(p1Deck.picks);
        }

        // Load deck for Player 2 (p2 owner)
        const p2Deck = allDecks.find(
          (d) => d.owner === 'p2' || (typeof d.id === 'string' && d.id.startsWith('p2-'))
        );
        if (p2Deck && Array.isArray(p2Deck.picks)) {
          setPlayer2Picks(p2Deck.picks);
        }
      }
    };

    loadDecks();
  }, []);

  const handleDragStart = (e, resonator, player) => {
    setDraggedResonator(resonator);
    setDraggedPlayer(player);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropOnSequence = (e, sequenceNum) => {
    e.preventDefault();
    if (draggedResonator && draggedPlayer) {
      setSequenceAssignments((prev) => ({
        ...prev,
        [sequenceNum]: {
          resonator: draggedResonator,
          player: draggedPlayer,
        },
      }));
      setDraggedResonator(null);
      setDraggedPlayer(null);
    }
  };

  const handleRemoveFromSequence = (sequenceNum) => {
    setSequenceAssignments((prev) => {
      const updated = { ...prev };
      delete updated[sequenceNum];
      return updated;
    });
  };

  const handleResetSequence = () => {
    setSequenceAssignments({});
  };

  const handleSwapPlayers = () => {
    const temp = player1Picks;
    setPlayer1Picks(player2Picks);
    setPlayer2Picks(temp);
  };

  return (
    <div className="tournament-draft">
      <div className="draft-header">
        <div className="header-title">Tournament Draft Console</div>
        {onBack ? (
          <button className="back-btn" onClick={onBack} type="button">
            Back to Builder
          </button>
        ) : null}
      </div>

      <div className="draft-content">
        {/* Left: Decks laid out by element */}
        <div className="left-section">
          {/* Headers */}
          <div className="decks-header">
            <div className="header-player p1-header">Player 1</div>
            <div className="header-element"></div>
            <div className="header-player p2-header">Player 2</div>
          </div>

          {/* Element rows */}
          <div className="elements-container">
            {ELEMENT_ORDER.map((element) => (
              <ElementRow
                key={element}
                element={element}
                player1Picks={player1Picks}
                player2Picks={player2Picks}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>

        {/* Right: Pick sequence */}
        <div className="right-section">
          <div className="sequence-header">
            <div>Pick Order</div>
            <div className="sequence-header-buttons">
              <button
                className="sequence-btn"
                onClick={handleSwapPlayers}
                title="Swap players"
                type="button"
              >
                Swap
              </button>
              <button
                className="sequence-btn"
                onClick={handleResetSequence}
                title="Reset all picks"
                type="button"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="sequence-list" onDragOver={handleDragOver}>
            {PICK_SEQUENCE.map((item) => {
              const isPlayer1 = item.owner === 'Player1';
              const color = isPlayer1
                ? 'rgb(144, 238, 144)'
                : 'rgb(147, 112, 219)';
              const bgColor = item.type === 'ban' ? 'rgb(255, 0, 0)' : color;
              const assignment = sequenceAssignments[item.num];

              return (
                <div
                  key={item.num}
                  className={`sequence-item sequence-item-${item.type}`}
                  onDrop={(e) => handleDropOnSequence(e, item.num)}
                  onDragOver={handleDragOver}
                >
                  {assignment ? (
                    <div className={`sequence-assignment sequence-assignment-${item.type}`}>
                      <div className="sequence-assignment-badge">
                        {item.type.toUpperCase()}
                      </div>
                      <div className="sequence-assignment-owner">
                        {item.owner}
                      </div>
                      <img
                        src={`./ResonatorsIcons/${getIconName(assignment.resonator)}.png`}
                        alt={assignment.resonator.name}
                        className="sequence-icon"
                        title={assignment.resonator.name}
                      />
                      <button
                        className="sequence-remove-btn"
                        onClick={() => handleRemoveFromSequence(item.num)}
                        title="Remove pick"
                        type="button"
                      >
                        ↺
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="sequence-num">{item.num}</div>
                      <div className="sequence-type">
                        {item.type.toUpperCase()}
                      </div>
                      <div className="sequence-owner" style={{ color: bgColor }}>
                        {item.owner}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
