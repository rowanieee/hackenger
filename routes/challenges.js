module.exports = async function(req, res) {
  const {id} = req.params

  if(req.method === 'GET') {
    res.send(id)
  }

  if(req.method === 'POST') {

  }

}
