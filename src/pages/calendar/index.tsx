import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../utilities/AuthProvider';

// const events = [{ title: 'Meeting', start: new Date() }];

const renderEventContent = (eventInfo: any) => {
  return <span className="bg-slate-100 w-full py-1 px-2">{eventInfo.event.title}</span>;
};

const Calendar = () => {
  const user = useContext(AuthContext);
  const [events, setEvents] = useState<{ [key: string]: any }[]>([]);

  const handleEventTitle = (accounts: { [key: string]: any }) => {
    if (accounts.accountType === 'income') return `${accounts.description} +${accounts.amount.toLocaleString()}`;
    if (accounts.accountType === 'expense') return `${accounts.description} -${accounts.amount.toLocaleString()}`;
  };

  const getEventList = async (uid: string) => {
    let events: { [key: string]: any }[] = [];
    const querySnapshot = await getDocs(collection(db, uid));
    querySnapshot.forEach((doc) => {
      events.push({
        title: `${handleEventTitle(doc.data())}`,
        start: doc.data().date.toDate(),
      });
    });
    setEvents(events);
    return events;
  };

  useEffect(() => {
    user.uid && getEventList(user.uid);
  }, []);

  return (
    <main className="container mx-auto max-w-960 py-10">
      <FullCalendar
        locale={'ko'}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        eventContent={renderEventContent}
      />
    </main>
  );
};

export default Calendar;
