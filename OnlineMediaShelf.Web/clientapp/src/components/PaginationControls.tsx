import {
  Col,
  Pagination
} from "react-bootstrap";

interface PaginationControlsProps {
  pageCount: number,
  page: number,
  onPageChange: (newPage: number) => void
}

export function PaginationControls({
                                     pageCount,
                                     page,
                                     onPageChange
                                   }: PaginationControlsProps) {
  return <Col
    className={"d-flex justify-content-center align-items-center my-3"}>
    {pageCount > 1 &&
        <Pagination>
            <Pagination.First
                disabled={page == 0}
                onClick={() => onPageChange(0)}/>
            <Pagination.Prev
                disabled={page == 0}
                onClick={() => onPageChange(page - 1)}/>
          {Array.apply(null, Array(pageCount)).map((_, i) => (<>
            <Pagination.Item
              key={i}
              active={i === page}
              onClick={() => onPageChange(i)}>
              {i + 1}
            </Pagination.Item>
          </>))}
            <Pagination.Next
                disabled={page == pageCount - 1}
                onClick={() => onPageChange(page + 1)}/>
            <Pagination.Last
                disabled={page == pageCount - 1}
                onClick={() => onPageChange(pageCount - 1)}/>
        </Pagination>}
  </Col>;
}