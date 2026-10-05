/**
 * ✏️  EDIT THIS FILE — every detail shown on the invitation lives here.
 * Anything wrapped in [square brackets] is a placeholder waiting for you.
 */

export const invitation = {
  groom: {
    name: "Purushottam Reddy",
    teluguName: "పురుషోత్తమ్ రెడ్డి",
    parents: "S/o [Father's Name] & [Mother's Name]",
  },
  bride: {
    name: "Kavya Reddy",
    teluguName: "కావ్య రెడ్డి",
    parents: "D/o [Father's Name] & [Mother's Name]",
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
     * What the embedded map should point at: the venue's name + city,
     * or exact coordinates like "17.4935,78.3910".
     */
    mapQuery: "Sri Suryanarayana Swamy Devalayam, Balaji Nagar, Kallur, Kurnool, Andhra Pradesh 518003",
  },

  /** Order of the ceremony — edit, add or remove freely. */
  programme: [
    { time: "10:00 AM", title: "Ganapathi Puja", text: "Seeking Lord Ganesha's blessings for an auspicious beginning." },
    { time: "[10:30 AM]", title: "Thamboolam Exchange", text: "Both families exchange betel leaves, fruits & flowers — a promise made." },
    { time: "[11:00 AM]", title: "Ring Ceremony", text: "Purushottam & Kavya exchange rings before family and friends." },
    { time: "[12:30 PM]", title: "Vindhu Bhojanam", text: "A traditional feast served on banana leaves. Please join us!" },
  ],

  hosts: "[Groom's Family] & [Bride's Family]",
  /** Shared via WhatsApp / native share. */
  shareText: "You're invited to the engagement of Purushottam Reddy & Kavya Reddy 💍",

  /**
   * Background music. Drop an MP3 at /public/music/engagement.mp3 and it will
   * be used automatically. If the file is missing, a built-in Carnatic-style
   * melody (raga Mohanam with tanpura & temple bells) plays instead.
   */
  musicSrc: "/music/engagement.mp3",
} as const;

export type Invitation = typeof invitation;
