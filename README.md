# ZipItems Algorithm

## Purpose
- zipItems function shuffles generated sequence two into sequence one
- an output returns a new combination of sequences ending with an item of first sequence regardless of parity or other conditions

## Technology pick
- I've picked alternative Node runtime, Deno.js to have type safety,  
testing module and benchmarking without the need introducing additional packages or libraries
- Algorithm implementation is purely written in TypeScript
- for a simple spec of algorithm I've used javascript implementation. If spec. would require additional requirements such as perf. optimization, I'd prefer Rust or Golang counterparts.

## How to run

### Local
prerequisite -> installed Deno runtime from [here](https://deno.land/#installation)
- to run tests 
```bash
deno run test
```

### Docker
prerequisite -> installed Docker
used apline docker image [here](https://hub.docker.com/r/hayd/alpine-deno/)
- to run zipItems test suite with docker
```bash
docker run -it --init -p 1993:1993 -v $PWD:/app hayd/alpine-deno:1.0.1 test /app/node/zipItems.test.ts
```

