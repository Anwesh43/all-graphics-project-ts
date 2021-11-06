const str = (scr) => `
            <html>
                <body>
                    <script src = "${scr}.js">
                    </script>
                    <script>
                        Stage.init()
                    </script>
                </body>
            </html>`

const cp = require('child_process')

const cpPromise = (command) => {
    return new Promise((resolve, reject) => {
        cp.exec(command, (err, stdout) => {
            if (err == null) {
                resolve(stdout)
            } else {
                reject(err)
            }
        })
    })
}

const execute = async (fileName) => {
    require('fs').writeFileSync('index.html', Buffer.from(str(fileName)))
    await cpPromise(`git add index.html`)
    await cpPromise(`git commit -m "adding ${fileName}.js in html script tag"`)
    console.log("adding html in commits")
}

if (process.argv.length == 3) {
    execute(process.argv[2])
}