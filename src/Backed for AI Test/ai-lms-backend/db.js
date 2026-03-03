import pkg from 'pg';

const {Pool} =pkg;

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const sslEnabled = (process.env.DB_SSL || "true").toLowerCase() !== "false";

export const pool = hasDatabaseUrl
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    })
    : new Pool({
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "lms",
        password: process.env.DB_PASSWORD || "chatur",
        port: Number(process.env.DB_PORT || 5432),
    });

// export const pool=new Pool({
//     user:"postgres",
//     host:"localhost",
//     database:"lms",
//     password:"chatur",
//     port:5432,
// }) ;

pool.on("connect", () => {
 console.log("PostgreSQL connected");
});
// Test connection on startup
pool.query('SELECT NOW()')
    .then(() => console.log('Database connection successful'))
    .catch(err => console.error('Database connection failed:', err.message));