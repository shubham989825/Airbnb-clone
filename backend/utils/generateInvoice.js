import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { PassThrough } from "stream";

const generateInvoice = (booking, user, listing) => {
  return new Promise((resolve, reject) => {

    const invoicesDir = path.join(process.cwd(), "invoices");

    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filePath = path.join(invoicesDir, `invoice-${booking._id}.pdf`);
    const doc = new PDFDocument();
    const fileStream = fs.createWriteStream(filePath);
    const bufferStream = new PassThrough();
    const chunks = [];

    bufferStream.on("data", (chunk) => chunks.push(chunk));
    bufferStream.on("error", reject);
    fileStream.on("error", reject);

    doc.pipe(bufferStream);
    bufferStream.pipe(fileStream);

    // Title
    doc.fontSize(24).text("airbnb Invoice", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(16).text(`Booking ID: ${booking._id}`);

    doc.text(`Customer: ${user.name}`);

    doc.text(`Email: ${user.email}`);

    doc.text(`Property: ${listing.title}`);

    doc.text(`Location: ${listing.location}`);

    doc.text(`Check In: ${booking.checkIn}`);

    doc.text(`Check Out: ${booking.checkOut}`);

    doc.text(`Total Paid: ₹${booking.totalPrice}`);

    doc.moveDown();

    doc.text("Payment Status: PAID");

    doc.text("Thank you for booking with airbnb ❤️");

    doc.end();

    fileStream.on("finish", () => {
      resolve(Buffer.concat(chunks));
    });
  });
};

export default generateInvoice;