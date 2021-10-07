const {exec} = require('child_process')

const execPromise = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout) => {
            if (err) {
                reject(err)
            } else {
                resolve(stdout)
            }
        })       
    })
}

const  execute = async (filename, message) => {
    await execPromise(`tsc ${filename}.ts`)
    console.log("compiled to js")
    await execPromise(`git add ${filename}.ts`)
    await execPromise(`git commit -m "${filename}: ${message}"`)
    console.log("added the commit")
}
if (process.argv.length >= 3) {
    console.log(process.argv)
    execute(process.argv[2], process.argv[3])
}