import fetchToHandler from './fetch-to-handler.js'
import makeHost from '../dir/hostfetch.js'

export default async function createHandler (options, session) {

  const useFetch = await makeHost(options)

  return fetchToHandler(useFetch, session)
}