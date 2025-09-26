'use client';

import {useEffect, useState} from "react";
import {ScheduleI} from "@/interface";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const times = Array.from({ length: 9 }, (_, i) => 9 + i); // 9–17

const Page = ({ params }: { params: { id: string } }) => {
    const [scheduleData, setScheduleData] = useState<ScheduleI | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDay, setCurrentDay] = useState<string | null>(null);
    const [currentHour, setCurrentHour] = useState<number | null>(null);
    const [displayedDayIndex, setDisplayedDayIndex] = useState(new Date().getDay() - 1);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch(`https://raw.githubusercontent.com/T00287895/schedule/refs/heads/main/${params.id}.json`);
                if (!response.ok) {
                    throw new Error("Failed to fetch schedule data");
                }
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
            const dayIndex = now.getDay();
            const hour = now.getHours();
            const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const currentDayName = daysOfWeek[dayIndex];
            const scheduleDay = days.find(d => d === currentDayName);

            setCurrentDay(scheduleDay || null);
            setCurrentHour(hour);
        };

        updateCurrentTime();
        const intervalId = setInterval(updateCurrentTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleNextDay = () => {
        setDisplayedDayIndex((prevIndex) => (prevIndex + 1) % 7);
    };

    const handlePrevDay = () => {
        setDisplayedDayIndex((prevIndex) => (prevIndex - 1 + 7) % 7);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!scheduleData) return <div>No schedule data found.</div>;

    const displayedDay = days[displayedDayIndex];
    const classesForDisplayedDay = scheduleData[displayedDay];

    const getLessonRowStyle = (day: string, startAt: number, endAt: number) => {
        if (currentHour === null) return {};
        return currentDay === day && currentHour >= startAt && currentHour < endAt ? { backgroundColor: "#90ee90" } : {};
    };

    return (
        <div>
            <div className="max-[1100px]:block hidden">
                <div className="flex justify-between items-center p-4">
                    <button onClick={handlePrevDay} className="px-4 py-2 bg-gray-200 rounded">Back</button>
                    <h2 className="text-xl font-bold">{displayedDay.charAt(0).toUpperCase() + displayedDay.slice(1)}</h2>
                    <button onClick={handleNextDay} className="px-4 py-2 bg-gray-200 rounded">Next</button>
                </div>
                <div className="p-4">
                    {times.map((hour) => {
                        const match = classesForDisplayedDay.find(c => c.startAt === hour);
                        if (match) {
                            const lessonStyle = getLessonRowStyle(displayedDay, match.startAt, match.endAt);
                            return (
                                <div key={hour} className="mb-4 p-4 border" style={lessonStyle}>
                                    <div className="font-bold text-lg">{match.title}</div>
                                    <div>{match.room}</div>
                                    <div>{match.tutor}</div>
                                    <div className="text-sm text-gray-600">{match.startAt}:00 - {match.endAt}:00</div>
                                </div>
                            );
                        }
                        const inside = classesForDisplayedDay.some(c => c.startAt < hour && c.endAt > hour);
                        if (inside) return null;
                        return (
                            <div key={hour} />
                        );
                    })}
                </div>
            </div>

            <div className="hidden min-[1100px]:block">
                <table className="w-full text-sm text-left text-gray-900 dark:text-gray-400 shadow-lg rounded-lg">
                    <thead className="text-xs text-black uppercase dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Time</th>
                        {days.map((day) => (
                            <th scope="col" className="px-6 py-3" key={day}>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {times.map((hour) => (
                        <tr className="dark:border-gray-200" key={hour}>
                            <td className="px-6 py-4 bg-white border">{`${hour}:00`}</td>
                            {days.map((day) => {
                                const classes = scheduleData[day];
                                const match = classes.find(c => c.startAt === hour);

                                if (match) {
                                    const lessonStyle = getLessonRowStyle(day, match.startAt, match.endAt);
                                    return (
                                        <td key={day} rowSpan={match.endAt - match.startAt} className="px-6 py-4 bg-white border" style={lessonStyle}>
                                            <strong>{match.title}</strong><br />
                                            <em>{match.room}</em><br />
                                            <small>{match.tutor}</small>
                                        </td>
                                    );
                                }

                                const inside = classes.some(c => c.startAt < hour && c.endAt > hour);
                                if (inside) return null;

                                return <td key={day} className="px-6 py-4 bg-white border"></td>;
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