# ZipItems Algorithm

## Purpose
- zipItems function shuffles generated sequence two into sequence one
- an output returns a new combination of sequences ending with an item of first sequence regardless of parity or condition

## Technology pick
- I've picked alternative Node runtime, Deno.js to have type safety,  
testing module and benchmarking without the need introducing additional packages or libraries
- Algorithm implementation is purely written in TypeScript

## How to run
### Local
install Deno runtime from [here](https://deno.land/#installation)
- run tests 
```bash
deno run test
```

### Docker
used docker image [here](https://hub.docker.com/r/hayd/alpine-deno/)
- run zipItems test suite with docker
```bash
docker run -it --init -p 1993:1993 -v $PWD:/app hayd/alpine-deno:1.0.1 test /app/node/zipItems.test.ts
```

