import CreateAnAccount from "@/components/CreateAnAccount"
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image"

export default async function Home() {
  const clerkUser = await currentUser();
  if (clerkUser) redirect('/onboarding');

  return (
    <main className="max-w-4xl mx-auto h-full grid place-items-center p-3 sm:p-12 lg:p-0">
      <section className="w-full h-full md:h-fit flex flex-col md:flex-row justify-evenly md:justify-between gap-8">
        <div className="flex md:hidden">
          <Image
            src="/assets/small-x-logo.png"
            alt="X Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <div className="hidden md:flex items-center">
          <Image
            src="/assets/large-x-logo.png"
            alt="X Logo"
            width={215}
            height={215}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-16">
            <h1 className="text-6xl font-extrabold tracking-wider">Happening now</h1>
            <h3 className="text-3xl font-bold tracking-wider">Join today.</h3>
          </div>
          <CreateAnAccount />
        </div>
      </section>
    </main>
  )
}
