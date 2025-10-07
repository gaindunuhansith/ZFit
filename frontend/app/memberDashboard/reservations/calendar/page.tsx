"use client";

import { useEffect, useState } from "react";
import CalendarView from "@/components/calendarView";
import { bookingApi, Booking } from "@/services/bookingApi";

export default function MemberCalendarPage() {
	const [rows, setRows] = useState<Booking[]>([]);

	useEffect(() => {
		async function load() {
			try {
				const mine = await bookingApi.getMyBookings();
				setRows(mine);
			} catch {}
		}
		void load();
	}, []);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">My Calendar</h1>
			<CalendarView bookings={rows} />
		</div>
	);
}


