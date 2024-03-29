import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/client';
import styles from './EventDashboard.module.css';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import { LeftDrawerEventWrapper } from 'components/LeftDrawerEvent/LeftDrawerEventWrapper';
import { Navigate, useParams } from 'react-router-dom';
import actionItemsContainer from '../../components/ActionItems/ActionItemsContainer';
import { ActionItemsModalBody } from 'components/ActionItems/ActionItemsModalBody';
import events from '../UserPortal/Events/Events';

const EventDashboard = (): JSX.Element => {
  // Get the Event ID from the URL
  document.title = 'Event Dashboard';

  const { eventId } = useParams();
  if (!eventId) {
    return <Navigate to={'/orglist'} />;
  }

  // Data fetching
  const { data: eventData, loading: eventInfoLoading } = useQuery(
    EVENT_DETAILS,
    {
      variables: { id: eventId },
    },
  );

  // Render the loading screen
  if (eventInfoLoading) {
    return <Loader />;
  }

  function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').slice(0, 2);
    return `${hours}:${minutes}`;
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const suffixes = ['th', 'st', 'nd', 'rd'];
    const suffix = suffixes[day % 10] || suffixes[0];

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const formattedDate = `${day}${suffix} ${monthNames[monthIndex]} ${year}`;
    return formattedDate;
  }

  return (
    <LeftDrawerEventWrapper
      event={eventData.event}
      key={`${eventData?.event._id || 'loading'}EventDashboard`}
    >
      <ActionItemsModalBody
        eventId={eventData.event._id}
        organizationId={eventData.event.organization._id}
      />
    </LeftDrawerEventWrapper>
  );
};

export default EventDashboard;
