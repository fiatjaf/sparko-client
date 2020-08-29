# sparko-client

A JavaScript client for [sparko](https://github.com/fiatjaf/sparko) (also partially compatible with [spark](https://github.com/shesek/spark-wallet)).

## Install

```
npm install sparko-client
```


## Use


```javascript
const sparko = require('sparko')('https://myspark.server', 'mykeywithanypermissions')

// creating an invoice
let {bolt11, preimage} = await sparko.call('invoice', ['100sat', 'uniquelabel', 'desc'])

// paying an invoice
await sparko.call('pay', {bolt11: 'lnbc1...', maxfeepercent: 0.3, exemptfee: 1})

// listening for events. works with any event notification from
// https://lightning.readthedocs.io/PLUGINS.html#event-notifications
sparko.invoice_payment = data => {
  let {label, msat} = data.invoice_payment
  console.log(`invoice ${label} was paid with ${msat}`)
}
sparko.forward_event = ({forward_event}) => {
  let {in_channel, out_channel, fee, out_msatoshi, status} = forward_event
  if (status === 'settled') {
    console.log(`earned ${fee}msat when forwarding ${out_msatoshi}msat from ${in_channel} to ${out_channel}`)
  }
}
```

## License

Public domain, except you can't use for shitcoins.
