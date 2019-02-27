const {solutions} = require('config').challenges

module.exports = async function(req, res) {
  const {id} = req.params

  if(req.method === 'GET') {
    res.render(`challenges/${id}`)
  }

  if(req.method === 'POST') {
    const {answer} = req.body
    if(answer == solutions[id-1])
      res.send('Correct')
    else
      res.send('Wrong!')
  }

}
