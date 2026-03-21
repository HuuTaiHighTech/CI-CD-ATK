import { useState } from 'react';

function useCopyToClipboard() {
   const [isCopied, setIsCopied] = useState(false);

   const copyToClipboard = async (text: string) => {
      try {
         await navigator.clipboard.writeText(text);
         setIsCopied(true);
         setTimeout(() => setIsCopied(false), 2000);
         return true;
      } catch {
         return false;
      }
   };

   return { copyToClipboard, isCopied };
}
export default useCopyToClipboard;
