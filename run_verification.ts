const snarkjs = require('snarkjs');

async function prove (signals, wasm, wtns, r1cs, zkey_final, vKey) {
  console.log('calculate')
  await snarkjs.wtns.calculate(signals, wasm, wtns);
  
  console.log('check')
  await snarkjs.wtns.check(r1cs, wtns, logger);  

  console.log('prove')
  console.log(zkey_final)
  console.log(wtns)
  const { proof, publicSignals } = await snarkjs.groth16.prove(zkey_final, wtns);
  console.log(typeof(publicSignals))
  console.log(proof)

  const verified = await snarkjs.groth16.verify(vKey, publicSignals, proof, logger);
  console.log('zk proof validity', verified);
  return {
    proof,
    x: publicSignals[3],
    y: publicSignals[0]
  }
}

(async () => {
    console.log("few")
    // @ts-ignore
    const r1csBuffer = await remix.call('fileManager', 'readFile', 'circuits/.bin/mult.r1cs', true);
    // @ts-ignore
    const r1cs = new Uint8Array(r1csBuffer);
    // @ts-ignore
    const wasmBuffer = await remix.call('fileManager', 'readFile', 'circuits/.bin/mult.wasm', true);
    // @ts-ignore
    const wasm = new Uint8Array(wasmBuffer);   
     
    const zkey_final = {
      type: "mem",
      data: new Uint8Array(JSON.parse(await remix.call('fileManager', 'readFile', './zk/build/zk_setup.txt')))
    }
    const wtns = { type: "mem" };   

    const vKey = JSON.parse(await remix.call('fileManager', 'readFile', './zk/build/verification_key.json'))


    const signals = {
      in1: 3,
      in2: 4
    }
    const proof = await prove(signals, wasm, wtns, r1cs, zkey_final, vKey)


  }
  )()
