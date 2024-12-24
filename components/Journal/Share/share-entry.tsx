'use client';

import { useUser } from '@/app/_providers/user-provider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UserAvatar from '@/components/ui/user-avatar';
import { useUserStore } from '@/store/userStore';
import { Tags } from '@prisma/client';
import { Flame, Tag } from 'lucide-react';
import { Caveat } from 'next/font/google';
import { Ref } from 'react';

const montserrat = Caveat({
  variable: '--font-sans',
  weight: ['500'],
  subsets: ['latin-ext'],
});

const ImageComponent = ({
  tags,
  ref,
}: {
  tags: Tags[];
  ref: Ref<HTMLDivElement>;
}) => {
  console.log(tags);
  const { user: authUser } = useUser();
  const user = useUserStore((state) => state.user);

  return (
    <div
      className={`${montserrat.variable} flex h-[400px] w-[325px] flex-col items-center border bg-white p-4 font-sans`}
      ref={ref}
    >
      <Card className="flex h-full w-full max-w-[325px] flex-col shadow-xl">
        <CardHeader className="items-center">
          <CardTitle>Wins Of The Day</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div>
            <ul className="text-xl">
              <li>✅ Task 1</li>
              <li>✅ Task 2</li>
              <li>✅ Task 3</li>
              <li>✅ Task 4</li>
              <li>✅ Task 5</li>
            </ul>
            <div className="flex space-x-1">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  style={{ backgroundColor: `#${tag.color}` }}
                  className="flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag.name}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-col gap-2 text-center text-xl">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage
                      src={user?.photoURL ? user?.photoURL : ''}
                      alt={user.displayName!}
                      /> */}
                  <UserAvatar username={user?.avatar_seed ?? ''} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-1 flex-col justify-center text-left">
                  <span className="">{authUser?.displayName}</span>
                </div>
              </div>
              <div className="justify-centertext-orange-500 flex items-center text-amber-500">
                <Flame size={20} className="fill-amber-300 stroke-amber-500" />
                {user?.current_streak}
              </div>
            </div>
            <p className="text-sm text-primary">@DayDonezo</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImageComponent;
