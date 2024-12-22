'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Tag,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '../ui/badge';
import dayjs from 'dayjs';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type Entries = {
  id: number;
  date: string;
  content: string;
  mood: string;
  tags: string[];
};

const tagColors: Record<string, string> = {
  database: '#EAB308',
  optimization: '#3B82F6',
  analytics: '#06B6D4',
  dashboard: '#6B7280',
  teamwork: '#EF4444',
  codereview: '#EAB308',
  darkmode: '#3B82F6',
  ui: '#06B6D4',
  refactoring: '#6B7280',
  performance: '#EF4444',
  learning: '#EAB308',
  websockets: '#3B82F6',
  bugfix: '#06B6D4',
  meeting: '#6B7280',
  planning: '#EF4444',
  css: '#EF4444',
  frontend: '#EF4444',
  coding: '#EF4444',
  auth: '#EF4444',
};

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

export const columns: ColumnDef<Entries>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {dayjs(row.getValue('date')).format('MMM D, YYYY')}
      </div>
    ),
  },
  {
    accessorKey: 'content',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Content
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('content')}</div>
    ),
  },
  {
    accessorKey: 'tags',
    header: () => <div>Tags</div>,
    cell: ({ row }) => {
      return (
        <div className="space-x-2">
          {row.original.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              style={{ backgroundColor: tagColors[tag] }}
              className="text-white"
            >
              <Tag className="mr-1 h-4 w-4" />
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return false;
      return row.original.tags.includes(filterValue); // true or false based on your custom logic
    },
  },
  {
    accessorKey: 'mood',
    header: 'Mood',
    cell: ({ row }) => (
      <div className="capitalize">{moodEmojis[row.original.mood]}</div>
    ),
  },
  // {
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const entry = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(entry.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export function DataTableDemo({ mockEntries }: { mockEntries: Entries[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [tagFilterOpen, setTagFilterOpen] = React.useState(false);
  const [moodFilterOpen, setMoodFilterOpen] = React.useState(false);
  const [tagValue, setTagValue] = React.useState('');
  const [moodValue, setMoodValue] = React.useState('');

  const table = useReactTable({
    data: mockEntries,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const allTags = Array.from(
    new Set(mockEntries.flatMap((entry) => entry.tags))
  );
  const allMoods = Array.from(
    new Set(mockEntries.flatMap((entry) => entry.mood))
  );

  return (
    <div className="w-full">
      <div className="flex flex-col justify-between gap-2 py-4 *:w-full md:flex-row">
        {/* SEARCH FILTER */}
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn('content')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('content')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* TAGS FILTER */}
        <Popover open={tagFilterOpen} onOpenChange={setTagFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={tagFilterOpen}
              className="w-[200px] justify-between"
            >
              {tagValue
                ? allTags.find((tag) => tag === tagValue)
                : 'Select tags...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search tag..." />
              <CommandList>
                <CommandEmpty>No tag found.</CommandEmpty>
                <CommandGroup>
                  {allTags.map((tag) => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={(currentValue) => {
                        setTagValue(
                          currentValue === tagValue ? '' : currentValue
                        );
                        setTagFilterOpen(false);
                        table
                          .getColumn('tags')
                          ?.setFilterValue(
                            currentValue === tagValue ? '' : currentValue
                          );
                      }}
                    >
                      <Badge
                        variant="default"
                        style={{ backgroundColor: tagColors[tag] }}
                        className="text-white"
                      >
                        {tag}
                      </Badge>

                      <Check
                        className={cn(
                          'ml-auto',
                          tagValue === tag ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* MOOD FILTER */}
        <Popover open={moodFilterOpen} onOpenChange={setMoodFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={moodFilterOpen}
              className="w-[200px] justify-between"
            >
              {moodValue
                ? moodEmojis[allMoods.find((mood) => mood === moodValue)!]
                : 'Select mood...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search tag..." />
              <CommandList>
                <CommandEmpty>No mood found.</CommandEmpty>
                <CommandGroup>
                  {allMoods.map((mood) => (
                    <CommandItem
                      key={mood}
                      value={mood}
                      onSelect={(currentValue) => {
                        setMoodValue(
                          currentValue === moodValue ? '' : currentValue
                        );
                        setMoodFilterOpen(false);
                        table
                          .getColumn('mood')
                          ?.setFilterValue(
                            currentValue === moodValue ? '' : currentValue
                          );
                      }}
                    >
                      {moodEmojis[mood]}

                      <Check
                        className={cn(
                          'ml-auto',
                          moodValue === mood ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* COLUMN VISIBILITY TOGGLE FILTER */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
