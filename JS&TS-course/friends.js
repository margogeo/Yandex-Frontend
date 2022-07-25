let days = { ПН: 0, ВТ: 1, СР: 2, ЧТ: 3, ПТ: 4, СБ: 5, ВС: 6};
let nums = { 0: 'ПН', 1: 'ВТ', 2: 'СР', 3: 'ЧТ', 4: 'ПТ', 5: 'СБ', 6: 'ВС'};

function getAppropriateMoment(schedule, duration, workingHours) {
  const dayMin = 24 * 60;
  let range = new Array(dayMin * 3).fill(0);
  let robberyTime = -1,
	  robberyNext = -1;
  
  function getZone(date) {
	  return Number(date.substr(9));
  }

  let bankZone = getZone('ПН ' + workingHours.from);

  function minCount(date, offset) {
	let day = days[date.substr(0, 2)];
	let h = Number(date.substr(3, 2)) + offset;
	let m = Number(date.substr(6, 2));
	return day * dayMin + h * 60 + m; 
  }

  function fillRange(beg, end, val) {
	  beg = Math.max(0, beg);
	  end = Math.min(dayMin * 3, end);
 
    //console.log("Fill:" + beg + " " +end)
    while(beg < end) {
		  range[beg++] = val;
	  }
  }	  

  for( let d = 0; d < 3 ; d++) {
    let sDay = nums[d] + " ";
    let wBeg = minCount(sDay + workingHours.from, 0);
    let wEnd = minCount(sDay + workingHours.to, 0);
	  fillRange(wBeg, wEnd, 1);
  }
  
  for (let robs of Object.values(schedule)) {
    for (let { from, to } of Object.values(robs)) {
	  let offset = bankZone - getZone(from);		
	  let beg = minCount(from, offset), end = minCount(to, offset);
	  fillRange(beg,end, 0);	
    }
  } 	  
  
  function getRobberyTime() {
    let mCount = 0;
    for(let i = 0; i < dayMin * 3 ; i++) {
	    if(range[i] > 0) {
		    if(++mCount >= duration) {
			    if(robberyTime < 0) {
				    robberyTime = i - duration + 1;
			    } 
			    else if(i >= robberyTime + 30 + duration - 1) {
				    robberyNext = i - duration + 1;
				    break;
			    }
		    }
	    }
	    else {
		    mCount = 0;
	    }
    }

  }
  getRobberyTime();
	  
  return {
    exists() {
      return robberyTime >= 0;
    },

    format(template) {
		if (!this.exists()) return '';
		let day = Math.floor(robberyTime / dayMin);
		let hour = Math.floor(robberyTime / 60) % 24;
		let minutes = Math.round(robberyTime) % 60;	
		return template.replace('%DD', nums[day])
			.replace('%HH', hour.toString().padStart(2, '0'))
			.replace('%MM', minutes.toString().padStart(2, '0'));
    },

    tryLater() {
      if (robberyNext < 0) return false;
      robberyTime = robberyNext;
      robberyNext = -1;
      getRobberyTime();
      return true;
    }
  };
}

module.exports = {
  getAppropriateMoment
};