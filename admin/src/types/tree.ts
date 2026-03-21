export type TreeNode<T> = T & {
   id: string;
   parentId?: string | null;
   children: TreeNode<T>[];
   level: number;
};
