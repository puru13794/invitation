/**
 * ✏️  EDIT THIS FILE — every detail shown on the invitation lives here.
 * Anything wrapped in [square brackets] is a placeholder waiting for you.
 */

export const invitation = {
  groom: {
    name: "Purushottam Reddy",
    teluguName: "పురుషోత్తమ్ రెడ్డి",
    parents: "S/o Sri Ramakrishna Reddy & Smt. Anjanamma",
  },
  bride: {
    name: "Kavya Reddy",
    teluguName: "కావ్య రెడ్డి",
    parents: "D/o Late Sri Raja Gopal Reddy & Smt. Mani Kumari",
  },

  /**
   * Muhurtham in ISO format with the IST offset — drives the countdown and
   * the "Add to calendar" button. Example: "2026-12-14T10:30:00+05:30"
   */
  dateISO: "2026-10-12T10:00:00+05:30",
  /** How long the function runs, used for the calendar entry. */
  durationHours: 4,

  /** Shown exactly as written on the invitation. */
  dateText: "Monday, 12 October 2026",
  timeText: "10:00 AM onwards",
  teluguDateText: "సోమవారం, 12 అక్టోబర్ 2026",

  venue: {
    name: "Sri Suryanarayana Swamy Devalayam",
    address: "Balaji Nagar, NH 44, Kallur, Kurnool, Andhra Pradesh – 518003",
    /**
     * Paste your Google Maps share link here (e.g. https://maps.app.goo.gl/xxxx).
     * Used for the "Get Directions" button.
     */
    mapsLink: "https://maps.app.goo.gl/rLMGh42UFxNCVZKQ7",
    /**
     * The embedded map. To change it: open the place in Google Maps on a computer →
     * Share → "Embed a map" → copy just the https://www.google.com/maps/embed?pb=… part.
     */
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1800!2d78.0340442!3d15.7962432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb5ddc37f3d71bd%3A0x90637bdf2e636b9c!2sSri%20Suryanarayana%20Swamy%20Devalayam!5e0!3m2!1sen!2sin!4v1791200000000!5m2!1sen!2sin",
  },

  /** Order of the ceremony — edit, add or remove freely. */
  programme: [
    { time: "10:00 AM", title: "Ganapathi Puja", text: "Seeking Lord Ganesha's blessings for an auspicious beginning." },
    { time: "[10:30 AM]", title: "Thamboolam Exchange", text: "Both families exchange betel leaves, fruits & flowers — a promise made." },
    { time: "[11:00 AM]", title: "Ring Ceremony", text: "Purushottam & Kavya exchange rings before family and friends." },
    { time: "[12:30 PM]", title: "Vindhu Bhojanam", text: "A traditional feast served on banana leaves. Please join us!" },
  ],

  hosts: "Ramakrishna Reddy's Family & Gopal Reddy's Family",
  /** Shared via WhatsApp / native share. */
  shareText: "You're invited to the engagement of Purushottam Reddy & Kavya Reddy 💍",

  /**
   * Background music (loops). Replace /public/music/engagement.mp3 to change it.
   * If the file is ever missing, a built-in Carnatic-style melody plays instead.
   */
  musicSrc: "/music/engagement.mp3",
} as const;

export type Invitation = typeof invitation;
