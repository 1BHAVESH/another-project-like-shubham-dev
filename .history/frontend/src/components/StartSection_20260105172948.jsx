// components/StatsSection.jsx

import { useGetHomePageQuery } from "@/redux/features/homePageApi";
import { Award, Building, Trophy, UsersRound, UserStar } from "lucide-react";

import bgImg from "../assets/2.webp"
export default function StatsSection() {

   const { data, isLoading } = useGetHomePageQuery();
  
    if (isLoading) return <h1 className="text-white">wait...</h1>;

    const states = data.stats ? data?.stats : ""

    //console.log(states)
  

  return (
      <section
      className="relative py-16 lg:h-[170px]"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      }}
    >

       <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 max-w-[1300px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">

        {/* STAT ITEM */}
        <div className="flex items-center space-x-2 text-white">
          <div className="w-14 h-14 border-2 bg-white text-black border-[#d4af37] rounded-full flex items-center justify-center">
           <Trophy />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#d4af37] leading-none">{states.awards}</h2>
            <p className="text-sm text-yellow-400 mt-1">Award Winning</p>
          </div>
        </div>

        {/* STAT ITEM */}
        <div className="flex items-center space-x-4 text-white">
          <div className="w-14 h-14 bg-white text-black border-2 border-[#d4af37] rounded-full flex items-center justify-center">
           <Building />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#d4af37] leading-none">{states.projects}</h2>
            <p className="text-sm text-yellow-400 mt-1 font-light">Projects Ready</p>
          </div>
        </div>

        {/* STAT ITEM */}
        <div className="flex items-center space-x-4 text-white">
          <div className="w-14 h-14 bg-white text-black border-2 border-[#d4af37] rounded-full flex items-center justify-center">
           <UserStar />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#d4af37] leading-none">{states.clients}</h2>
            <p className="text-sm text-yellow-400 mt-1">Happy Client</p>
          </div>
        </div>

        {/* STAT ITEM */}
        <div className="flex items-center space-x-4 text-white">
          <div className="w-14 h-14 bg-white text-black border-2 border-[#d4af37] rounded-full flex items-center justify-center">
            <UsersRound />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#d4af37] leading-none">{states.team}</h2>
            <p className="text-sm text-yellow-400 mt-1 ">Team Members</p>
          </div>
        </div>

      </div>
    </section>
  );
}
