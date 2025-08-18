import { createAuthClient } from "better-auth/react"

import { polarClient } from "@polar-sh/better-auth"
export const authClient = createAuthClient({
    plugins: [polarClient()],
    /** The base URL of the server (optional if you're using the same domain) */
   
})