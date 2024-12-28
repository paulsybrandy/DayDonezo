'use client';

import React, { useRef, useState } from 'react';
import { Calendar } from '../ui/calendar';
import { DateFormatter } from 'react-day-picker';
import { CalendarIcon, Check, NotebookPen, Tag } from 'lucide-react';
import dayjs from 'dayjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn, decryptData } from '@/lib/utils';
import { Button } from '../ui/button';
import { DataTableDemo } from '../Tables/entries-table';
import { useMutation } from '@tanstack/react-query';
import { getUserEntries } from '@/app/actions';
import { Entries, useUserStore } from '@/store/userStore';
import Loader from '../Layout/loader';

export default function JournalComponent() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedEntry, setSelectedEntry] = useState<Entries>();

  const user = useUserStore((state) => state.user);

  const fetchEntriesRef = useRef(false);

  const journalEntries = useUserStore((state) => state.journalEntries);
  const setJournalEntries = useUserStore((state) => state.setJournalEntries);

  const fetchEntriesMutation = useMutation({
    mutationFn: async () => {
      if (user && user.uid) {
        const entries = await getUserEntries(user?.uid);
        console.log(entries);
        const decoder = new TextDecoder();
        console.log(decoder);
        const newEntries = entries.map((entry) => ({
          ...entry,
          content: JSON.parse(decryptData(decoder.decode(entry.content))),
        }));

        return newEntries;
      }
    },
    onSuccess: (result) => {
      setJournalEntries(result!);
      console.log(result);
      setSelectedEntry(
        result?.find(
          (item) =>
            dayjs(item.created_at).format('DD-MM-YYYY') ===
            dayjs(dayjs()).format('DD-MM-YYYY')
        )
      );
    },
  });

  if (!journalEntries && !user) {
    return <Loader />;
  }

  if (!journalEntries && user?.uid && !fetchEntriesRef.current) {
    fetchEntriesRef.current = true;
    fetchEntriesMutation.mutate();
  }

  const formatDay: DateFormatter = (day) => {
    const dateGregorian = dayjs(day).format('D');

    const formattedDate = dayjs(date).format('DD/MM/YYYY');
    const formattedDay = dayjs(day).format('DD/MM/YYYY');
    const isToday = formattedDate === formattedDay;
    const isPastDate = dayjs(day).isBefore(dayjs());
    const isInMockEntries = journalEntries
      ?.map((item) => dayjs(item.created_at).format('DD/MM/YYYY'))
      .includes(formattedDay);

    return (
      <div>
        {isInMockEntries ? (
          <p className={cn(isToday ? 'text-white' : 'text-green-500')}>
            <span className="text-sm">{dateGregorian}</span>
            <span className="block text-[0.2rem] leading-3">
              <Check size={10} />
            </span>
          </p>
        ) : (
          <span
            className={cn(
              'text-sm',
              isToday
                ? 'text-white'
                : isPastDate
                  ? 'text-red-500'
                  : 'text-black'
            )}
          >
            {dateGregorian}
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="w-auto flex-1 space-y-4 overflow-auto p-4 py-4 lg:px-16">
      <div className="mx-auto justify-items-center space-y-6">
        <Card className="inline-block w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Journal Entries</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 lg:flex-row">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="flex lg:hidden">
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon />
                  {date ? (
                    dayjs(date).format('MMMM D, YYYY')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(day) => {
                    setDate(day);
                    setSelectedEntry(
                      journalEntries?.find(
                        (item) =>
                          dayjs(item.created_at).format('DD-MM-YYYY') ===
                          dayjs(day).format('DD-MM-YYYY')
                      )
                    );
                    setOpen(false);
                  }}
                  formatters={{ formatDay }}
                  disabled={(day) => dayjs(day) >= dayjs(new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => {
                setDate(day);
                setSelectedEntry(
                  journalEntries?.find(
                    (item) =>
                      dayjs(item.created_at).format('DD-MM-YYYY') ===
                      dayjs(day).format('DD-MM-YYYY')
                  )
                );
              }}
              className="hidden rounded-md border lg:block"
              formatters={{ formatDay }}
              disabled={(day) => dayjs(day) >= dayjs(new Date())}
            />
            <Card>
              <CardHeader>
                <CardTitle>
                  {date
                    ? `Entry for ${dayjs(date).format('D MMMM, YYYY')}`
                    : 'No entry selected'}
                </CardTitle>
                {selectedEntry && (
                  <CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.Tags.map((tag) => {
                        return (
                          <Badge
                            key={tag.id}
                            variant="default"
                            style={{ backgroundColor: `#${tag.color}` }}
                          >
                            <Tag className="mr-1 h-4 w-4" />
                            {tag.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {date ? (
                  selectedEntry && selectedEntry.content ? (
                    (() => {
                      const paragraphBlock = selectedEntry.content.blocks.find(
                        (block) => block.type === 'paragraph'
                      );
                      const checklist = selectedEntry.content.blocks.find(
                        (block) => block.data.style === 'checklist'
                      );
                      const unordered = selectedEntry.content.blocks.find(
                        (block) => block.data.style === 'unordered'
                      );
                      const ordered = selectedEntry.content.blocks.find(
                        (block) => block.data.style === 'ordered'
                      );
                      console.log(checklist);
                      return (
                        <p>
                          {paragraphBlock
                            ? paragraphBlock?.data.text
                            : checklist?.data.items.length > 0
                              ? checklist?.data.items
                                  .slice(0, 5)
                                  .map((item: { content: string }) => (
                                    <>
                                      {'✅ ' + item.content}
                                      <br />
                                    </>
                                  ))
                              : unordered?.data.items.length > 0
                                ? unordered?.data.items
                                    .slice(0, 5)
                                    .map((item: { content: string }) => (
                                      <>
                                        {'• ' + item.content}
                                        <br />
                                      </>
                                    ))
                                : ordered?.data.items
                                    .slice(0, 5)
                                    .map(
                                      (
                                        item: { content: string },
                                        index: number
                                      ) => (
                                        <>
                                          {index + 1 + '. ' + item.content}
                                          <br />
                                        </>
                                      )
                                    )}
                        </p>
                      );
                    })()
                  ) : (
                    <>
                      <p>You didn&apos;t make it. Not a winning day!</p>
                      {dayjs().format('DD/MM/YYYY') ===
                        dayjs(date).format('DD/MM/YYYY') && (
                        <Button>
                          <NotebookPen />
                          Jot Your Victories
                        </Button>
                      )}
                    </>
                  )
                ) : (
                  <p>Select a date to view the entry.</p>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {journalEntries && <DataTableDemo data={journalEntries!} />}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
