import pg from "pg";

const pool = new pg.Pool({
  host: "localhost",
  port: 54322, // Default Supabase local development port
  database: "postgres",
  user: "postgres",
  password: "postgres",
  // If you're using SSL locally (uncommon), you might need:
  // ssl: { rejectUnauthorized: false }
});

const sql = `
select vault.create_secret('http://host.docker.internal:54321', 'supabase_url');
select vault.create_secret('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0', 'anon');
select vault.create_secret('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU', 'service_role');
`;

pool.query(sql, (err, result) => {
  if (err) {
    console.error("Error applying local migration:", err);
  } else {
    console.log("Local migration applied successfully");
  }
  pool.end();
});
