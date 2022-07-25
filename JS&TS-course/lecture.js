function getEmitter() {
  let evs = new Map();
  return {
    on: function (event, context, handler) {
      if (!evs.has(event)) 
          evs.set(event, []);
      evs.get(event).push({ context, handler });
      return this;
    },
    off: function (event, context) {
      const matches = [];
      if (evs.has(event)) {
        for (const cur of evs.keys()) {
          if (cur === event || cur.startsWith(`${event}.`)) 
              matches.push(cur);
        }
      }
      for (let match of matches) {
          evs.set(match, evs.get(match).filter((ev) => ev.context !== context));
      }
      return this;
    },
    emit: function (event) {
      const s = event.split('.'), events = [];
      for (let i = 0; i < s.length; i++) {
        events.unshift((events[0] ? events[0] + '.' : '') + s[i]);
      }
      for (const event of events) {
        if (evs.has(event))
            for (const {context, handler} of evs.get(event)) {
                handler.call(context);
            }
      }
      return this;
    }
  };
}

module.exports = {
  getEmitter
};