'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ScheduleI } from "@/interface";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const times = Array.from({ length: 9 }, (_, i) => 9 + i); // 9–17

const Page = () => {
    const params = useParams<{ id: string }>();
    const [scheduleData, setScheduleData] = useState<ScheduleI | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDay, setCurrentDay] = useState<string | null>(null);
    const [currentHour, setCurrentHour] = useState<number | null>(null);
    const [displayedDayIndex, setDisplayedDayIndex] = useState(() => (new Date().getDay() + 6) % 7);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!params.id) return;
            try {
                const response = await fetch(`https://raw.githubusercontent.com/T00287895/schedule/refs/heads/main/${params.id}.json`);
                if (!response.ok) throw new Error("Failed to fetch schedule data");
                const data = await response.json();
                setScheduleData(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [params.id]);

    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            setCurrentDay(daysOfWeek[now.getDay()]);
            setCurrentHour(now.getHours());
        };
        updateCurrentTime();
        const intervalId = setInterval(updateCurrentTime, 60000); // Update every minute
        return () => clearInterval(intervalId);
    }, []);

    const handleNextDay = () => setDisplayedDayIndex((prev) => (prev + 1) % 7);
    const handlePrevDay = () => setDisplayedDayIndex((prev) => (prev - 1 + 7) % 7);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!scheduleData) return <div className="p-4">No schedule data found.</div>;

    const displayedDay = days[displayedDayIndex];
    const classesForDisplayedDay = scheduleData[displayedDay];

    const getLessonRowStyle = (day: string, startAt: number, endAt: number) => {
        if (currentDay === day && currentHour !== null && currentHour >= startAt && currentHour < endAt) {
            return { backgroundColor: "#90ee90" }; // Light green accent
        }
        return {};
    };

    return (
        <div className="p-4">
            {/* Mobile View */}
            <div className="md:hidden">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevDay} className="px-4 py-2 bg-gray-200">Back</button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold">{displayedDay.charAt(0).toUpperCase() + displayedDay.slice(1)}</h2>
                        <span className="text-sm text-gray-500">{params.id.replace(/_/g, ' ')}</span>
                    </div>
                    <button onClick={handleNextDay} className="px-4 py-2 bg-gray-200">Next</button>
                </div>
                <div className="space-y-2">
                    {times.map((hour) => {
                        const match = classesForDisplayedDay.find(c => c.startAt === hour);
                        if (match) {
                            return (
                                <div key={hour} className="p-2 border" style={getLessonRowStyle(displayedDay, match.startAt, match.endAt)}>
                                    <div className="font-bold">{match.title}</div>
                                    <div>{match.room}</div>
                                    <div>{match.tutor}</div>
                                    <div className="text-sm text-gray-600">{match.startAt}:00 - {match.endAt}:00</div>
                                </div>
                            );
                        }
                        const inside = classesForDisplayedDay.some(c => c.startAt < hour && c.endAt > hour);
                        if (inside) return null;
                        return <div key={hour} className="h-10" />;
                    })}
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <h1 className="text-2xl font-bold mb-4 text-center">{params.id.replace(/_/g, ' ')}</h1>
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Time</th>
                            {days.map((day) => (
                                <th className="border border-gray-300 p-2" key={day}>
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {times.map((hour) => (
                            <tr key={hour}>
                                <td className="border border-gray-300 p-2 font-mono">{`${hour}:00`}</td>
                                {days.map((day) => {
                                    const match = scheduleData[day].find(c => c.startAt === hour);
                                    if (match) {
                                        return (
                                            <td key={day} rowSpan={match.endAt - match.startAt} className="border border-gray-300 p-2 align-top" style={getLessonRowStyle(day, match.startAt, match.endAt)}>
                                                <strong>{match.title}</strong><br />
                                                <em>{match.room}</em><br />
                                                <small>{match.tutor}</small>
                                            </td>
                                        );
                                    }
                                    const inside = scheduleData[day].some(c => c.startAt < hour && c.endAt > hour);
                                    if (inside) return null;
                                    return <td key={day} className="border border-gray-300 p-2"></td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Page;
