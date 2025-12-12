import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  // getPaginationRowModel,
} from "@tanstack/react-table";
import { assets } from "../../assets/asset";
import {useNavigate} from 'react-router-dom'

import { useState } from "react";
export default function BaseTable({ columns, data,actionLabel ,actionPath}) {
  
  const [rowSelection, setRowSelection] = useState({});

  const navigate=useNavigate()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    // getPaginationRowModel,
    enableRowSelection: true,
  });

  return (
    <div className="bg-white p-[16px] rounded-xl   ">
      <div className="mb-6 flex justify-between">
        <h2 className="text-[#0A4F48] font-bold text-[16px]">Clients</h2>
        <div className="flex gap-3">
          <div className="flex items-center bg-[#F8F8F8] px-3 rounded-lg">
            <img src={assets.search} className="  w-5 h-5  " />
            <input
              type="text"
              placeholder="Search anything"
              className=" w-72 px-[10px] py-[12px] border border-none rounded-xl  w-[250px]"
            />
            <img src={assets.filter} className="  w-4 h-4" />
          </div>
          <button className="bg-[#EBF3F2] rounded-md text-[12px] font-semibold px-3 py-0">All Status</button>
          <button className="bg-[#EBF3F2] rounded-md text-[12px] font-semibold px-3 py-0">Bulk Actions</button>
          <button onClick={()=>navigate(actionPath)} className="bg-[#0A4F48] text-white rounded-md text-[12px] font-semibold px-3 py-0">{actionLabel}</button>
        </div>
      </div>
      <table className="w-full text-sm border-collapse">
        <thead className="bg-[#F8F8F8] ">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left py-3 px-2 font-semibold text-black"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[#DBDEDD] hover:bg-gray-50 transition"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="py-5 px-2 text-[11px] font-medium text-black"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
