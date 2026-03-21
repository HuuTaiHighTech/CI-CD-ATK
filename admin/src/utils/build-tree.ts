import type { TreeNode } from '~/types';

type WithParent = { id: string; parentId?: string | null };

export function buildTree<T extends WithParent>(items: T[]): TreeNode<T>[] {
   const map = new Map<string, TreeNode<T>>();
   const roots: TreeNode<T>[] = [];

   items.forEach((item) => {
      map.set(item.id, { ...item, children: [], level: 0 });
   });

   items.forEach((item) => {
      const node = map.get(item.id)!;
      if (item.parentId && map.has(item.parentId)) {
         const parent = map.get(item.parentId)!;
         node.level = parent.level + 1;
         parent.children.push(node);
      } else {
         roots.push(node);
      }
   });

   return roots;
}

export function flattenTree<T>(nodes: TreeNode<T>[]): TreeNode<T>[] {
   const result: TreeNode<T>[] = [];
   const traverse = (nodes: TreeNode<T>[]) => {
      nodes.forEach((node) => {
         result.push(node);
         if (node.children.length) traverse(node.children);
      });
   };
   traverse(nodes);
   return result;
}
