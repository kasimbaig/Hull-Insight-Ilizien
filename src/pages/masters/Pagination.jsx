import React from 'react';
import { Button } from '@/components/ui/button';

const Pagination = ({ page, setPage, hasNext, hasPrev }) => (
  <div className="flex items-center justify-center gap-2 mt-2 mb-2">
    <Button
      size="sm"
      variant="outline"
      onClick={() => setPage(page - 1)}
      disabled={!hasPrev || page === 1}
      className="px-3 py-1"
    >
      &lt;
    </Button>
    <span className="text-sm font-medium">Page {page}</span>
    <Button
      size="sm"
      variant="outline"
      onClick={() => setPage(page + 1)}
      disabled={!hasNext}
      className="px-3 py-1"
    >
      &gt;
    </Button>
  </div>
);

export default Pagination;
