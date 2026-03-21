import { useMounted } from '~/hooks';
import Editor from '~/components/ui/editor';

type Props = {
  content?: string | null;
  onChange?: (content: string) => void;
  disabled?: boolean;
};

function TextEditor({ content, onChange, disabled }: Props) {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <Editor
      content={content ?? undefined}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

export default TextEditor;
