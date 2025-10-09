"use client";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface Booking {
  _id: string;
  classId: { _id: string; name: string } | string;
  trainerId: { _id: string; name: string } | string;
  facilityId: { _id: string; name: string } | string;
  classType: string;
  fee: number;
  scheduledDate: string;
  status: string;
}

interface Props {
  bookings: Booking[];
  onReschedule: (b: Booking) => void;
  onCancel: (b: Booking) => void;
}

export default function BookingTable({ bookings, onReschedule, onCancel }: Props) {
  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString() : "N/A";
  const formatTime = (iso?: string) => iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A";
  const getName = (item: any) => typeof item === "object" ? item.name : "N/A";

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Trainer</TableHead>
          <TableHead>Facility</TableHead>
          <TableHead>Fee (LKR)</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4 text-gray-500">No bookings found.</TableCell>
          </TableRow>
        ) : bookings.map(b => (
          <TableRow key={b._id}>
            <TableCell>{getName(b.classId)}</TableCell>
            <TableCell>{b.classType}</TableCell>
            <TableCell>{getName(b.trainerId)}</TableCell>
            <TableCell>{getName(b.facilityId)}</TableCell>
            <TableCell>{b.fee?.toLocaleString() || "0"}</TableCell>
            <TableCell>{formatDate(b.scheduledDate)}</TableCell>
            <TableCell>{formatTime(b.scheduledDate)}</TableCell>
            <TableCell className="capitalize">{b.status}</TableCell>
            <TableCell className="space-x-2">
              {b.status !== "cancelled" && b.status !== "completed" && (
                <>
                  <Button size="sm" onClick={() => onReschedule(b)}>🔄 Reschedule</Button>
                  <Button size="sm" variant="destructive" onClick={() => onCancel(b)}>❌ Cancel</Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
