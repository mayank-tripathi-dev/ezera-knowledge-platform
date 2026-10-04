const Card = require('../models/Card');
const { getMemoryStoreStatus } = require('../config/db');
const { initialCards } = require('../utils/seedData');

let memoryCardsStore = [...initialCards];

// Collision Detection & Overlap Resolution Engine
const resolveOverlaps = (cardsList) => {
  const minGapX = 380;
  const minGapY = 320;
  const headerSafeAreaY = 300;

  return cardsList.map((card, index) => {
    let posX = card.position.x;
    let posY = card.position.y;

    if (posX < 680 && posY < headerSafeAreaY) {
      posY = headerSafeAreaY + 20;
    }

    for (let i = 0; i < index; i++) {
      const other = cardsList[i];
      const dx = Math.abs(posX - other.position.x);
      const dy = Math.abs(posY - other.position.y);

      if (dx < minGapX && dy < minGapY) {
        posX = other.position.x + minGapX;
        if (posX > 1200) {
          posX = 60;
          posY = other.position.y + minGapY;
        }
      }
    }

    return {
      ...card,
      position: { x: posX, y: posY }
    };
  });
};

exports.getAllCards = async (req, res) => {
  try {
    if (getMemoryStoreStatus()) {
      return res.json(resolveOverlaps(memoryCardsStore));
    }
    let cards = await Card.find({});
    if (!cards || cards.length === 0) {
      cards = await Card.insertMany(initialCards);
      memoryCardsStore = cards.map(c => c.toObject());
    }
    res.json(resolveOverlaps(cards.map(c => c.toObject ? c.toObject() : c)));
  } catch (error) {
    console.warn('Card query fallback to memory store:', error.message);
    res.json(resolveOverlaps(memoryCardsStore));
  }
};

exports.createCard = async (req, res) => {
  try {
    const { title, category, status, statusType, nodeCode, description, tags, metrics, position, specifications } = req.body;
    
    const newNodeId = 'node-' + Date.now();
    const generatedCode = nodeCode || `ARCH // ${Math.floor(100 + Math.random() * 900)}`;

    const currentCards = memoryCardsStore;
    const nextCol = currentCards.length % 3;
    const nextRow = Math.floor(currentCards.length / 3);
    
    const autoPosition = position || {
      x: 60 + nextCol * 400,
      y: 320 + nextRow * 350
    };

    const newCardData = {
      nodeId: newNodeId,
      nodeCode: generatedCode,
      title: title || 'New Architecture Component',
      category: category || 'Cloud Architecture',
      status: status || 'IN PRODUCTION',
      statusType: statusType || 'production',
      description: description || 'Enterprise solution topology card detailing modular infrastructure capabilities.',
      tags: tags && tags.length > 0 ? tags : ['#Architecture', '#Cloud'],
      metrics: metrics || [
        { label: 'AVAILABILITY', value: '99.99%', color: 'emerald' },
        { label: 'LATENCY', value: '< 10ms', color: 'cyan' }
      ],
      revision: `Rev: 1.00 • ${req.body.author || 'Architecture Team'}`,
      author: req.body.author || 'Enterprise Architect',
      position: autoPosition,
      dimensions: { width: 340, height: 280 },
      type: 'card',
      specifications: specifications || `# ${title}\n\nTechnical specification document for this architecture component.`
    };

    if (getMemoryStoreStatus()) {
      memoryCardsStore.push(newCardData);
      memoryCardsStore = resolveOverlaps(memoryCardsStore);
      return res.status(201).json(newCardData);
    }

    try {
      const created = await Card.create(newCardData);
      res.status(201).json(created);
    } catch (err) {
      memoryCardsStore.push(newCardData);
      res.status(201).json(newCardData);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating architecture card.' });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const { nodeId } = req.params;
    const updates = req.body;

    const index = memoryCardsStore.findIndex(c => c.nodeId === nodeId);
    if (index !== -1) {
      memoryCardsStore[index] = { ...memoryCardsStore[index], ...updates, updatedAt: new Date() };
    }

    if (getMemoryStoreStatus()) {
      return res.json(memoryCardsStore[index] || updates);
    }

    try {
      const updated = await Card.findOneAndUpdate({ nodeId }, { ...updates, updatedAt: Date.now() }, { new: true });
      res.json(updated || memoryCardsStore[index] || updates);
    } catch (err) {
      res.json(memoryCardsStore[index] || updates);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating card.' });
  }
};

exports.updateCardPosition = async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { position } = req.body;

    const card = memoryCardsStore.find(c => c.nodeId === nodeId);
    if (card) card.position = position;

    if (!getMemoryStoreStatus()) {
      try {
        await Card.findOneAndUpdate({ nodeId }, { position, updatedAt: Date.now() });
      } catch (err) {}
    }

    res.json({ success: true, nodeId, position });
  } catch (error) {
    res.status(500).json({ message: 'Error updating card position.' });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const { nodeId } = req.params;

    memoryCardsStore = memoryCardsStore.filter(c => c.nodeId !== nodeId);

    if (!getMemoryStoreStatus()) {
      try {
        await Card.findOneAndDelete({ nodeId });
      } catch (err) {}
    }

    res.json({ success: true, nodeId });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting card.' });
  }
};

exports.autoArrangeCards = async (req, res) => {
  try {
    const cols = 3;
    const startX = 60;
    const startY = 320;
    const gapX = 400;
    const gapY = 350;

    const rearranged = memoryCardsStore.map((card, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      return {
        ...card,
        position: {
          x: startX + col * gapX,
          y: startY + row * gapY
        }
      };
    });

    memoryCardsStore = rearranged;

    if (!getMemoryStoreStatus()) {
      try {
        for (const card of rearranged) {
          await Card.findOneAndUpdate({ nodeId: card.nodeId }, { position: card.position });
        }
      } catch (err) {}
    }

    res.json({ success: true, cards: rearranged });
  } catch (error) {
    res.status(500).json({ message: 'Error auto-arranging cards.' });
  }
};

exports.resetBoardCards = async (req, res) => {
  try {
    memoryCardsStore = [...initialCards];

    if (!getMemoryStoreStatus()) {
      try {
        await Card.deleteMany({});
        await Card.insertMany(initialCards);
      } catch (err) {}
    }

    res.json(resolveOverlaps(memoryCardsStore));
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset spatial grid.' });
  }
};
