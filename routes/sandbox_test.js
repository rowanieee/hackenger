const sandbox = require('sandbox')
const {solutions} = require('config').get('challenges')

module.exports = function(req, res) {
  if(req.method === 'GET'){
    res.render('sandbox')
  }

  else if(req.method === 'POST'){
    const {answer} = req.body
    const code = 

      `
      `
    const s = new sandbox()
    const solution = solutions[5-1]
    s.run(code, output => {
      console.log(output.console)
      console.log(solution)
      if(arrEquality(solution, output.console))
        console.log('Correct')
      else
       console.log('Wrong')
    })
  }
}

function arrEquality (a1, a2) {
  // if the other array is a falsy value, return
  if (!a2)
    return false;

  // compare lengths - can save a lot of time
  if (a1.length != a2.length)
    return false;

  for (let i = 0, l = a1.length; i < l; i++) {
    // Check if we have nested arrays
    if (a1[i] instanceof Array && a2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!a1[i].equals(a2[i]))
        return false;
    }
    else if (a1[i] != a2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}
