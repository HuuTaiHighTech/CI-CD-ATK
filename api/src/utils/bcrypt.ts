import b from 'bcrypt';

const bcrypt = {
   hash: (text: string, salt: number = 10): Promise<string> => {
      return b.hash(text, salt);
   },
   compare: async (raw: string, hash: string): Promise<boolean> => {
      return b.compare(raw, hash);
   }
};

export default bcrypt;
