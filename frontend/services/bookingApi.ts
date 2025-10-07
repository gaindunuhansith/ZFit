// Clean Booking API client (native fetch) with strict types and validations

export type ApiResponse<T> = { success: boolean; data: T; message?: string };

export type ClassItem = {
  _id: string;
  name: string;
  type: string;
  duration: number;
  maxCapacity: number;
  price: number;
  status: string;
};

export type Trainer = {
  _id: string;
  name: string;
  specialization: string;
  status: string;
};

export type Facility = {
  _id: string;
  name: string;
  capacity: number;
  status: string;
  equipments: string[];
};

export type Booking = {
  _id: string;
  classId: string;
  trainerId: string;
  facilityId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price?: number;
  userId?: string;
};

export type ReportRange = "daily" | "weekly" | "monthly" | "yearly";

const API_BASE = "http://localhost:5000";

async function toJson<T>(res: Response): Promise<ApiResponse<T>> {
  const json = (await res.json()) as ApiResponse<T>;
  return json;
}

async function httpGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { credentials: "include" });
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const json = await toJson<T>(res);
  if (!json.success) throw new Error(json.message || "Request failed");
  return json.data as T;
}

async function httpSend<T>(path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const json = await toJson<T>(res);
  if (!json.success) throw new Error(json.message || "Request failed");
  return json.data as T;
}

export const bookingApi = {
  getClasses(): Promise<ClassItem[]> { return httpGet<ClassItem[]>("/api/v1/bookings/classes"); },
  getTrainers(): Promise<Trainer[]> { return httpGet<Trainer[]>("/api/v1/bookings/trainers"); },
  getFacilities(): Promise<Facility[]> { return httpGet<Facility[]>("/api/v1/bookings/facilities"); },
  getAllBookings(): Promise<Booking[]> { return httpGet<Booking[]>("/api/v1/bookings"); },
  getMyBookings(): Promise<Booking[]> { return httpGet<Booking[]>("/api/v1/bookings?mine=true"); },
  getBookingsByDate(date: string): Promise<Booking[]> { return httpGet<Booking[]>(`/api/v1/bookings?date=${encodeURIComponent(date)}`); },
  createBooking(body: { classId: string; trainerId: string; facilityId: string; date: string; time: string; }): Promise<Booking> { return httpSend<Booking>("/api/v1/bookings", "POST", body); },
  updateBooking(id: string, body: Partial<Pick<Booking, "classId" | "trainerId" | "facilityId" | "date" | "time">>): Promise<Booking> { return httpSend<Booking>(`/api/v1/bookings/${id}`, "PATCH", body); },
  deleteBooking(id: string): Promise<{ _id: string }> { return httpSend<{ _id: string }>(`/api/v1/bookings/${id}`, "DELETE"); },
  cancelBooking(id: string): Promise<Booking> { return httpSend<Booking>(`/api/v1/bookings/${id}/cancel`, "POST"); },
  rescheduleBooking(id: string, body: { date: string; time: string }): Promise<Booking> { return httpSend<Booking>(`/api/v1/bookings/${id}/reschedule`, "POST", body); },
  getReports(params: { range: ReportRange; from: string; to: string }): Promise<Booking[]> {
    const q = `range=${encodeURIComponent(params.range)}&from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}`;
    return httpGet<Booking[]>(`/api/v1/reports?${q}`);
  },
};

// Validation helpers (exported for unit testing)
export function isFutureDateTime(dateISO: string, timeHHmm: string): boolean {
  try {
    const [h, m] = timeHHmm.split(":").map((v) => parseInt(v, 10));
    const dt = new Date(dateISO + "T00:00:00");
    dt.setHours(h, m, 0, 0);
    return dt.getTime() > Date.now();
  } catch { return false; }
}

export function cancellationDeadlineISO(dateISO: string): string {
  const d = new Date(dateISO + "T00:00:00");
  return d.toISOString().slice(0, 16).replace("T", " ");
}

export function canCancel(dateISO: string): boolean {
  return Date.now() < new Date(dateISO + "T00:00:00").getTime();
}

export function validateClassConstraints(ci: ClassItem): string | null {
  if (ci.maxCapacity <= 0) return "Class seats must be greater than 0";
  if (ci.maxCapacity > 20) return "Class seats cannot exceed 20";
  if (ci.duration < 40) return "Class duration must be at least 40 minutes";
  if (ci.price <= 0) return "Price must be greater than 0";
  return null;
}


