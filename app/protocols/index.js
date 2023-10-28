import { app, protocol as globalProtocol } from 'electron'
import fs from 'fs-extra'
import Config from '../config.js'

const {
  tor,
  iip,
  lok,
  host
} = Config

const onCloseHandlers = []

export async function close () {
  await Promise.all(onCloseHandlers.map((handler) => handler()))
}

export function setAsDefaultProtocolClient () {
  console.log('Setting as default handlers')
  app.setAsDefaultProtocolClient('anon')
  if(tor.status){
    app.setAsDefaultProtocolClient('tor')
    app.setAsDefaultProtocolClient('tors')
  }
  if(iip.status){
    app.setAsDefaultProtocolClient('iip')
    app.setAsDefaultProtocolClient('iips')
  }
  if(lok.status){
    app.setAsDefaultProtocolClient('lok')
    app.setAsDefaultProtocolClient('loks')
  }
  if(host.length){
    for(const test of host){
      app.setAsDefaultProtocolClient(test.scheme)
    }
  }
  console.log('registered default handlers')
}

export async function setupProtocols (session) {
  const { protocol: sessionProtocol } = session
  sessionProtocol.interceptHttpProtocol('http', (request, callback) => {
    callback(new Response(null, {status: 500}))
  })
  globalProtocol.interceptHttpProtocol('http', (request, callback) => {
    callback(new Response(null, {status: 500}))
  })
  sessionProtocol.interceptHttpProtocol('https', (request, callback) => {
    callback(new Response(null, {status: 500}))
  })
  globalProtocol.interceptHttpProtocol('https', (request, callback) => {
    callback(new Response(null, {status: 500}))
  })

  const {default: createBrowserHandler} = await import('./browser-protocol.js')
  const browserProtocolHandler = await createBrowserHandler()
  sessionProtocol.registerStreamProtocol('anon', browserProtocolHandler)
  globalProtocol.registerStreamProtocol('anon', browserProtocolHandler)

  console.log('registered anon protocol')

  // tor
  if(tor.status){
    const {default: createTorHandler} = await import('./tor-protocol.js')
    const torHandler = await createTorHandler(tor, session)
    sessionProtocol.registerStreamProtocol('tor', torHandler)
    globalProtocol.registerStreamProtocol('tor', torHandler)
    sessionProtocol.registerStreamProtocol('tors', torHandler)
    globalProtocol.registerStreamProtocol('tors', torHandler)
    
    console.log('registered tor protocol')
  }
  // tor

  // iip
  if(iip.status){
    const {default: createIipHandler} = await import('./iip-protocol.js')
    const iipHandler = await createIipHandler(iip, session)
    sessionProtocol.registerStreamProtocol('iip', iipHandler)
    globalProtocol.registerStreamProtocol('iip', iipHandler)
    sessionProtocol.registerStreamProtocol('iips', iipHandler)
    globalProtocol.registerStreamProtocol('iips', iipHandler)
  
    console.log('registered i2p protocol')
  }
  // iip

  // loki
  if(lok.status){
    const {default: createLokHandler} = await import('./lok-protocol.js')
    const lokHandler = await createLokHandler(lok, session)
    sessionProtocol.registerStreamProtocol('lok', lokHandler)
    globalProtocol.registerStreamProtocol('lok', lokHandler)
    sessionProtocol.registerStreamProtocol('loks', lokHandler)
    globalProtocol.registerStreamProtocol('loks', lokHandler)
  
    console.log('registered lokinet protocol')
  }
  // loki

  // host
  if(host.length){
    const {default: createHostHandler} = await import('./host-protocol.js')
    for(const test of host){
      let hostHandler = await createHostHandler({scheme: test.scheme, port: test.port}, session)
      sessionProtocol.registerStreamProtocol(test.scheme, hostHandler)
      globalProtocol.registerStreamProtocol(test.scheme, hostHandler)
    }
  }
  // host
}
