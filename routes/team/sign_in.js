module.exports = async (req, res) => {
  const {method} = req
  const teamNames = await getTeamNames();
  console.log(teamNames)

  if(method === 'GET') {
    return res.render('team/sign_in', { teamNames })
  }
  else if (method === 'POST') {
    const { team_name } = req.body
    req.session.team_name = team_name
    return res.redirect('/challenges')
  }

}

async function getTeamNames() {
  const client = await global.pool.connect();
  const sql = {
    text: 'SELECT team_name from hackenger_team'
  };

  //console.log(sql)
  try{
    var names = await client.query(sql)
      .then(r => {
        const {rows} = r
        let names = []
        for(let i=0; i < rows.length; i++) {
          names.push(rows[i].team_name)
        }
        return names
      })
  } catch(error) {
    //console.warn(error)
    throw error
    return []
  }
  await client.release();

  return names
}
