import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import formbody from "@fastify/formbody";
import metricsPlugin from "fastify-metrics";         
import { register, Counter, Gauge, Histogram } from "prom-client";
import { performance } from "perf_hooks";

const fastify = Fastify({ 
  logger: {
    level: 'info',
  }
});

await fastify.register(metricsPlugin, { endpoint: "/metrics" });  

fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: "a_very_secret_key_that_should_be_changed",
  cookie: { secure: false },
  saveUninitialized: false,
  resave: false,
});

fastify.register(formbody);

const users = {
  user1: { username: "user1", password: "password1" },
  user2: { username: "user2", password: "password2" },
};

const getUsersQueryDurationHistogram = new Histogram({
  name: "root_query_duration_seconds",
  help: "Histogram of get users query durations in seconds",
  labelNames: ["method", "route"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.075, 0.1],
});


const loginUsersGauge = new Gauge({
  name: "logged_in_users_num",
  help: "Number of currently logged-in users",
});

const rootRequestCounter = new Counter({             
  name: "http_requests_root_total",
  help: "Total number of / HTTP requests",
  labelNames: ["method", "route"],
});

const loginRequestCounter = new Counter({             
  name: "http_requests_login_total",
  help: "Total number of /login HTTP requests",
  labelNames: ["method", "route"],
});

fastify.post("/login", async (request, reply) => {
  const { username, password } = request.body;
  const user = users[username];
  await delay(150);
  if (user && user.password === password) {
    request.session.user = { username: user.username };
    loginRequestCounter.labels(request.method, request.url).inc(); 
    loginUsersGauge.inc();     
    return reply.status(200).send({ message: "Login successful", username: user.username });
  } else {
    return reply.status(401).send({ error: "Invalid username or password" });
  }
});

fastify.post("/logout", async (request, reply) => {
  if (request.session.user) {
    loginUsersGauge.dec(); 
    await delay(150);
    delete request.session.user;
    return reply.status(200).send({ message: "Logout successful" });
  } else {
    return reply.status(401).send({ error: "Not logged in" });
  }
});

fastify.get("/", async (request, reply) => {
  rootRequestCounter.labels(request.method, request.url).inc();      
  const getUsersQueryStart = performance.now(); 
  await delay(450);

  const getUsersQueryDuration = (performance.now() - getUsersQueryStart) / 1000;     
  getUsersQueryDurationHistogram.labels(request.method, request.routeOptions.url).observe(getUsersQueryDuration);

  return reply.status(200).send({ users: users });
});

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 


fastify.get("/health/liveness", async (request, reply) => {
  return reply.code(204).send();  
});

fastify.get("/health/readiness", async (request, reply) => {
  return reply.code(204).send();  
});

fastify.listen({ port: 33000, host: '0.0.0.0' }, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});


