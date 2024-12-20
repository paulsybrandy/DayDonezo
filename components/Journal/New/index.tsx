'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditorJS from '@editorjs/editorjs';
import Quote from '@editorjs/quote';
import Paragraph from '@editorjs/paragraph';
import { useEffect, useRef, useState } from 'react';
import Title from 'title-editorjs';
import dayjs from 'dayjs';
import { TagCreator } from './tag-creator';

export default function NewJournalEntry() {
  const [entry, setEntry] = useState('');
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: 'editor',
        tools: {
          title: Title,
          quote: Quote,
          paragraph: Paragraph,
        },
        placeholder: 'Write your thoughts...',
        onChange: async () => {
          const content = await editorRef.current?.save();
          setEntry(JSON.stringify(content));
        },
      });
    }

    return () => {
      if (editorRef.current && editorRef && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting entry:', entry);
    // TODO: Implement journal entry submission
  };

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
            <p>Add tags</p>
            <TagCreator />
            <p>Write your accomplishments...</p>
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
