import { Meeting } from "../meeting/meeting.model";

// Handle new meeting scheduled
export async function handleInviteeCreated(user, payload) {
  // Extract invitee details
  const {
    uri: inviteeUri,
    email: studentEmail,
    name: studentName,
    scheduled_event
  } = payload.invitee;
  
  const inviteeId = inviteeUri.split('/').pop();
  const eventId = scheduled_event.uri.split('/').pop();
  
  // Create meeting record
  const meeting = await Meeting.findOneAndUpdate(
    { calendlyEventId: eventId },
    {
      calendlyEventId: eventId,
      calendlyInviteeId: inviteeId,
      mentorId: user._id,
      studentEmail,
      studentName,
      eventType: payload.event_type?.name || 'Session',
      scheduledAt: new Date(scheduled_event.start_time),
      duration: scheduled_event.duration,
      location: scheduled_event.location?.type || 'virtual',
      status: 'scheduled',
      rawPayload: payload
    },
    { upsert: true, new: true }
  );
  
  // Notify mentor (in-app + email)
  await sendMeetingNotification({
    userId: user._id,
    type: 'new_meeting',
    data: {
      studentName,
      studentEmail,
      scheduledAt: meeting.scheduledAt,
      meetingId: meeting._id
    }
  });
  
  console.log(`✅ New meeting created: ${meeting._id} for mentor ${user.email}`);
}
