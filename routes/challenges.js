const {solutions} = require('config').challenges

module.exports = async function(req, res) {
  const {id} = req.params

  if(req.method === 'GET') {
    if(id)
      res.render(`challenges/${id}`)
    else
      res.render('challenges')
  }

  if(req.method === 'POST') {
    const {answer} = req.body
    if(answer == solutions[id-1])
      res.send('Correct')
    else
      res.send('Wrong!')
  }

}
