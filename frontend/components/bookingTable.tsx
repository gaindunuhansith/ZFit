// components/BookingTable.tsx
"use client";
import { Booking } from "@/services/bookingApi";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface BookingTableProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

export default function BookingTable({ bookings, onEdit, onDelete }: BookingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class</TableHead>
          <TableHead>Trainer</TableHead>
          <TableHead>Facility</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((b) => (
          <TableRow key={b._id}>
            <TableCell className="font-mono text-xs">{b.classId}</TableCell>
            <TableCell className="font-mono text-xs">{b.trainerId}</TableCell>
            <TableCell className="font-mono text-xs">{b.facilityId}</TableCell>
            <TableCell>{b.date}</TableCell>
            <TableCell>{b.time}</TableCell>
            <TableCell className="space-x-2">
              <Button size="sm" onClick={() => onEdit(b)}>✏️ Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(b)}>🗑️ Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
