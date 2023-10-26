export default async function makeGarlic (opts = {}) {
    const { default: nodeFetch } = await import('node-fetch')
    const {default: detect} = await import('detect-port')
    const {SocksProxyAgent} = await import('socks-proxy-agent')
    const {HttpProxyAgent} = await import('http-proxy-agent')
    const finalOpts = { timeout: 30000, port: 4444, ...opts }
    const mainPort = finalOpts.port
    const useTimeOut = finalOpts.timeout
    const mainAgent = finalOpts.socks ? new SocksProxyAgent(`socks5h://127.0.0.1:${mainPort}`) : new HttpProxyAgent(`http://127.0.0.1:${mainPort}`)
  
  function useAgent(_parsedURL) {
    if (_parsedURL.protocol === 'http:' || _parsedURL.protocol === 'https:') {
        return mainAgent
      } else {
        throw new Error('protocol is not valid')
      }
    }
  
    return async function handleIip(url, opt) {
      const session = new Request(url.replace('iip', 'http'), opt)
      const mainURL = new URL(session.url)
      const searchParams = mainURL.searchParams
      const reqHeaders = session.headers
  
      if(mainURL.hostname === '_'){
        const detectedPort = await detect(mainPort)
        const isItRunning = mainPort !== detectedPort
        return new Response(String(isItRunning), {status: 200, headers: {'Content-Type': 'text/plain; charset=utf-8'}})
      }
      
      session.agent = useAgent
      const mainTimeout = reqHeaders.has('x-timer') || searchParams.has('x-timer') ? reqHeaders.get('x-timer') !== '0' || searchParams.get('x-timer') !== '0' ? Number(reqHeaders.get('x-timer') || searchParams.get('x-timer')) * 1000 : 0 : useTimeOut
  
      const tempRes = mainTimeout ?
      await Promise.race([
        new Promise((resolve, reject) => setTimeout(() => { const err = new Error('timed out'); err.name = 'timeout'; reject(err) }, mainTimeout)),
        nodeFetch(session.url, session)
      ]) :
      await nodeFetch(session.url, session)
      if(!tempRes.headers.forEach){
        tempRes.headers = new Headers(tempRes.headers)
      }

      return new Response(tempRes.body, {...tempRes})
    }
  }