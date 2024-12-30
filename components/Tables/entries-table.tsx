'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
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
  Copy,
  Download,
  Edit,
  MoreHorizontal,
  Share,
  Tag,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Entries } from '@/store/userStore';
import { useRef, useState } from 'react';
import ImageComponent from '../Journal/Share/share-entry';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import * as htmlToImage from 'html-to-image';
import { toast } from 'sonner';
import { OutputData } from '@editorjs/editorjs';
import Link from 'next/link';

const ActionCell = ({ row }: { row: Row<Entries> }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const hiddenContainerRef = useRef<HTMLDivElement | null>(null);
  // const [imageSrc, setImageSrc] = useState<string>('');

  // const generateImage = async () => {
  //   if (hiddenContainerRef.current) {
  //     const dataUrl = await htmlToImage.toPng(hiddenContainerRef.current, {
  //       pixelRatio: 5,
  //     });

  //     // download image
  //     const link = document.createElement('a');
  //     link.download = 'html-to-img.png';
  //     link.href = dataUrl;
  //     // link.click();
  //     setImageSrc(link.href);
  //     setIsDialogOpen(true);
  //   }
  // };

  const downloadImage = async () => {
    if (hiddenContainerRef.current) {
      const dataUrl = await htmlToImage.toPng(hiddenContainerRef.current, {
        pixelRatio: 5,
      });

      // download image
      const link = document.createElement('a');

      link.download =
        'Entry-' + dayjs(row.original.created_at).format('DD/MM/YYYY') + '.png';
      link.href = dataUrl;
      link.click();
      // setImageSrc(link.href);
      setIsDialogOpen(false);
    }
  };

  // const share = async () => {
  //   if (hiddenContainerRef.current) {
  //     const dataUrl = await htmlToImage.toPng(hiddenContainerRef.current, {
  //       pixelRatio: 5,
  //     });

  //     // download image
  //     const link = document.createElement('a');
  //     link.download = 'html-to-img.png';
  //     link.href = dataUrl;
  //     // link.click();
  //     // setImageSrc(link.href);
  //     setIsDialogOpen(true);
  //     if (navigator.share) {
  //       try {
  //         await navigator.share({
  //           title: 'Check this out!',
  //           text: 'Generated using my app.',
  //           files: [
  //             new File(
  //               [await (await fetch(link.href)).blob()],
  //               'shared-image.png',
  //               { type: 'image/png' }
  //             ),
  //           ],
  //         });
  //         alert('Image shared successfully!');
  //       } catch (error) {
  //         console.error('Error sharing the image:', error);
  //       }
  //     } else {
  //       alert('Sharing not supported in this browser.');
  //     }
  //   }
  // };

  const copyImage = async () => {
    if (hiddenContainerRef.current) {
      try {
        // Generate the image as a PNG Data URL
        const dataUrl = await htmlToImage.toPng(hiddenContainerRef.current, {
          pixelRatio: 5,
        });

        const response = await fetch(dataUrl);
        const blob = await response.blob();

        // Use Clipboard API to copy the Blob
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob, // Set the Blob type (e.g., 'image/png')
          }),
        ]);

        toast.success('Image copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy image to clipboard:', error);
        toast.error(
          'Failed to copy image. Make sure your browser supports Clipboard API.'
        );
      }
    }
  };
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* View Dialog */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entry</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex w-full items-center justify-center">
              <ImageComponent
                tags={row.original.Tags}
                ref={(el) => {
                  if (el && !hiddenContainerRef.current) {
                    hiddenContainerRef.current = el;
                  }
                }}
                content={row.original.content}
                createdAt={row.original.created_at.toISOString()}
              />
            </div>
          </DialogDescription>
          <DialogFooter className="flex flex-row">
            <div className="flex-1 space-x-2">
              {/* <Button onClick={share}>
                <ExternalLink />
              </Button> */}
              <Button onClick={copyImage}>
                <Copy />
              </Button>
            </div>

            <div className="space-x-2">
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant={'secondary'}
              >
                Close
              </Button>
              <Button onClick={downloadImage} variant={'default'}>
                <Download />
                Download
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dropdown menu for actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href={`/journal/edit/${row.original.id}`}>
            <DropdownMenuItem>
              <Edit /> Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <Share /> Share
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
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
    accessorKey: 'created_at',
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
        {dayjs(row.getValue('created_at')).format('MMM D, YYYY')}
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
    cell: ({ row }) => {
      const content = row.getValue('content') as OutputData;
      const paragraphBlock = content.blocks.find(
        (block) => block.type === 'paragraph'
      );
      const checklist = content.blocks.find(
        (block) => block.data.style === 'checklist'
      );
      const unordered = content.blocks.find(
        (block) => block.data.style === 'unordered'
      );
      const ordered = content.blocks.find(
        (block) => block.data.style === 'ordered'
      );
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
                    .map((item: { content: string }, index: number) => (
                      <>
                        {index + 1 + '. ' + item.content}
                        <br />
                      </>
                    ))}
        </p>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: () => <div>Tags</div>,
    cell: ({ row }) => {
      return (
        <div className="space-x-2">
          {row.original.Tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              style={{ backgroundColor: `#${tag.color}` }}
              className="text-white"
            >
              <Tag className="mr-1 h-4 w-4" />
              {tag.name}
            </Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return false;
      return row.original.Tags.some((tag) => tag.name === filterValue); // true or false based on your custom logic
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

export function DataTableDemo({ data }: { data: Entries[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [tagFilterOpen, setTagFilterOpen] = React.useState(false);
  const [tagValue, setTagValue] = React.useState('');

  const table = useReactTable({
    data,
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

  const allTags = Array.from(new Set(data.flatMap((entry) => entry.Tags)));

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
                ? allTags.find((tag) => tag.name === tagValue)?.name
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
                      key={tag.id}
                      value={tag.name}
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
                        style={{ backgroundColor: `#${tag.color}` }}
                        className="text-white"
                      >
                        {tag.name}
                      </Badge>

                      <Check
                        className={cn(
                          'ml-auto',
                          tagValue === tag.name ? 'opacity-100' : 'opacity-0'
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
      {/* Hidden container for the image component */}

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
