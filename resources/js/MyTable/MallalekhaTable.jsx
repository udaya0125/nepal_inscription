import React, { useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import { Edit, Trash2 } from "lucide-react";

const IconChevronUp = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

const IconChevronDown = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const MallalekhaTable = ({
    data = [],
    pagination = null,
    currentPage = 1,
    loading = false,
    deletingId = null,
    onPageChange,
    onEdit,
    onDelete,
}) => {
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                accessor: "index",
                Cell: ({ row }) => (
                    <span>{(currentPage - 1) * 10 + row.index + 1}</span>
                ),
            },
            {
                Header: "Banner",
                accessor: "banner_image",
                Cell: ({ value, row }) =>
                    value ? (
                        <img
                            src={`${imgurl}/${value}`}
                            alt={row.original.title}
                            className="w-14 h-10 object-cover rounded border"
                        />
                    ) : (
                        <span className="text-gray-300 italic text-xs">
                            No image
                        </span>
                    ),
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <div className="max-w-[160px] truncate font-medium text-gray-800">
                        {value}
                    </div>
                ),
            },
            {
                Header: "WCHN ID",
                accessor: "wchn_id",
                Cell: ({ value }) => (
                    <span className="text-gray-600">
                        {value || <span className="text-gray-300">—</span>}
                    </span>
                ),
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            value === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                        {value === "published" ? "Published" : "Draft"}
                    </span>
                ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => onEdit(row.original)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(row.original.id)}
                            disabled={deletingId === row.original.id}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-40"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        [currentPage, deletingId]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy);

    const { key: tableKey, ...tableProps } = getTableProps();

    return (
        <div className="w-full bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden mt-6">
            {/* Table */}
            <div className="overflow-x-auto">
                <table {...tableProps} className="w-full">
                    <thead>
                        {headerGroups.map((headerGroup) => {
                            const { key: hgKey, ...hgProps } =
                                headerGroup.getHeaderGroupProps();
                            return (
                                <tr key={hgKey} {...hgProps}>
                                    {headerGroup.headers.map((column) => {
                                        const { key: hKey, ...hProps } =
                                            column.getHeaderProps(
                                                column.getSortByToggleProps()
                                            );
                                        return (
                                            <th
                                                key={hKey}
                                                {...hProps}
                                                className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase border-b border-blue-100 bg-blue-100"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{column.render("Header")}</span>
                                                    <span className="ml-2">
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <IconChevronDown />
                                                            ) : (
                                                                <IconChevronUp />
                                                            )
                                                        ) : (
                                                            <span className="w-4 h-4" />
                                                        )}
                                                    </span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </thead>

                    <tbody
                        {...getTableBodyProps()}
                        className="divide-y divide-blue-100/50"
                    >
                        {loading ? (
                            // Loading skeleton rows
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-gray-50"}>
                                    {columns.map((col, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : rows.length > 0 ? (
                            rows.map((row, rowIndex) => {
                                prepareRow(row);
                                const { key: rowKey, ...rowProps } =
                                    row.getRowProps();
                                return (
                                    <tr
                                        key={row.original.id || rowKey}
                                        {...rowProps}
                                        className={`transition-colors duration-150 ${
                                            rowIndex % 2 === 0
                                                ? "bg-gray-100"
                                                : "bg-gray-50"
                                        } hover:bg-gray-200`}
                                    >
                                        {row.cells.map((cell) => {
                                            const { key: cellKey, ...cellProps } =
                                                cell.getCellProps();
                                            return (
                                                <td
                                                    key={cellKey}
                                                    {...cellProps}
                                                    className="px-6 py-4 whitespace-nowrap text-sm"
                                                >
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-10 text-center text-gray-400 text-sm"
                                >
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-300">
                    {/* Buttons */}
                    <div className="flex items-center sm:gap-2 gap-0.5">
                        <button
                            onClick={() => onPageChange(1)}
                            disabled={!pagination.has_prev || loading}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            {"<<"}
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={!pagination.has_prev || loading}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            {"<"}
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={!pagination.has_next || loading}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            {">"}
                        </button>
                        <button
                            onClick={() => onPageChange(pagination.last_page)}
                            disabled={!pagination.has_next || loading}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            {">>"}
                        </button>
                    </div>

                    {/* Page info */}
                    <span className="text-sm">
                        Page <strong>{pagination.current_page}</strong> of{" "}
                        <strong>{pagination.last_page}</strong>
                    </span>

                    {/* Record range */}
                    <span className="text-sm text-gray-500">
                        {pagination.from}–{pagination.to} of {pagination.total}
                    </span>
                </div>
            )}
        </div>
    );
};

export default MallalekhaTable;