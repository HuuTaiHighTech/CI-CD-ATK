import { EditorContent, useEditor } from '@tiptap/react';

import { RichTextProvider } from 'reactjs-tiptap-editor';
import { toast } from 'sonner';

import { http } from '~/config';
import { AxiosError } from '~/utils';

// Base Kit
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Dropcursor, Gapcursor, TrailingNode } from '@tiptap/extensions';
import { HardBreak } from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

// Extension
import {
  History,
  RichTextUndo,
  RichTextRedo
} from 'reactjs-tiptap-editor/history';
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading';
import { FontSize, RichTextFontSize } from 'reactjs-tiptap-editor/fontsize';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold';
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic';
import {
  TextUnderline,
  RichTextUnderline
} from 'reactjs-tiptap-editor/textunderline';
import { Strike, RichTextStrike } from 'reactjs-tiptap-editor/strike';
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link';
import { TextAlign, RichTextAlign } from 'reactjs-tiptap-editor/textalign';
import {
  OrderedList,
  RichTextOrderedList
} from 'reactjs-tiptap-editor/orderedlist';
import {
  BulletList,
  RichTextBulletList
} from 'reactjs-tiptap-editor/bulletlist';
import { Color, RichTextColor } from 'reactjs-tiptap-editor/color';
import { Highlight, RichTextHighlight } from 'reactjs-tiptap-editor/highlight';
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image';
import { Video, RichTextVideo } from 'reactjs-tiptap-editor/video';
import { Table, RichTextTable } from 'reactjs-tiptap-editor/table';

// Import CSS
import 'reactjs-tiptap-editor/style.css';

type Props = {
  content?: string;
  onChange?: (content: string) => void;
  disabled?: boolean;
};

const handleUpload = async (file: File) => {
  const toastId = toast.loading('Đang tải ảnh...');
  try {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await http.post('/uploads', formData);
    toast.success('Tải ảnh thành công!', { id: toastId });
    return data.url;
  } catch (error) {
    const { message } = AxiosError(error);
    toast.error(message, { id: toastId });
    throw error;
  }
};

const extensions = [
  History,
  Document,
  Text,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  FontSize,
  Heading,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  Link,
  TextAlign,
  BulletList,
  OrderedList,
  Color,
  Highlight,
  Image.configure({
    maxSize: 5 * 1024 * 1024,
    upload: handleUpload
  }),
  Video,
  Table
];

const RichTextToolbar = () => {
  return (
    <div className='flex items-center flex-wrap shrink-0 p-2'>
      <RichTextUndo />
      <RichTextRedo />
      <div className='h-5 w-px bg-neutral-200 mx-2' />
      <RichTextHeading />
      <RichTextFontSize />
      <div className='h-5 w-px bg-neutral-200 mx-2' />
      <RichTextBold />
      <RichTextItalic />
      <RichTextUnderline />
      <RichTextStrike />
      <RichTextLink />
      <div className='h-5 w-px bg-neutral-200 mx-2' />
      <RichTextColor />
      <div className='mx-1' />
      <RichTextHighlight />
      <div className='h-5 w-px bg-neutral-200 mx-2' />
      <RichTextBulletList />
      <RichTextOrderedList />
      <RichTextAlign />
      <div className='h-5 w-px bg-neutral-200 mx-2' />
      <RichTextTable />
      <RichTextImage />
      <RichTextVideo />
    </div>
  );
};

function Editor({ content, onChange, disabled }: Props) {
  const editor = useEditor({
    textDirection: 'auto',
    extensions,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'outline-none'
      }
    },
    editable: !disabled,
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    }
  });

  if (!editor) return null;

  return (
    <div className='w-full border border-neutral-200 rounded-xl overflow-hidden'>
      <RichTextProvider editor={editor}>
        <div className='flex flex-col'>
          <RichTextToolbar />
          <div className='h-px bg-neutral-200' />
          <EditorContent
            editor={editor}
            className='flex-1 max-h-280 overflow-auto'
          />
        </div>
      </RichTextProvider>
    </div>
  );
}

export default Editor;
