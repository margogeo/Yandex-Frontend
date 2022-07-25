'use strict';

const phoneBook = new Map();
let query, END = '\0', ind = 0, cur1 = -1, cur2 = 0, quaries = [];

function run(q) {
  phoneBook.clear();
  quaries = [], ind = 0, cur1 = -1, cur2 = 0, query = q + END;
  while (!test(END)) {
    cur2 = ind, cur1++;
    const cmd = identify();
    if (!commands[cmd]) {
      ind -= cmd.length;
      syntaxError(cur1, ind - cur2);
    }
    if (!nexty(' ')) syntaxError(cur1, ind - cur2);
    commands[cmd]();
  }
  return quaries;
}

const creating = (toDelete) => {
  const arg = identify();
  if (!toDelete && arg !== 'контакт') {
    ind -= arg.length;
    syntaxError(cur1, ind - cur2);
  }
  if (toDelete && arg !== 'контакт' && arg !== 'телефон' && arg !== 'почту' && arg !== 'контакты,') {
    ind -= arg.length;
    syntaxError(cur1, ind - cur2);
  }
  if (arg == 'телефон' || arg == 'почту') {
    ind -= arg.length;
    adding(true);
  } else if (arg == 'контакты,') {
    if (!nexty(' ')) syntaxError(cur1, ind - cur2);
    const q = parsing();
    if (!nexty(';')) syntaxError(cur1, ind - cur2);
    if (q !== '') {
      const del = new Set();
      phoneBook.forEach((user, name) => {
        if (matching(name, user, q)) del.add(name);
      });
      for (const n of del) {
        phoneBook.delete(n);
      }
    }
  } else if (arg == 'контакт') {
    if (!nexty(' ')) syntaxError(cur1, ind - cur2);
    const name = identify(c => (c !== ';' && c !== END));
    if (!nexty(';')) syntaxError(cur1, ind - cur2);
    if (name.length > 0) {
      if (toDelete) phoneBook.delete(name);
      else {
        const user = {
          phones: new Set(),
          emails: new Set(),
        };
        if (!phoneBook.has()) phoneBook.set(name, user);
      }
    }
  }
}

const parsing = () => {
  let key = identify();
  if (key !== 'где') {
    ind -= key.length;
    syntaxError(cur1, ind - cur2);
  }
  if (!nexty(' ')) syntaxError(cur1, ind - cur2);
  key = identify();
  if (key !== 'есть') {
    ind -= key.length;
    syntaxError(cur1, ind - cur2);
  }
  if (!nexty(' ')) syntaxError(cur1, ind - cur2);
  return identify(c => (c !== ';' && c !== END));
}

const adding = (del) => {
  let phones = new Set(), emails = new Set(), next;
  while (true) {
    const type = identify();
    if (type !== 'телефон' && type !== 'почту') {
      ind -= type.length;
      syntaxError(cur1, ind - cur2);
    }
    if (!nexty(' ')) syntaxError(cur1, ind - cur2);
    const arg = identify();
    if (type == 'телефон' && !arg.match(/^\d{10}$/)) {
      ind -= arg.length;
      syntaxError(cur1, ind - cur2);
    }
    if (type == 'почту' && arg.length == 0) syntaxError(cur1, ind - cur2);
    if (type == 'телефон') phones.add(arg);
    else emails.add(arg);
    if (!nexty(' ')) {
      syntaxError(cur1, ind - cur2);
    }
    next = identify();
    if (next !== 'и' && next !== 'для') {
      ind -= next.length;
      syntaxError(cur1, ind - cur2);
    }
    if (next == 'и') {
      if (!nexty(' ')) syntaxError(cur1, ind - cur2);
    } else break;
  }
  if (next == 'для') {
    if (!nexty(' ')) syntaxError(cur1, ind - cur2);
    next = identify();
    if (next !== 'контакта') {
      ind -= next.length;
      syntaxError(cur1, ind - cur2);
    }
    if (!nexty(' ')) syntaxError(cur1, ind - cur2);
    const name = identify(c => (c !== ';' && c !== END));
    if (!name.length) syntaxError(cur1, ind - cur2);
    if (!nexty(';')) syntaxError(cur1, ind - cur2);
    const user = phoneBook.get(name);
    if (user) {
      for (const phone of phones) {
        if (del) user.phones.delete(phone);
        else user.phones.add(phone);
      }
      for (const email of emails) {
        if (del) user.emails.delete(email);
        else user.emails.add(email);
      }
    }
  }
}

const showing = () => {
  let types = [], next;
  while (true) {
    const type = identify();
    if (type !== 'имя' && type !== 'почты' && type !== 'телефоны') {
      ind -= type.length;
      syntaxError(cur1, ind - cur2);
    }
    if (!nexty(' '))  syntaxError(cur1, ind - cur2);
    types.push(type);
    next = identify();
    if (next !== 'и' && next !== 'для') {
      ind -= next.length;
      syntaxError(cur1, ind - cur2);
    }
    if (next == 'и') {
      if (!nexty(' ')) syntaxError(cur1, ind - cur2);
    } else
      break;
  }

  if (next == 'для') {
    if (!nexty(' ')) syntaxError(cur1, ind - cur2);
    next = identify();
    if (next !== 'контактов,') {
      ind -= next.length;
      syntaxError(cur1, ind - cur2);
    }
    if (!nexty(' ')) syntaxError(cur1, ind - cur2);
    const q = parsing();
    if (!nexty(';')) syntaxError(cur1, ind - cur2);
    if (q !== '') {
      phoneBook.forEach((user, name) => {
        let match = matching(name, user, q);
        if (match) {
          const phones = [...user.phones]
          .map((phone) => {
          return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8, 10)}`;
          }).join(',');
          const emails = [...user.emails].join(',');
          let res = [];
          for (const type of types) {
            if (type == 'имя') {
              res.push(name);
            } else if (type == 'телефоны') {
              res.push(phones);
            } else if (type == 'почты') {
              res.push(emails);
            }
          }
          quaries.push(res.join(';'));
        }
      });
    }
  }
}

const matching = (name, user, q) => {
  q = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (name.match(q)) return true;
  for (const phone of user.phones) {
    if (phone.match(q)) return true;
  }
  for (const email of user.emails) {
    if (email.match(q)) return true;
  }
  return false;
}

function identify(possible = (c) => (c !== ' ' && c !== ';' && c !== END)) {
  let id = '';
  if (possible(query[ind])) {
    id += query[ind];
    while (possible(query[++ind])) {
      id += query[ind];
    }
  }
  return id;
}

function syntaxError(cmdNumber, charNumber) {
  throw new SyntaxError(
    `SyntaxError: Unexpected token at ${cmdNumber + 1}:${charNumber + 1}`
  );
}

const commands = {
  Создай: () => creating(false),
  Удали: () => creating(true),
  Добавь: () => adding(false),
  Покажи: showing,
};

const test = (c) => (query[ind] == c);

const nexty = (c) => {
  const testRes = test(c);
  if (testRes) ind++;
  return testRes;
}

module.exports = { phoneBook, run };