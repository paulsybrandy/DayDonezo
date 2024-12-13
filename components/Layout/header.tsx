import { Const } from "@/lib/contants";
import React from "react";
import { Button } from "../ui/button";
import { BookCheck, Star } from "lucide-react";
import MobileHeader from "./mobile-header";
import NumberTicker from "../ui/number-ticker";
import { RainbowButton } from "../ui/rainbow-button";

export default function Header() {
  return (
    <header className="header h-14 border-b border-gray-200 lg:px-32 px-8 sm:px-16 sticky py-2 top-0 z-50 backdrop-blur bg-background/60">
      <div className="flex justify-between items-center w-full max-w-[1400px] mx-auto h-full">
        <a className="flex items-center ">
          <BookCheck className="rotate-6 stroke-primary" size={32} />
          <span className="font-bold text-xl">{Const.APP_NAME}</span>
        </a>
        <div className="hidden items-center gap-2 lg:flex">
          <RainbowButton className="group space-x-1 h-10 rounded-md">
            <span>Star on Github</span>
            <Star
              className="group-hover:fill-yellow-500 group-hover:stroke-yellow-500 transition-colors duration-250 fill-gray-400 stroke-gray-400"
              size={20}
            />
            <NumberTicker value={100} className="text-white" />
          </RainbowButton>
          <Button variant={"default"} className="items-center text-center">
            Get Started
          </Button>
        </div>
        <MobileHeader />
      </div>
    </header>
  );
}
