# ZipItems Algorithm

## Purpose
- zipItems function shuffles generated sequence two into sequence one
- an output returns a new combination of sequences ending with an item of first sequence regardless of parity or other conditions

## Technology pick
- I've picked alternative Node / Browser runtime, [Deno](https://deno.land/) to have additional type safety,  
standard testing module and benchmarking without the need introducing additional packages or libraries.
- Algorithm implementation is purely written in TypeScript and doesn't rely on any dependency.
- for a simple spec of algorithm I've used JavaScript (TypeScript) implementation. If spec. would require additional requirements such as perf. optimization, I'd prefer Rust or Golang counterparts.

## How to run

### Local
prerequisite -> installed Deno runtime from [here](https://deno.land/#installation)

- to run tests 
```bash
deno run test
```

### Docker
prerequisite -> installed Docker

Docker uses Apline Deno Docker image from [here](https://hub.docker.com/r/hayd/alpine-deno/)

- to run zipItems test suite with docker
```bash
// $PWD has to be root directory of repository
docker run -it --init -p 1993:1993 -v $PWD:/app hayd/alpine-deno:1.0.1 test /app/node/zipItems.test.ts
```

