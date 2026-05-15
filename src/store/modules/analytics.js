const state = {
  events: [],
  products: {}
};

function ensure(id) {
  if (!state.products[id]) {
    state.products[id] = {
      views: 0,
      clicks: 0,
      likes: 0,
      shares: 0,
      saves: 0,
      purchases: 0,
      totalWatchTime: 0,
      averageWatchTime: 0,
      score: 1.0
    };
  }

  return state.products[id];
}


function track(id, type, value = 1) {
  const item = ensure(id);

  if (type in item) {
    item[type] += value;
  }

  state.events.push({
    id,
    type,
    value,
    timestamp: Date.now()
  });

  item.score = calculateScore(item);
}



function calculateScore(item) {
  return Number(
    (
      1 +
      item.views * 0.02 +
      item.clicks * 0.08 +
      item.likes * 0.15 +
      item.shares * 0.25 +
      item.saves * 0.2 +
      item.purchases * 0.5
    ).toFixed(2)
  );
}

export const analytics = {
  state,
  track
};