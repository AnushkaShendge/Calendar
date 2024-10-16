import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewDay, createViewMonthGrid } from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/calendar.css';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "../UserContext";  

function Calendar() {
  const [events, setEvents] = useState([]);  
  const [selectedDate, setSelectedDate] = useState(new Date());  
  const { id } = useContext(UserContext);  
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/calendar/${id}`);  
        setEvents(response.data.events);  

        const fetchedDate = new Date(response.data.selectedDate);
        if (!isNaN(fetchedDate.getTime())) {
          setSelectedDate(fetchedDate);  
        } else {
          console.error('Invalid date format:', response.data.selectedDate);
          setSelectedDate(new Date()); // fallback to current date
        }
      } catch (error) {
        console.error('Error fetching calendar data:', error);  
      }
    };
    fetchCalendarData();
  }, [id]);  

  const calendar = useCalendarApp({
    views: [
      createViewWeek(),
      createViewDay(),
      createViewMonthGrid()
    ],
    events: events,  
    selectedDate:   selectedDate,
  });

  return (
    <>
        <div className="w-full p-8 flex items-center" >
            <ScheduleXCalendar calendarApp={calendar} className="w-full h-full"/>
        </div>
    </>
  );
}

export default Calendar;