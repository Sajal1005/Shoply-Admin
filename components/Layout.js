import Head from "next/head"
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "./Nav"

export default function Layout({children}) {

  const { data: session } = useSession()

  if(!session){
  return (
    <>

      {/* TITLE */}
      <Head>
        <title>Shoply - Streamlined Purchase</title>
      </Head>



      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button className="bg-white p-2 px-4 rounded-lg" onClick={() => signIn('google')}>Login with Google</button>
          <button className="bg-white p-2 px-4 rounded-lg" onClick={() => signIn('github')}>Login with GitHub</button>
        </div>
      </div>
      
    </>
  )
  }

  return(
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
        {children}
      </div>
    </div>
  )
}