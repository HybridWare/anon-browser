const { protocol } = require('electron')
const path = require('path')
const { pathToFileURL } = require('url')

const P2P_PRIVILEGES = {
  standard: true,
  secure: true,
  allowServiceWorkers: true,
  supportFetchAPI: true,
  bypassCSP: false,
  corsEnabled: true,
  stream: true
}

const BROWSER_PRIVILEGES = {
  standard: false,
  secure: true,
  allowServiceWorkers: false,
  supportFetchAPI: true,
  bypassCSP: false,
  corsEnabled: true
}

const LOW_PRIVILEGES = {
  standard: false,
  secure: false,
  allowServiceWorkers: false,
  supportFetchAPI: false,
  bypassCSP: false,
  corsEnabled: true
}

const CS_PRIVILEGES = {
  standard: true,
  secure: false,
  allowServiceWorkers: true,
  supportFetchAPI: true,
  bypassCSP: false,
  corsEnabled: true,
  stream: true
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'anon', privileges: BROWSER_PRIVILEGES },
  { scheme: 'tor', privileges: CS_PRIVILEGES },
  { scheme: 'tors', privileges: P2P_PRIVILEGES },
  { scheme: 'iip', privileges: CS_PRIVILEGES },
  { scheme: 'iips', privileges: P2P_PRIVILEGES },
  { scheme: 'lok', privileges: CS_PRIVILEGES },
  { scheme: 'loks', privileges: P2P_PRIVILEGES },
])

const indexFile = path.join(__dirname, 'index.js')
  .replace(`.asar${path.sep}`, `.asar.unpacked${path.sep}`)

import(pathToFileURL(indexFile)).catch((e) => {
  console.error(e.stack)
  process.exit(1)
})