export const generateGoogleCalenderUrl = (booking, listing) => {
    const start = new Date(booking.checkIn)
    .toDateString()
     .replace(/-|:|\.\d+/g, "");

     const end = new Date(booking.checkOut)
     .toISOString()
    .replace(/-|:|\.\d+/g, "");

    const title = encodeURIComponent(`Stay Booking - ${listing.title}`);
  const details = encodeURIComponent(
    `Your stay at ${listing.title} is confirmed.`
  );
  const location = encodeURIComponent(listing.location);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
};







































export const generateICS = (booking, listing) => {
  const startDate = new Date(booking.checkIn);
  const endDate = new Date(booking.checkOut);

  const formatDate = (date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Airbnb Clone//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${booking._id}
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Stay Booking - ${listing.title}
DESCRIPTION:Your stay at ${listing.title} is confirmed.
LOCATION:${listing.location}
END:VEVENT
END:VCALENDAR
`;

  return icsContent.trim();
};