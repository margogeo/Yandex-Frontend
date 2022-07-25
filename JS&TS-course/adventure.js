function applyMarriageFilter(friends, filter, maxLevel = Infinity) {
  const bestFriends = friends.filter(friend => friend.best);
  const queue = [bestFriends];
  const invited = new Set();
  let level = 0;
  while (level < maxLevel && queue.length > 0) {
    const guests = queue.shift();
    const following = [];
    guests
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(function(person) {
        if (!invited.has(person)) {
          invited.add(person);

          person.friends.forEach(name => following.push(friends.find(p => p.name === name)));
        }
      });

    if (following.length > 0) {
      queue.push(following);
    }

    ++level;
  }

  return [...invited].filter(filter.instance);
}

function Iterator(friends, filter) {
  if (!(filter instanceof Filter)) {
    throw new TypeError('filter must be instance of Filter');
  }

  this.set = applyMarriageFilter(friends, filter);

  this.position = 0;

  this.done = () => this.position === this.set.length;
  this.next = () => (this.done() ? null : this.set[this.position++]);
}

function LimitedIterator(friends, filter, maxLevel) {
  Iterator.call(this, friends, filter);
  this.set = applyMarriageFilter(friends, filter, maxLevel);
}
LimitedIterator.prototype = Object.create(Iterator.prototype, {constructor: { value: LimitedIterator }});

function Filter() {
  this.instance = () => true;
}

function MaleFilter() {
  this.instance = friend => friend.gender === 'male';
}
MaleFilter.prototype = Object.create(Filter.prototype, {constructor: { value: MaleFilter }});

function FemaleFilter() {
  this.instance = friend => friend.gender === 'female';
}
FemaleFilter.prototype = Object.create(Filter.prototype, {constructor: { value: FemaleFilter }});

module.exports = {
  Iterator,
  Filter,
  LimitedIterator,
  MaleFilter,
  FemaleFilter
};