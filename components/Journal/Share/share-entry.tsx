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
import { OutputData } from '@editorjs/editorjs';
import { Tags } from '@prisma/client';
import dayjs from 'dayjs';
import { Flame, Tag } from 'lucide-react';
import { Caveat } from 'next/font/google';
import { Ref, useMemo } from 'react';

const montserrat = Caveat({
  variable: '--font-sans',
  weight: ['500'],
  subsets: ['latin-ext'],
});

const ImageComponent = ({
  tags,
  ref,
  content,
  createdAt,
}: {
  tags: Tags[];
  ref: Ref<HTMLDivElement>;
  content: OutputData;
  createdAt: string;
}) => {
  const { user: authUser } = useUser();
  const user = useUserStore((state) => state.user);

  const paragraphBlock = useMemo(
    () => content.blocks.find((block) => block.data.style === 'paragraphBlock'),
    [content]
  );

  const checklist = useMemo(
    () => content.blocks.find((block) => block.data.style === 'checklist'),
    [content]
  );

  const unordered = useMemo(
    () => content.blocks.find((block) => block.data.style === 'unordered'),
    [content]
  );

  const ordered = useMemo(
    () => content.blocks.find((block) => block.data.style === 'ordered'),
    [content]
  );

  return (
    <div
      className={`${montserrat.variable} flex h-[400px] w-[325px] flex-col items-center border bg-white p-4 font-sans`}
      ref={ref}
    >
      <Card className="flex h-full w-full max-w-[325px] flex-col shadow-xl">
        <CardHeader className="items-center">
          <CardTitle>
            <h2>Wins Of The Day</h2>
            <div className="w-full text-center text-base">
              {dayjs(createdAt).format("D MMM 'YY")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-xl" key={content.time}>
            {paragraphBlock
              ? paragraphBlock?.data.text
              : checklist?.data.items.length > 0
                ? checklist?.data.items
                    .slice(0, 5)
                    .map((item: { content: string }, index: number) => (
                      <div key={index}>
                        {'✅ ' + item.content}
                        <br />
                      </div>
                    ))
                : unordered?.data.items.length > 0
                  ? unordered?.data.items
                      .slice(0, 5)
                      .map((item: { content: string }, index: number) => (
                        <div key={index}>
                          {'• ' + item.content}
                          <br />
                        </div>
                      ))
                  : ordered?.data.items
                      .slice(0, 5)
                      .map((item: { content: string }, index: number) => (
                        <>
                          {index + 1 + '. ' + item.content}
                          <br />
                        </>
                      ))}
            <div className="mt-2 flex space-x-1">
              {tags &&
                tags.map((tag) => (
                  <div
                    key={tag.id}
                    style={{ backgroundColor: `#${tag.color}` }}
                    className="flex items-center rounded-full border px-2.5 py-0.5 text-xs text-white transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
