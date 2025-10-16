import 'dotenv/config'
import { AtpAgent } from '@atproto/api'

const PDS = 'https://bsky.social'  // or your custom PDS
const IDENTIFIER = 'nichoth.com'  // handle or email
const PASSWORD = 'your-app-or-account-password'

// 1) login
const agent = new AtpAgent({ service: PDS })
await agent.login({ identifier: IDENTIFIER, password: PASSWORD })

// 2) ask PDS to email you a short code for DID updates
await agent.com.atproto.identity.requestPlcOperationSignature()

// >>> check your email for the code <<<
const emailCode = process.env.PLC_CODE!

// 3) build + sign the PLC operation
// Put handle URI and GitHub URL in the list
const alsoKnownAs = [
  `at://${IDENTIFIER}`,
  'https://github.com/nichoth'
]

// sign the operation (the SDK handles the exact payload shape)
const signed = await agent.com.atproto.identity.signPlcOperation({
    token: emailCode,
    alsoKnownAs
})

// 4) submit it to the PLC directory
await agent.com.atproto.identity.submitPlcOperation({
    operation: signed.data.operation
})

console.log('Updated DID `alsoKnownAs`')
