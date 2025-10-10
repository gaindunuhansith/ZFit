"use client";
import React from "react";
import { bookingApi, Booking, ClassItem, Facility, ReportRange, Trainer } from "../../lib/api/bookingApi";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

export default function BookingReportsPage() {
  const [range, setRange] = React.useState<ReportRange>("daily");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [rows, setRows] = React.useState<Booking[]>([]);
  const [classes, setClasses] = React.useState<ClassItem[]>([]);
  const [trainers, setTrainers] = React.useState<Trainer[]>([]);
  const [facilities, setFacilities] = React.useState<Facility[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const classById = React.useMemo(() => new Map(classes.map((c) => [c._id, c] as const)), [classes]);
  const trainerById = React.useMemo(() => new Map(trainers.map((t) => [t._id, t] as const)), [trainers]);
  const facilityById = React.useMemo(() => new Map(facilities.map((f) => [f._id, f] as const)), [facilities]);

  React.useEffect(() => {
    async function prime() {
      try {
        const [c, t, f] = await Promise.all([
          bookingApi.getClasses(),
          bookingApi.getTrainers(),
          bookingApi.getFacilities(),
        ]);
        setClasses(c);
        setTrainers(t);
        setFacilities(f);
      } catch (e) {
        // ignore
      }
    }
    void prime();
  }, []);

  async function run() {
    setError(null);
    if (!from || !to) {
      setError("Please select from and to dates");
      return;
    }
    setLoading(true);
    try {
      const data = await bookingApi.getReports({ range, from, to });
      setRows(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function toCSV(): string {
    const header = ["_id","class","trainer","facility","date","time","price"];
    const lines = rows.map((b) => {
      const ci = classById.get(b.classId)?.name || "";
      const tr = trainerById.get(b.trainerId)?.name || "";
      const fa = facilityById.get(b.facilityId)?.name || "";
      const price = classById.get(b.classId)?.price ?? b.price ?? 0;
      return [b._id, ci, tr, fa, b.date, b.time, String(price)].map((v) => `"${String(v).replaceAll("\"", "\"\"")}"`).join(",");
    });
    return [header.join(","), ...lines].join("\n");
  }

  function downloadCSV() {
    const csv = toCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-report-${range}-${from}-to-${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const total = rows.length;
  const totalRevenue = rows.reduce((acc, b) => acc + (classById.get(b.classId)?.price ?? b.price ?? 0), 0);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Booking Reports</h1>
        <div className="space-x-2">
          <Button variant="secondary" onClick={downloadCSV} disabled={rows.length === 0}>Export CSV</Button>
          <Button onClick={run} disabled={loading}>Run</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label>Range</Label>
              <select className="w-full border rounded h-9 px-2" value={range} onChange={(e) => setRange(e.target.value as ReportRange)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <Label>From</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <Label>To</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="self-end">
              <Button onClick={run} disabled={loading}>Apply</Button>
            </div>
          </div>
          {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-3">Total bookings: {total} · Total revenue: ${totalRevenue.toFixed(2)}</div>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((b) => {
                  const ci = classById.get(b.classId);
                  const tr = trainerById.get(b.trainerId);
                  const fa = facilityById.get(b.facilityId);
                  const price = ci?.price ?? b.price ?? 0;
                  return (
                    <TableRow key={b._id}>
                      <TableCell className="font-mono text-xs">{b._id}</TableCell>
                      <TableCell>{ci?.name || "-"}</TableCell>
                      <TableCell>{tr?.name || "-"}</TableCell>
                      <TableCell>{fa?.name || "-"}</TableCell>
                      <TableCell>{b.date}</TableCell>
                      <TableCell>{b.time}</TableCell>
                      <TableCell>${price.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {rows.length === 0 && <div className="text-sm text-muted-foreground py-6 text-center">No results.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


