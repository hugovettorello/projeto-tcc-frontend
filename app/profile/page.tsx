import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/app/_lib/auth-client";
import { getNumberOfCompletedDays } from "@/app/_lib/api/fetch-generated";
import { Navbar } from "@/components/navbar";
import { BackButton } from "./_components/back-button";
import { SignOutButton } from "./_components/sign-out-button";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session?.data?.user) redirect("/auth");

  const result = await getNumberOfCompletedDays();
  const numberOfDays = result.status === 200 ? result.data.numberOfDays : 0;
  const firstName = session.data.user.name?.split(" ")[0] ?? "Usuário";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="relative bg-home-hero rounded-b-[40px] overflow-hidden h-[300px] flex flex-col justify-end">
        <Image
          src="/profile-background.jpg"
          alt=""
          fill
          className="object-cover opacity-40"
        />
        <BackButton />
        <div className="relative z-10 px-6 pb-8">
          <h1 className="font-space-grotesk font-bold text-2xl text-background leading-snug">
            Aqui está sua conta, {firstName}
          </h1>
        </div>
      </div>

      <div className="flex-1 px-5 pb-24 flex flex-col items-center gap-6 pt-8">
        <p className="font-bold text-foreground text-center text-base">
          Dias que você realizou tudo que planejou:
        </p>

        <div className="bg-home-nav rounded-[24px] flex items-center justify-center w-[180px] h-[170px]">
          <span className="font-space-grotesk font-bold text-background leading-none" style={{ fontSize: "8rem" }}>
            {numberOfDays}
          </span>
        </div>

        <SignOutButton />
      </div>

      <Navbar />
    </div>
  );
}
