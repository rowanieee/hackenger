const {solutions, points} = require('config').challenges

module.exports = async function(req, res) {
  const {id} = req.params
  const {team_name} = req.session
  console.log(team_name)
  if(!team_name)
    return res.redirect('/team/sign_in')

  if(req.method === 'GET') {
    if(id)
      res.render(`challenges/${id}`)
    else{
      const teamInfo = await getTeamInfo(team_name);
      res.render('challenges', {teamInfo})
    }
    }

    if(req.method === 'POST') {
      const {answer} = req.body
      console.log(`Answer ${answer}\nSolution ${solutions[id-1]}`)
      console.log(solutions)
      let correct = false
      if(answer == solutions[id-1]){
        await answerQuestion(id, team_name)
        correct = true
      }
        return res.render(`challenges/${id}`, {correct})
    }
  }

async function getTeamInfo(team_name) {
  let teamInfo = {
    ranking: {
      rank: 5,
      outOf: 10
    },
    challenges: {
      completed: [false, false, false, false, false, false],
      points
    }
  }

  const client = await global.pool.connect();
  const sql = {
    text: 'SELECT * from hackenger_team where team_name=$1',
    values: [team_name]
  };

  console.log(sql)
  try{
    var team = await client.query(sql)
      .then(r => {
        const row = r.rows[0]
        return row
      })
  } catch(error) {
    console.warn(error)
    throw error
    return []
  }

  await client.release();

  challenges = {
    completed: [ team.c1, team.c2, team.c3, team.c4, team.c5, team.c6, team.c7, team.c8],
    points
  }

  const totalPoints = await getTotalPoints(team_name)

  teamInfo = {
    totalPoints,
    challenges,
    ranking: await getTeamRank(team_name)
  }

  console.log(teamInfo)
  return teamInfo
}

async function getTeamRank(team_name) {
  const rankings = await getRankings()
  const outOf = rankings.length
  const rank = rankings.forEach((r, index) => {
    if(r.team_name === team_name)
      return index + 1
  })

  return {rank, outOf}
}

async function getRankings() {
  const client = await global.pool.connect();
  const sql = "SELECT team_name, last_answer from hackenger_team ORDER BY last_answer DESC"

  try{
    var teams = await client.query(sql)
      .then(r => {
        return r.rows
      })
  } catch(error) {
    console.warn(error)
    throw error
    return []
  }

  await client.release()

  teamRanks = []
  for(let i = 0; i < teams.length; i++) {
    teamRanks.push({
      team_name: teams[i].team_name,
      totalPoints: await getTotalPoints(teams[i].team_name),
      last_answer: teams[i].last_answer
    })
  }

  teamRanks.sort((b,a) => {
    if(a.totalPoints == b.totalPoints)
    {
      return (a.last_answer < b.last_answer) ? -1 : (a.last_answer > b.last_answer) ? 1 : 0;
    }
    else
    {
      return (a.totalPoints < b.totalPoints) ? -1 : 1;
    }
  })

  console.log(teamRanks)
  return teamRanks

}

async function getTotalPoints(team_name) {

  const client = await global.pool.connect();
  const sql = {
    text: 'SELECT * from hackenger_team where team_name=$1',
    values: [team_name]
  };

  console.log(sql)
  try{
    var team = await client.query(sql)
      .then(r => {
        const row = r.rows[0]
        return row
      })
  } catch(error) {
    console.warn(error)
    throw error
    return []
  }

  await client.release()

  challenges = {
    completed: [ team.c1, team.c2, team.c3, team.c4, team.c5, team.c6, team.c7, team.c8],
    points
  }

  totalPoints = 0
  for(let i=0; i < points.length; i++) {
    if(challenges.completed[i])
      totalPoints += points[i]
  }

  return totalPoints
}

async function answerQuestion(question, team_name) {
  const client = await global.pool.connect();
  const sql = {
    text: `UPDATE hackenger_team SET c${question} = true where team_name=$1`,
    values: [
      team_name
    ]
  };

  console.log(sql)
  try{
    await client.query(sql);
  } catch(error) {
    throw error
  }
  return await client.release();
}
