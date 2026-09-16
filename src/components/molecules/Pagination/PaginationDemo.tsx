"use client";

import { useState } from "react";
import Pagination from "./Pagination";

export default function PaginationDemo() {
  const [page, setPage] = useState(1);

  return <Pagination page={page} totalPages={6} onPageChange={setPage} />;
}
