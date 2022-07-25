let pigs, srcset, src, nextPig;

document.addEventListener('DOMContentLoaded', function() {
  srcset = 'pictures/<name>.jpg 400w';
  src = 'picturess/<name>.jpg';
  nextPig = 0;
  function p(namePig, age){ 
    return { name: namePig, age_months: age }
  }
  pigs = [p('birgitte', 1), p('degu', 9), p('suri', 7), p('zaya', 12), p('peppa', 8), p('piggy', 9), p('homa', 4)];

  onAction();
});

function onAction() {
  const pig = pigs[nextPig];
  animate(false);
  document.getElementById('img-source').srcset = srcset.replaceAll('<name>', pig.name);
  document.getElementById('img').src = src.replaceAll('<name>', pig.name);
  document.getElementById('name').innerHTML = pig.name.charAt(0).toUpperCase() + pig.name.slice(1);
  document.getElementById('age').innerHTML = pig.age_months + ' months';
  nextPig++;
  nextPig %= pigs.length;
  animate(true);
}

function animate(anim) {
  let op = anim ? 0 : 1;
  let step = anim ? 0.05 : -0.05;
  const id = setInterval(() => {
    if ((anim && op >= 1) || (!anim && op <= 0)) {
      clearInterval(id);
    } else {
      op += step;
      document.getElementById('card').style.opacity = op;
    } }, 10);
}