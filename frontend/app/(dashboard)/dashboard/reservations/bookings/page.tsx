		"use client";

		import { useEffect, useMemo, useState } from "react";
		import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
		import { Button } from "@/components/ui/button";
		import { Input } from "@/components/ui/input";
		import { Label } from "@/components/ui/label";
		import BookingTable from "@/components/bookingTable";
		import CalendarView from "@/components/calendarView";
		import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

		interface BookingFormInput {
		memberId: string;
		classId: string;
		trainerId: string;
		facilityId: string;
		classType: string;
		scheduledDate: string; // ISO string
		fee: number;
		status?: string;
		}

		interface ClassItem { _id: string; name: string; classTypes: string[]; }
		interface Trainer { _id: string; name: string; }
		interface Facility { _id: string; name: string; }
		interface Booking { _id: string; classId: string; trainerId: string; facilityId: string; classType: string; scheduledDate: string; fee: number; status: string; }

		export default function AdminBookingsPage() {
		const [rows, setRows] = useState<Booking[]>([]);
		const [classes, setClasses] = useState<ClassItem[]>([]);
		const [trainers, setTrainers] = useState<Trainer[]>([]);
		const [facilities, setFacilities] = useState<Facility[]>([]);
		const [filter, setFilter] = useState("");
		const [date, setDate] = useState<string>("");
		const [statusFilter, setStatusFilter] = useState("all");

		const [isAddOpen, setIsAddOpen] = useState(false);
		const [form, setForm] = useState<Partial<BookingFormInput>>({});

		// Fetch data from backend
		useEffect(() => {
			async function fetchData() {
			try {
				const [cRes, tRes, fRes, bRes] = await Promise.all([
				fetch("http://localhost:5000/api/v1/classes"),
				fetch("http://localhost:5000/api/v1/trainers"),
				fetch("http://localhost:5000/api/v1/facilities"),
				fetch("http://localhost:5000/api/v1/Booking")
				]);
				const [c, t, f, b] = await Promise.all([cRes.json(), tRes.json(), fRes.json(), bRes.json()]);
				setClasses(c.data || []);
				setTrainers(t.data || []);
				setFacilities(f.data || []);
				setRows(b.data || []);
			} catch (err) {
				console.error("Failed to fetch data", err);
			}
			}
			void fetchData();
		}, []);

		const filtered = useMemo(() => {
			const fText = filter.toLowerCase();
			return rows.filter((b) => {
			const className = classes.find(c => c._id === b.classId)?.name.toLowerCase() || "";
			const matchesText = !fText || className.includes(fText);
			const matchesDate = !date || b.scheduledDate.split("T")[0] === date;
			const matchesStatus = statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();
			return matchesText && matchesDate && matchesStatus;
			});
		}, [rows, classes, filter, date, statusFilter]);

		// Delete booking
		const onDelete = async (b: Booking) => {
			try {
			await fetch(`http://localhost:5000/api/v1/Booking/${b._id}`, { method: "DELETE" });
			setRows(prev => prev.filter(x => x._id !== b._id));
			} catch (err) {
			console.error("Failed to delete booking", err);
			}
		};

		// Update booking date/time
		const onEdit = async (b: Booking) => {
			const nd = prompt("New date (YYYY-MM-DD)", b.scheduledDate.split("T")[0]) || b.scheduledDate.split("T")[0];
			const nt = prompt("New time (HH:MM)", b.scheduledDate.split("T")[1]?.slice(0,5) || "00:00") || b.scheduledDate.split("T")[1]?.slice(0,5);
			try {
			const res = await fetch(`http://localhost:5000/api/v1/Booking/${b._id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ scheduledDate: `${nd}T${nt}` })
			});
			const updated = await res.json();
			setRows(prev => prev.map(x => x._id === b._id ? updated.data : x));
			} catch (err) {
			console.error("Failed to update booking", err);
			}
		};

		const refreshByDate = async () => {
			if (!date) return;
			try {
			const res = await fetch(`http://localhost:5000/api/v1/Booking?date=${date}`);
			const data = await res.json();
			setRows(data.data || []);
			} catch (err) {
			console.error("Failed to fetch bookings by date", err);
			}
		};

		// Generate CSV report
		const generateReport = () => {
			if (filtered.length === 0) return alert("No bookings to export.");
			const headers = ["Class", "Trainer", "Facility", "Date", "Time", "Status", "Fee"];
			const rowsData = filtered.map(b => [
			classes.find(c => c._id === b.classId)?.name || "-",
			trainers.find(t => t._id === b.trainerId)?.name || "-",
			facilities.find(f => f._id === b.facilityId)?.name || "-",
			b.scheduledDate.split("T")[0],
			b.scheduledDate.split("T")[1]?.slice(0,5) || "-",
			b.status,
			b.fee
			]);
			const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rowsData].map(e => e.join(",")).join("\n");
			const encodedUri = encodeURI(csvContent);
			const link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", `bookings_report_${Date.now()}.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		};

		return (
			<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-center gap-4">
				<h1 className="text-2xl font-bold">Bookings</h1>
				<div className="flex gap-2 flex-wrap">
				<Button variant="secondary" onClick={() => { setFilter(""); setDate(""); setStatusFilter("all"); }}>Reset</Button>
				<Button onClick={refreshByDate} disabled={!date}>Filter by date</Button>
				<Button onClick={() => setIsAddOpen(true)}>Add Booking</Button>
				<Button onClick={generateReport}>Generate Report</Button>
				</div>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader><CardTitle>Filters</CardTitle></CardHeader>
				<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
					<div>
					<Label>Search</Label>
					<Input value={filter} placeholder="Search by class" onChange={e => setFilter(e.target.value)} />
					</div>
					<div>
					<Label>Date</Label>
					<Input type="date" value={date} onChange={e => setDate(e.target.value)} />
					</div>
					<div>
					<Label>Status</Label>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-full">
						<SelectValue placeholder="Select status" />
						</SelectTrigger>
						<SelectContent>
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="confirmed">Confirmed</SelectItem>
						<SelectItem value="cancelled">Cancelled</SelectItem>
						<SelectItem value="completed">Completed</SelectItem>
						<SelectItem value="rescheduled">Rescheduled</SelectItem>
						</SelectContent>
					</Select>
					</div>
				</div>
				</CardContent>
			</Card>

			{/* Bookings Table */}
			<Card>
				<CardHeader><CardTitle>All Bookings</CardTitle></CardHeader>
				<CardContent>
				<BookingTable bookings={filtered} onEdit={onEdit} onDelete={onDelete} />
				</CardContent>
			</Card>

			{/* Calendar */}
			<Card>
				<CardHeader><CardTitle>Calendar</CardTitle></CardHeader>
				<CardContent>
				<CalendarView bookings={rows} />
				</CardContent>
			</Card>

			{/* Add Booking Modal */}
			{isAddOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
				<div className="bg-card dark:bg-card p-6 rounded shadow-lg max-w-lg w-full">
					<h2 className="text-xl font-bold mb-4">Add Booking</h2>
					<div className="space-y-3">
					<div>
						<Label>Class</Label>
						<Select value={form.classId || ""} onValueChange={v => setForm({ ...form, classId: v, classType: classes.find(c => c._id === v)?.classTypes[0] })}>
						<SelectTrigger className="w-full"><SelectValue placeholder="Select class" /></SelectTrigger>
						<SelectContent>
							{classes.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
						</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Class Type</Label>
						<Select value={form.classType || ""} onValueChange={v => setForm({ ...form, classType: v })}>
						<SelectTrigger className="w-full"><SelectValue placeholder="Select class type" /></SelectTrigger>
						<SelectContent>
							{classes.find(c => c._id === form.classId)?.classTypes.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}
						</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Trainer</Label>
						<Select value={form.trainerId || ""} onValueChange={v => setForm({ ...form, trainerId: v })}>
						<SelectTrigger className="w-full"><SelectValue placeholder="Select trainer" /></SelectTrigger>
						<SelectContent>{trainers.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Facility</Label>
						<Select value={form.facilityId || ""} onValueChange={v => setForm({ ...form, facilityId: v })}>
						<SelectTrigger className="w-full"><SelectValue placeholder="Select facility" /></SelectTrigger>
						<SelectContent>{facilities.map(f => <SelectItem key={f._id} value={f._id}>{f.name}</SelectItem>)}</SelectContent>
						</Select>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div>
						<Label>Date</Label>
						<Input type="date" value={form.scheduledDate?.split("T")[0] || ""} onChange={e => {
							const time = form.scheduledDate?.split("T")[1] || "00:00";
							setForm({ ...form, scheduledDate: `${e.target.value}T${time}` });
						}} />
						</div>
						<div>
						<Label>Time</Label>
						<Input type="time" value={form.scheduledDate?.split("T")[1]?.slice(0,5) || ""} onChange={e => {
							const datePart = form.scheduledDate?.split("T")[0] || new Date().toISOString().split("T")[0];
							setForm({ ...form, scheduledDate: `${datePart}T${e.target.value}` });
						}} />
						</div>
					</div>

					<div>
						<Label>Fee</Label>
						<Input type="number" min={0} value={form.fee || 0} onChange={e => setForm({ ...form, fee: Number(e.target.value) })} />
					</div>

					<div className="flex justify-end gap-2 mt-3">
						<Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
						<Button onClick={async () => {
						if (!form.classId || !form.trainerId || !form.facilityId || !form.classType || !form.scheduledDate) {
							return alert("Please fill all required fields");
						}
						try {
							const res = await fetch("http://localhost:5000/api/v1/Booking", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(form)
							});
							const newBooking = await res.json();
							setRows(prev => [...prev, newBooking.data]);
							setIsAddOpen(false);
						} catch (err) {
							console.error("Failed to add booking", err);
							alert("Failed to add booking");
						}
						}}>Save</Button>
					</div>
					</div>
				</div>
				</div>
			)}
			</div>
		);
		}
