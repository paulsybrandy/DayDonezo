'use client';

import React, { useState } from 'react';
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
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { DataTableDemo } from '../Tables/entries-table';

const moodEmojis: { [key: string]: string } = {
  happy: '😊',
  frustrated: '😣',
  excited: '😃',
  satisfied: '😌',
  curious: '🤔',
  focused: '🧐',
  accomplished: '🎉',
  collaborative: '🤝',
  motivated: '💪',
  productive: '⚡',
};

export const mockEntries = [
  {
    id: 1,
    date: '2024-12-15',
    content: 'Completed the user authentication module.',
    mood: 'happy',
    tags: ['coding', 'auth'],
  },
  {
    id: 2,
    date: '2024-12-14',
    content: 'Struggled with CSS layouts, but finally got it working.',
    mood: 'frustrated',
    tags: ['css', 'frontend'],
  },
  {
    id: 3,
    date: '2024-12-13',
    content: 'Had a productive meeting with the client. New feature ideas!',
    mood: 'excited',
    tags: ['meeting', 'planning'],
  },
  {
    id: 4,
    date: '2024-12-12',
    content: 'Fixed several bugs in the dashboard component.',
    mood: 'satisfied',
    tags: ['bugfix', 'dashboard'],
  },
  {
    id: 5,
    date: '2024-12-11',
    content:
      'Learned about WebSockets and started implementing real-time updates.',
    mood: 'curious',
    tags: ['learning', 'websockets'],
  },
  {
    id: 6,
    date: '2024-12-10',
    content: 'Refactored the state management logic for better performance.',
    mood: 'focused',
    tags: ['refactoring', 'performance'],
  },
  {
    id: 7,
    date: '2024-12-09',
    content: 'Implemented dark mode across the entire application.',
    mood: 'accomplished',
    tags: ['darkmode', 'ui'],
  },
  {
    id: 8,
    date: '2024-12-08',
    content: 'Conducted a code review session with the team.',
    mood: 'collaborative',
    tags: ['teamwork', 'codereview'],
  },
  {
    id: 9,
    date: '2024-12-07',
    content: 'Started working on the new analytics dashboard.',
    mood: 'motivated',
    tags: ['analytics', 'dashboard'],
  },
  {
    id: 10,
    date: '2024-12-06',
    content: 'Optimized database queries for faster load times.',
    mood: 'productive',
    tags: ['database', 'optimization'],
  },
];

export const tagColors: Record<string, string> = {
  database: 'yellow',
  optimization: 'blue',
  analytics: 'cyan',
  dashboard: 'gray',
  teamwork: 'red',
  codereview: 'yellow',
  darkmode: 'blue',
  ui: 'cyan',
  refactoring: 'gray',
  performance: 'red',
  learning: 'yellow',
  websockets: 'blue',
  bugfix: 'cyan',
  meeting: 'gray',
  planning: 'red',
  css: 'red',
  frontend: 'red',
  coding: 'red',
  auth: 'red',
};

export default function JournalComponent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedEntry, setSelectedEntry] = useState<(typeof mockEntries)[0]>();

  const formatDay: DateFormatter = (day) => {
    const dateGregorian = dayjs(day).format('D');

    return (
      <div>
        {mockEntries
          .map((item) => dayjs(item.date).format('DD/MM/YYYY'))
          .includes(dayjs(day).format('DD/MM/YYYY')) ? (
          <p
            className={cn(
              dayjs(date).format('DD/MM/YYYY') ===
                dayjs(day).format('DD/MM/YYYY')
                ? 'text-white'
                : 'text-green-500'
            )}
          >
            <span className="text-sm">{dateGregorian}</span>
            <span className="block text-[0.2rem] leading-3">
              <Check size={10} />
            </span>
          </p>
        ) : (
          <span
            className={cn(
              'text-sm',
              dayjs(date).format('DD/MM/YYYY') ===
                dayjs(day).format('DD/MM/YYYY')
                ? 'text-white'
                : 'text-red-500'
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
            <Popover>
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
                      mockEntries.find(
                        (item) =>
                          dayjs(item.date).format('DD-MM-YYYY') ===
                          dayjs(day).format('DD-MM-YYYY')
                      )
                    );
                  }}
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
                  mockEntries.find(
                    (item) =>
                      dayjs(item.date).format('DD-MM-YYYY') ===
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
                      <Badge variant="outline" className="text-lg">
                        Mood: {moodEmojis[selectedEntry.mood]}{' '}
                        {selectedEntry.mood}
                      </Badge>
                      {selectedEntry.tags.map((tag) => {
                        const bgColor = tagColors[tag]
                          ? `bg-${tagColors[tag]}-500`
                          : 'bg-gray-500';
                        const hoverColor = tagColors[tag]
                          ? `hover:bg-${tagColors[tag]}-600`
                          : 'hover:bg-gray-600';
                        return (
                          <Badge
                            key={tag}
                            variant="default"
                            className={`${bgColor} ${hoverColor}`}
                          >
                            <Tag className="mr-1 h-4 w-4" />
                            {tag}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {date ? (
                  selectedEntry ? (
                    <p>{selectedEntry.content}</p>
                  ) : (
                    <>
                      <p>You didn&apos;t make it. Not a winning day!</p>
                      {dayjs(new Date()).format('DD/MM/YYYY') ===
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
            <DataTableDemo mockEntries={mockEntries} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
