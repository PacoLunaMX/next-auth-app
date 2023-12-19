import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import User from "@/app/(models)/User"
import bcrypt from bcrypt


export const options = {
    providers:[
        GitHubProvider({
            profile(profile){
                console.log("Profile Github:", profile)

                let userRole = "Github User"
                if(profile?.email == "email@example.com"){
                    userRole = "admin"
                }
                return {
                    ...profile,
                    role: userRole
                }
            },
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            profile(profile){
                console.log("Profile Google:", profile)

                let userRole = "Google User"
                if(profile?.email == "email@example.com"){
                    userRole = "admin"
                }
                return {
                    ...profile,
                    id: profile.sub,
                    role: userRole
                }
            },
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            
        }),
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{
                    lable:"email:",
                    type:"text",
                    placeholder:"your-email"
                },
                pawssord:{
                    lable:"pawssord:",
                    type:"pawssord",
                    placeholder:"your-pawssord"
                },
            },
            async authorize(credentials){
                try {
                    const foundUser = await User.findOne({email: credentials.email}).lean().exect();
                    if(foundUser){
                        console.log("User exists")
                        const match = await bcrypt.compare(credentials.password, foundUser.password)
                        if(match){
                            console.log("Good Pass")
                            delete foundUser.password
                            foundUser["role"] = "Unverifed Email"
                            return foundUser
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
                return null
            }
        }),
    ],
    callbacks:{
        async jwt({token, user}){
            if(user)token.role = user.roler
            return token
        },
        async session({session, token}){
            if(session?.user) session.user.role = token.role
            return session
        }
    }
}
