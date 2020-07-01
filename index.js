if (typeof window === 'undefined') {
  global.fetch = require('node-fetch')
  global.EventSource = require('eventsource')
}

module.exports = SparkoClient

function SparkoClient(url, key) {
  let p = new URL(url)

  p.pathname = '/rpc'
  const rpc = p.toString()

  const call = async (method, params = {}, range) => {
    let r = await fetch(rpc, {
      method: 'POST',
      body: JSON.stringify({method, params}),
      headers: {
        'Content-Type': 'application/json',
        'X-Access': key,
        Range: range
      }
    })

    let res = await r.json()

    if (!r.ok) {
      let err = new Error(res.message)
      err.code = res.code
      err.request = res.request
      throw err
    }

    return res
  }

  p.pathname = '/stream'
  p.search = 'access-key=' + key
  const es = new EventSource(p.toString())

  const sparko = {
    call,
    es
  }

  const events = [
    'channel_opened',
    'connect',
    'disconnect',
    'invoice_payment',
    'invoice_creation',
    'warning',
    'forward_event',
    'sendpay_success',
    'sendpay_failure',
    'coin_movement'
  ]

  events.forEach(typ => {
    es.addEventListener(typ, e => {
      let listener = sparko[typ]
      if (listener) listener(JSON.parse(e.data))
    })
  })

  return sparko
}
