import { createPortal } from 'react-dom';
import { useMounted } from '~/hooks';

type Props = {
  children: React.ReactNode;
};

const Portal = ({ children }: Props) => {
  const mounted = useMounted();
  if (!mounted) return null;
  return createPortal(children, document.body);
};

export default Portal;
