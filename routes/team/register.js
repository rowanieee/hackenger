module.exports = async (req, res) => {
  const {method} = req;
  if(method === 'GET')
    res.render('team/registration')
  else if(method === 'POST') {
    try {
      const {team_name, member1, member2, member3, member4} = req.body
      await registerTeam({
        team_name,
        member1,
        member2,
        member3,
        member4,
      })
      res.render('team/registration', {success: "Team Successfully registered!"})
    } catch(error)
    {
      res.render('team/registration', {error})
    }
  }
}

async function registerTeam(team) {
  const client = await global.pool.connect();
  console.log(`Registering Hacker ${team}`);
  const sql = {
    text: `INSERT INTO hackenger_team (team_name, member1, member2, member3, member4) VALUES( $1, $2, $3, $4, $5)`,
    values: [
      team.team_name,
      team.member1,
      team.member2,
      team.member3,
      team.member4,
    ]
  };

  console.log(sql)
  try{
    await client.query(sql);
  } catch(error) {
    throw "Duplicate Team Name"
  }
  await client.release();
}
