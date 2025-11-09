import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "mojoauth",
      name: "MojoAuth",
      credentials: {
        state_id: { label: "State ID", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.state_id) {
          throw new Error("Missing state_id")
        }

        try {
          // Verify state_id with MojoAuth
          const response = await fetch(
            `https://api.mojoauth.com/users/status?state_id=${credentials.state_id}`,
            {
              method: "GET",
              headers: {
                "X-API-Key": process.env.MOJOAUTH_CLIENT_ID!
              }
            }
          )

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error("MojoAuth API error:", response.status, errorData)
            throw new Error("Invalid or expired magic link")
          }

          const userData = await response.json()
          console.log("MojoAuth user data:", userData)
          
          const email = userData.user?.identifier || userData.identifier || userData.email

          if (!email) {
            console.error("No email in response:", userData)
            throw new Error("No email found in MojoAuth response")
          }

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user) {
            // Create new user with temporary name
            user = await prisma.user.create({
              data: {
                email,
                name: `user_${Date.now()}`, // Temporary name, will be set in complete-profile
                password: "" // No password for magic link users
              }
            })
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name
          }
        } catch (error) {
          console.error("MojoAuth verification error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      
      // Refresh user data from database on update
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string }
        })
        if (dbUser) {
          token.name = dbUser.name
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        
        // Always fetch fresh user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string }
        })
        
        if (dbUser) {
          session.user.name = dbUser.name
          session.user.email = dbUser.email
        }
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
