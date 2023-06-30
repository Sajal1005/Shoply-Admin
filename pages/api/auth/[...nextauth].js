// [].js tells [] can take any value instead of some particular path '/pages/api/auth/nextauth.js'
// Can be used as placeholder

import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github";
// import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from '../../../lib/mongodb'
import { MongoDBAdapter } from "@auth/mongodb-adapter"

const adminEmails = ["nandasajal.208@gmail.com"]
const adminNames = ["Sajal Nanda"]

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET
    // }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: 'NextAuth.js <no-reply@example.com>'
    // }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session:({session,token,user}) => {
      console.log(user);
      if(adminEmails.includes(session?.user?.email) || adminNames.includes(session?.user?.name)){
        return session;
      }else{
        return false;
      }
    }
  }
};

export default NextAuth(authOptions);

export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOptions);
  if (!adminEmails.includes(session?.user?.email) || !adminNames.includes(session?.user?.name)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}