let paths = [
  {
    service: "login",
    host: "http://localhost:3001/user/login",
    method:"POST"
  },
  {
    service: "65a64145d9f7c5001dc569b0",
    host: "http://localhost:3001/user/register",
    method:"POST"
  },
  {
    service: "65a64145d9f7c5001dc569b0",
    host: "http://localhost:3001/user",
    method:"GET"
  },
  {
    service: "65a64145d9f7c5001dc569b0",
    host: "http://localhost:3001/user/update",
    method:"PUT"
  },
  {
    service: "65a64145d9f7c5001dc569b0",
    host: "http://localhost:3001/user/delete",
    method:"DELETE"
  }
];

module.exports = paths;
