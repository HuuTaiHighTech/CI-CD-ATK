import { useEffect } from 'react';
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious
} from '~/components/ui/pagination';
import { cn } from '~/utils';

interface Props {
   page: number;
   totalPages: number;
   maxVisiblePages?: number;
   autoScroll?: boolean;
   onChange: (page: number) => void;
}

function PaginationContainer({
   page,
   totalPages,
   maxVisiblePages = 5,
   autoScroll = false,
   onChange
}: Props) {
   useEffect(() => {
      if (autoScroll) {
         window.scrollTo({ top: 0, behavior: 'smooth' });
      }
   }, [page, autoScroll]);

   const handleChange = (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;
      onChange(newPage);
   };

   if (totalPages <= 1) return null;

   // Tính toán range hiển thị
   const getVisiblePages = () => {
      const pages: (number | 'ellipsis')[] = [];

      if (totalPages <= maxVisiblePages) {
         // Nếu ít trang thì hiển thị hết
         for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
         const half = Math.floor(maxVisiblePages / 2);
         let start = Math.max(1, page - half);
         let end = Math.min(totalPages, page + half);

         // Nếu gần đầu
         if (page <= half + 1) {
            start = 1;
            end = maxVisiblePages;
         }

         // Nếu gần cuối
         if (page >= totalPages - half) {
            start = totalPages - maxVisiblePages + 1;
            end = totalPages;
         }

         // Thêm ellipsis đầu
         if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('ellipsis');
         }

         // Các trang giữa
         for (let i = start; i <= end; i++) pages.push(i);

         // Thêm ellipsis cuối
         if (end < totalPages) {
            if (end < totalPages - 1) pages.push('ellipsis');
            pages.push(totalPages);
         }
      }

      return pages;
   };

   const visiblePages = getVisiblePages();

   return (
      <Pagination>
         <PaginationContent>
            <PaginationItem>
               <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                     e.preventDefault();
                     handleChange(page - 1);
                  }}
                  className={cn({
                     'pointer-events-none opacity-50': page <= 1
                  })}
               />
            </PaginationItem>

            {visiblePages.map((p, i) =>
               p === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                     <PaginationEllipsis />
                  </PaginationItem>
               ) : (
                  <PaginationItem key={p}>
                     <PaginationLink
                        href='#'
                        isActive={p === page}
                        onClick={(e) => {
                           e.preventDefault();
                           handleChange(p);
                        }}
                     >
                        {p}
                     </PaginationLink>
                  </PaginationItem>
               )
            )}

            <PaginationItem>
               <PaginationNext
                  href='#'
                  onClick={(e) => {
                     e.preventDefault();
                     handleChange(page + 1);
                  }}
                  className={cn({
                     'pointer-events-none opacity-50': page >= totalPages
                  })}
               />
            </PaginationItem>
         </PaginationContent>
      </Pagination>
   );
}

export default PaginationContainer;
