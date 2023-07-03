import Head from "next/head"
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "./Nav"
import { useState } from "react"
import Logo from "./Logo"

export default function Layout({children}) {
  const [showNav,setShowNav] = useState(false);
  const { data: session } = useSession()

  if(!session){
  return (
    <>

      {/* TITLE */}
      <Head>
        <title>Shoply - Streamlined Purchase</title>
      </Head>


      <div className="bg-black w-screen h-screen flex items-center">
        <div className="text-center w-full ">
        <h1 class="mt-0 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">LOGIN TO SHOPLY-ADMIN PANEL</h1><br /><br />
          <button className="btn-primary text-2xl" onClick={() => signIn('google')}>Login with Google</button><br /><br /><br />
          <button className="btn-primary text-2xl mb-20" onClick={() => signIn('github')}>Login with GitHub</button>
        </div>
      </div>

      
    </>
  )
  }

  return(
    <div className="bg-bgGray min-h-screen ">
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M3 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 5.25zm0 4.5A.75.75 0 013.75 9h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 9.75zm0 4.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      

      
      <div className="flex">
      <Nav show={showNav}/>
      <div className="flex-grow p-4">
        {children}
      </div>
      </div>
    </div>
    
  )
}
