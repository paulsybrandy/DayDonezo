'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditorJS, { BlockToolConstructable } from '@editorjs/editorjs';
import { useEffect, useRef, useState } from 'react';
import Title from 'title-editorjs';
import dayjs from 'dayjs';
import { TagCreator } from '../New/tag-creator';
import EditorjsList from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import { decryptData, encryptData } from '@/lib/utils';
import { toast } from 'sonner';
import { getEntryFromId, updateEntryDetails } from '@/app/actions';
import { useMutation } from '@tanstack/react-query';
import { Entries, useUserStore } from '@/store/userStore';
import { useParams } from 'next/navigation';
import Loader from '@/components/Layout/loader';

export default function EditJournalEntry() {
  const params = useParams<{ id: string }>();

  const setJournalEntries = useUserStore((state) => state.setJournalEntries);

  const journalEntries = useUserStore((state) => state.journalEntries);

  const editorRef = useRef<EditorJS | null>(null);
  const [entry, setEntry] = useState<Entries | null>(
    journalEntries?.find((entry) => entry.id === +params.id) ?? null
  );

  const [tags, setTags] = useState<{ name: string; color: string }[]>(
    journalEntries?.find((entry) => entry.id === +params.id)?.Tags ?? []
  );

  const fetchEntryMutation = useMutation({
    mutationFn: async () => {
      const res = await getEntryFromId(+params.id);
      if (res?.success) {
        if (res.entry) {
          const decoder = new TextDecoder();

          const newEntry = {
            ...res.entry,
            content: JSON.parse(
              decryptData(decoder.decode(res.entry?.content))
            ),
          };

          setEntry(newEntry);
          setTags(newEntry.Tags);
          console.log(entry);
        }
      } else {
        toast.error(res?.message);
      }
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async () => {
      if (editorRef.current)
        editorRef.current
          .save()
          .then(async (outputData) => {
            const encrp = encryptData(JSON.stringify(outputData));

            let text = '';
            outputData.blocks.forEach((block) => {
              if (block.type === 'paragraph') {
                text += block.data.text;
              } else if (block.type === 'list') {
                block.data.items.forEach((item: unknown) => {
                  text += item;
                });
              } else if (block.type === 'title') {
                text += block.data.text;
              }
            });
            if (text.length > 750) {
              toast.error('Entry is too long. Max 750 characters');
            } else if (text.toString().trim().length === 0) {
              toast.error('Please write something');
            } else {
              if (tags.length < 1) {
                toast.error('Please add at least one tag');
              } else {
                const newTags = tags.filter((tag) =>
                  entry?.Tags.some((t) => t.name !== tag.name)
                );
                console.log(newTags);

                const data = await updateEntryDetails(
                  encrp,
                  newTags,
                  +params.id
                );
                if (data?.success) {
                  const decoder = new TextDecoder();

                  if (data?.entry) {
                    const newEntry: Entries = {
                      id: data.entry.id,
                      uid: data.entry.uid,
                      content: JSON.parse(
                        decryptData(decoder.decode(data.entry.content))
                      ),
                      created_at: data.entry.created_at,
                      Tags: data.entry.Tags,
                    };
                    if (journalEntries && journalEntries?.length > 0) {
                      setJournalEntries([...journalEntries, newEntry]);
                    } else {
                      setJournalEntries([newEntry]);
                    }
                  }

                  toast.success('Entry updated successfully');
                } else {
                  toast.error(data?.message);
                }
              }
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const fetchEntryMutationRef = useRef(fetchEntryMutation);

  useEffect(() => {
    fetchEntryMutationRef.current = fetchEntryMutation;

    if (entry && !editorRef.current) {
      editorRef.current = new EditorJS({
        holder: 'editor',
        tools: {
          title: Title,
          paragraph: {
            class: Paragraph as unknown as BlockToolConstructable,
          },
          list: {
            class: EditorjsList as unknown as BlockToolConstructable,
            inlineToolbar: true,
            config: {
              style: 'checklist',
            },
          },
        },
        data: entry.content,
        placeholder: 'Finished chapter 3 of...',
      });
    } else if (!entry) {
      fetchEntryMutationRef.current.mutate();
    }

    return () => {
      if (editorRef.current && editorRef && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateEntryMutation.mutate();
  };

  if (!entry && fetchEntryMutation.isPending) {
    return <Loader />;
  }

  if (entry)
    return (
      <section className="w-full place-content-center justify-items-center p-4 py-3 lg:px-16">
        <Card className="w-full max-w-3xl flex-1">
          <CardHeader>
            <CardTitle>
              <span>{dayjs().format('MMMM DD, YYYY • h:mm a')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                Add tags <span>(Max 5)</span>
              </p>
              <TagCreator setTags={setTags} tags={tags} />
              <p>
                Write your accomplishments <span>(Max 750 chars)</span>
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div id="editor" className="rounded-md border p-2"></div>
                <Button type="submit" className="">
                  Save
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </section>
    );
}
