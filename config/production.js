const {env} = process
module.exports = {
  app: {
    port: env.PORT,
    requireHttps: false
  },
  database: {
    user: env.PGUSER,
    host: env.PGHOST,
    database: env.PGDATABASE,
    password: env.PGPASSWORD,
    port: env.PGPORT,
    ssl: {
      rejectUnauthorized: false
    }
  },
  challenges:{
    solutions: env.SOLUTIONS.split(' ')
  }
}
